import { updateNumHundredSticks, updateNumThousandSticks } from "@/components/boardContainer/board/betsDisplay";
import { setClosingDisplayVisibility } from "@/components/boardContainer/closingDisplay";
import { updateDoraRightIndex, updateDoraTileIds } from "@/components/boardContainer/board/doraDisplay";
import {
    hideGameResultDisplay,
    showGameResultDisplay,
} from "@/components/boardContainer/board/gameResultDisplay/gameResultDisplay";
import { setMatchSelectWindowVisibility } from "@/components/matchSelectWindow/matchSelectWindow";
import { showMeldDisplay } from "@/components/boardContainer/board/meldDisplay";
import { setOpeningDisplayVisible } from "@/components/boardContainer/openingDisplay";
import { setPlayerNamesVisibility } from "@/components/boardContainer/board/rotationBoard/playerNameDisplay";
import { setShowsRiichiStick } from "@/components/boardContainer/board/rotationBoard/riichiStickDisplay";
import { updateScoreDisplay } from "@/components/boardContainer/board/rotationBoard/scoreDisplay";
import { resetAllTiles, setTileAnimationAll, updateTile } from "@/components/boardContainer/board/rotationBoard/tile";
import { updateWindDisplay } from "@/components/boardContainer/board/rotationBoard/windDisplay";
import { getMJson } from "@/models/mJson/states";
import {
    getCurrentGameIndex,
    getCurrentPositionEvents,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
} from "@/models/positionEvent/states";
import { type PositionEvent, type GameIndex } from "@/models/positionEvent/types";
import { hideBoard, showBoard } from "@/components/boardContainer/boardContainer";
import { updateRoundDisplay } from "@/components/boardContainer/board/roundDisplay";
import { getElementByIdOrThrowError } from "@/util/domHelper";
import { boardId } from "@/components/boardContainer/board/board";

export const handleGameIndexChanged = (newGameIndex: GameIndex): void => {
    setTileAnimationAll(false);
    if (newGameIndex === "pre") {
        hideBoard();
        resetAllTiles();
        setClosingDisplayVisibility(false);
        setOpeningDisplayVisible(true);
        setPlayerNamesVisibility(false);
    } else if (newGameIndex === "post") {
        hideBoard();
        resetAllTiles();
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(true);
        setPlayerNamesVisibility(false);
    } else {
        showBoard();
        setOpeningDisplayVisible(false);
        setClosingDisplayVisibility(false);
        setPlayerNamesVisibility(true);
        updateRoundDisplay(newGameIndex);
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
                showGameResultDisplay(event, getElementByIdOrThrowError(boardId));
                break;
            case "meld":
                if (goesForward) showMeldDisplay(event);
                break;
            case "riichiStick":
                setShowsRiichiStick(event);
                break;
            case "score":
                updateScoreDisplay(event);
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

export const handleGoToPreviousPosition = (): void => {
    hideGameResultDisplay();
    setTileAnimationAll(false);
    const gameIsChanged = goToPreviousPosition();
    if (gameIsChanged) handleGameIndexChanged(getCurrentGameIndex());
    handlePositionEvents(getCurrentPositionEvents(), false);
};

export const handleGoToNextPosition = (): void => {
    hideGameResultDisplay();
    setTileAnimationAll(true);
    const gameIsChanged = goToNextPosition();
    if (gameIsChanged) {
        setTileAnimationAll(false);
        handleGameIndexChanged(getCurrentGameIndex());
    }
    handlePositionEvents(getCurrentPositionEvents(), true);
};

export const handleGoToPreviousGame = (): void => {
    hideGameResultDisplay();
    goToPreviousGame();
    handleGameIndexChanged(getCurrentGameIndex());
    handlePositionEvents(getCurrentPositionEvents(), true);
};

export const handleGoToNextGame = (): void => {
    hideGameResultDisplay();
    goToNextGame();
    handleGameIndexChanged(getCurrentGameIndex());
    handlePositionEvents(getCurrentPositionEvents(), true);
};

export const handleShowMatchSelectWindowButton = (): void => {
    setMatchSelectWindowVisibility(true);
};
