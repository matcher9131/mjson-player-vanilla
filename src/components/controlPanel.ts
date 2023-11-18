import { getMJson } from "../modules/mJson/states";
import {
    getCurrentGameIndex,
    getCurrentPositionEvents,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
} from "../modules/positionEvent/states";
import { type GameIndex, type PositionEvent } from "../modules/positionEvent/types";
import { updateNumHundredSticks, updateNumThousandSticks } from "./betsDisplay";
import { setCenterDisplayVisibility, updateRoundText } from "./centerDisplay";
import { setClosingDisplayVisibility } from "./closingDisplay";
import { updateDoraRightIndex, updateDoraTileIds } from "./doraDisplay";
import { hideGameResult, showGameResult } from "./gameResult";
import { setOpeningDisplayVisible } from "./openingDisplay";
import { showOverlay } from "./overlayText";
import { setShowsRiichiStick, updateScoreText } from "./scoreDisplay";
import { resetAllTiles, setTileAnimationAll, updateTile } from "./tile";

const createButton = (onClick: () => void, text: string): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    button.classList.add("bg-slate-700", "text-white", "px-2", "py-2", "rounded");
    return button;
};

const handleGameIndexChanged = (newGameIndex: GameIndex): void => {
    updateRoundText(newGameIndex);
    setCenterDisplayVisibility(newGameIndex);
    setTileAnimationAll(false);
    if (newGameIndex === "pre") {
        resetAllTiles();
        setClosingDisplayVisibility(false);
        setOpeningDisplayVisible(true);
    } else if (newGameIndex === "post") {
        resetAllTiles();
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(true);
    } else {
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(false);
        // ドラをセットする
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
                showGameResult(event);
                break;
            case "meld":
                if (goesForward) showOverlay(event);
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

export const createControlPanel = (): HTMLDivElement => {
    const handleGoToPreviousPosition = (): void => {
        hideGameResult();
        setTileAnimationAll(false);
        const gameIsChanged = goToPreviousPosition();
        if (gameIsChanged) handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), false);
    };
    const handleGoToNextPosition = (): void => {
        hideGameResult();
        setTileAnimationAll(true);
        const gameIsChanged = goToNextPosition();
        if (gameIsChanged) {
            setTileAnimationAll(false);
            handleGameIndexChanged(getCurrentGameIndex());
        }
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const handleGoToPreviousGame = (): void => {
        hideGameResult();
        goToPreviousGame();
        handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const handleGoToNextGame = (): void => {
        hideGameResult();
        goToNextGame();
        handleGameIndexChanged(getCurrentGameIndex());
        handlePositionEvents(getCurrentPositionEvents(), true);
    };
    const panel = document.createElement("div");
    panel.append(
        createButton(handleGoToPreviousPosition, "←"),
        createButton(handleGoToNextPosition, "→"),
        createButton(handleGoToPreviousGame, "←←"),
        createButton(handleGoToNextGame, "→→"),
    );
    panel.classList.add("grid-cols-2");
    return panel;
};
