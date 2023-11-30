import { type MJson } from "@/modules/mJson/types/mJson";
import { getMJson } from "@/modules/mJson/states";
import {
    getCurrentGameIndex,
    getCurrentPositionEvents,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
    resetPositionIndex,
    setPositionEvents,
} from "@/modules/positionEvent/states";
import { type GameIndex, type PositionEvent } from "@/modules/positionEvent/types";
import { updateNumHundredSticks, updateNumThousandSticks } from "./betsDisplay";
import { setCenterDisplayVisibility, updateRoundText } from "./centerDisplay";
import { setClosingDisplayVisibility, setPlayerMatchResults } from "./closingDisplay";
import { updateDoraRightIndex, updateDoraTileIds } from "./doraDisplay";
import { hideGameResultDisplay, showGameResultDisplay } from "./gameResultDisplay";
import { setOpeningDisplayVisible, setPlayerNames } from "./openingDisplay";
import { showMeldDisplay } from "./meldDisplay";
import { resetScoreDisplayAll, updateScoreText } from "./scoreDisplay";
import { resetAllTiles, setTileAnimationAll, updateTile } from "./tile";
import { updateWindDisplay } from "./windDisplay";
import { resetRiichiStickAll, setShowsRiichiStick } from "./riichiStickDisplay";
import { setPlayerNamesVisibility, updatePlayerNames } from "./playerNameDisplay";
import { setMatchSelectWindowVisibility } from "./matchSelectWindow";

const positionNavigatorButtonClassName = "position-navigator-button";

const createButton = (onClick: () => void, icon: Element): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("flex-1", "flex", "justify-center", "item-stretch");
    const button = document.createElement("button");
    button.appendChild(icon);
    button.onclick = onClick;
    button.classList.add(
        "flex-auto",
        "bg-slate-700",
        "hover:bg-slate-500",
        "text-white",
        "mx-0.5",
        "my-0.5",
        "px-[min(2vw,2vh)]",
        "py-[min(2vw,2vh)]",
        "rounded",
        "flex",
        "justify-center",
        "items-center",
    );
    button.classList.add(positionNavigatorButtonClassName);
    // 初期状態
    button.disabled = true;

    container.appendChild(button);
    return container;
};

const handleGameIndexChanged = (newGameIndex: GameIndex): void => {
    setCenterDisplayVisibility(newGameIndex);
    setTileAnimationAll(false);
    if (newGameIndex === "pre") {
        resetAllTiles();
        setClosingDisplayVisibility(false);
        setOpeningDisplayVisible(true);
        setPlayerNamesVisibility(false);
    } else if (newGameIndex === "post") {
        resetAllTiles();
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(true);
        setPlayerNamesVisibility(false);
    } else {
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(false);
        setPlayerNamesVisibility(true);
        updateRoundText(newGameIndex);
        updateWindDisplay(getMJson().games[newGameIndex].round % 4);
        updateDoraTileIds(getMJson().games[newGameIndex].dora);
        updateDoraRightIndex(0);
    }
};

const handlePositionEvents = (events: readonly PositionEvent[], goesForward: boolean): void => {
    for (const event of events) {
        switch (event.kind) {
            case "dora":
                updateDoraRightIndex(event.rightIndex);
                break;
            case "gameResultDraw":
            case "gameResultWin":
                showGameResultDisplay(event);
                break;
            case "meld":
                if (goesForward) showMeldDisplay(event);
                break;
            case "riichiStick":
                setShowsRiichiStick(event);
                break;
            case "score":
                updateScoreText(event);
                break;
            case "tileTransition":
                if (goesForward === event.isForward) updateTile(event);
                break;
            case "hundredSticks":
                updateNumHundredSticks(event.value);
                break;
            case "thousandSticks":
                updateNumThousandSticks(event.value);
                break;
            default:
                break;
        }
    }
};

const enablePositionNavigatorButtons = (): void => {
    for (const element of document.getElementsByClassName(positionNavigatorButtonClassName)) {
        (element as HTMLButtonElement).disabled = false;
    }
};

const createIcon = (filename: string): HTMLObjectElement => {
    const element = document.createElement("object");
    element.setAttribute("type", "image/svg+xml");
    element.setAttribute("data", filename);
    element.classList.add("w-[min(5vw,5vh)]", "h-[min(5vw,5vh)]", "fill-floralwhite");
    return element;
};
// const createIcon = (iconId: string): SVGSVGElement => {
//     const container = document.createElementNS(svgNS, "svg");
//     container.classList.add("w-[min(5vw,5vh)]", "h-[min(5vw,5vh)]");
//     const element = document.createElementNS(svgNS, "use");
//     element.setAttribute("href", iconId);
//     container.appendChild(element);
//     return container;
// };

// exportはtemporary
export const handleMJsonChanged = (newMJson: MJson): void => {
    // PositionEvent
    setPositionEvents(newMJson);
    resetPositionIndex();
    // OpeningDisplay
    setPlayerNames(newMJson.players.map(({ name }) => name));
    // ClosingDisplay
    setPlayerMatchResults(newMJson.players);
    // ScoreDisplay
    resetScoreDisplayAll();
    resetRiichiStickAll();
    // PlayerNameDisplay
    updatePlayerNames(newMJson.players.map(({ name }) => name));
    // ControlPanel
    enablePositionNavigatorButtons();
    // あとはhandleGameIndexChangedに任せる
    handleGameIndexChanged("pre");
};

export const createControlPanel = (): HTMLDivElement => {
    const handleGoToPreviousPosition = (): void => {
        hideGameResultDisplay();
        setTileAnimationAll(false);
        const gameIsChanged = goToPreviousPosition();
        if (gameIsChanged) handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), false);
    };
    const handleGoToNextPosition = (): void => {
        hideGameResultDisplay();
        setTileAnimationAll(true);
        const gameIsChanged = goToNextPosition();
        if (gameIsChanged) {
            setTileAnimationAll(false);
            handleGameIndexChanged(getCurrentGameIndex());
        }
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const handleGoToPreviousGame = (): void => {
        hideGameResultDisplay();
        goToPreviousGame();
        handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const handleGoToNextGame = (): void => {
        hideGameResultDisplay();
        goToNextGame();
        handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const handleShowMatchSelectWindowButton = (): void => {
        setMatchSelectWindowVisibility(true);
    };

    // temporary
    const t = document.createElement("span");
    t.textContent = "t";
    // end temporary

    const panel = document.createElement("div");
    panel.append(
        createButton(handleGoToPreviousGame, createIcon("./arrows/white_double_left.svg")),
        createButton(handleGoToPreviousPosition, createIcon("./arrows/white_left.svg")),
        createButton(handleGoToNextPosition, createIcon("./arrows/white_right.svg")),
        createButton(handleGoToNextGame, createIcon("./arrows/white_double_right.svg")),
        createButton(handleShowMatchSelectWindowButton, t),
    );
    panel.classList.add(
        "flex",
        "portrait:w-[min(100vw,100vh)]",
        "portrait:flex-row",
        "landscape:h-[min(100vw,100vh)]",
        "landscape:flex-col",
    );
    return panel;
};
