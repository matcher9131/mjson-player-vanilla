import { updateNumHundredSticks, updateNumThousandSticks } from "@/components/betsDisplay";
import { setCenterDisplayVisibility, updateRoundText } from "@/components/centerDisplay";
import { setClosingDisplayVisibility } from "@/components/closingDisplay";
import { updateDoraRightIndex, updateDoraTileIds } from "@/components/doraDisplay";
import { hideGameResultDisplay, showGameResultDisplay } from "@/components/gameResultDisplay/gameResultDisplay";
import { setMatchSelectWindowVisibility } from "@/components/matchSelectWindow/matchSelectWindow";
import { showMeldDisplay } from "@/components/meldDisplay";
import { setOpeningDisplayVisible } from "@/components/openingDisplay";
import { setPlayerNamesVisibility } from "@/components/playerNameDisplay";
import { setShowsRiichiStick } from "@/components/riichiStickDisplay";
import { updateScoreText } from "@/components/scoreDisplay";
import { resetAllTiles, setTileAnimationAll, updateTile } from "@/components/tile";
import { updateWindDisplay } from "@/components/windDisplay";
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

export const handleGameIndexChanged = (newGameIndex: GameIndex): void => {
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
