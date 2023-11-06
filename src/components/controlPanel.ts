import {
    getCurrentGameIndex,
    getCurrentPositionEvents,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
} from "../modules/positionEvent/states";
import {
    isPositionEventTransitionForward,
    type GameIndex,
    isPositionEventTransitionBackward,
    isPositionEventMeld,
    isPositionEventGameResult,
} from "../modules/positionEvent/types";
import { setCenterDisplayVisibility, updateRoundText } from "./centerDIsplay";
import { hideGameResult, showGameResult } from "./gameResult";
import { showOverlay } from "./overlayText";
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
    const currentGameIndex = getCurrentGameIndex();
    if (currentGameIndex === "pre" || currentGameIndex === "post") {
        resetAllTiles();
    }
    // NOT IMPLEMENTED
    // scoreとかリーチ棒とか
};

export const createControlPanel = (): HTMLDivElement => {
    const handleGoToPreviousPosition = (): void => {
        hideGameResult();
        setTileAnimationAll(false);
        const gameIsChanged = goToPreviousPosition();
        if (gameIsChanged) handleGameIndexChanged(getCurrentGameIndex());
        const currentPositionEvent = getCurrentPositionEvents();
        currentPositionEvent.filter(isPositionEventTransitionBackward).forEach(({ tileId, newState }) => {
            updateTile(tileId, newState);
        });
        const eventGameResult = currentPositionEvent.filter(isPositionEventGameResult)?.[0];
        if (eventGameResult != null) {
            showGameResult(eventGameResult);
        }
    };
    const handleGoToNextPosition = (): void => {
        hideGameResult();
        setTileAnimationAll(true);
        const gameIsChanged = goToNextPosition();
        if (gameIsChanged) {
            setTileAnimationAll(false);
            handleGameIndexChanged(getCurrentGameIndex());
        }
        const currentPositionEvent = getCurrentPositionEvents();
        currentPositionEvent.filter(isPositionEventTransitionForward).forEach(({ tileId, newState }) => {
            updateTile(tileId, newState);
        });
        currentPositionEvent.filter(isPositionEventMeld).forEach((e) => {
            showOverlay(e);
        });
        const eventGameResult = currentPositionEvent.filter(isPositionEventGameResult)?.[0];
        if (eventGameResult != null) {
            showGameResult(eventGameResult);
        }
    };
    const handleGoToPreviousGame = (): void => {
        hideGameResult();
        goToPreviousGame();
        handleGameIndexChanged(getCurrentGameIndex());
        getCurrentPositionEvents()
            .filter(isPositionEventTransitionForward)
            .forEach(({ tileId, newState }) => {
                updateTile(tileId, newState);
            });
    };
    const handleGoToNextGame = (): void => {
        hideGameResult();
        goToNextGame();
        handleGameIndexChanged(getCurrentGameIndex());
        getCurrentPositionEvents()
            .filter(isPositionEventTransitionForward)
            .forEach(({ tileId, newState }) => {
                updateTile(tileId, newState);
            });
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
