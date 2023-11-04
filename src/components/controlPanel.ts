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
} from "../modules/positionEvent/types";
import { setCenterDisplayVisibility, updateRoundText } from "./centerDIsplay";
import { showOverlay } from "./overlayText";
import { setTileAnimationAll, updateTile } from "./tile";

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
    // NOT IMPLEMENTED
    // scoreとかリーチ棒とか
};

export const createControlPanel = (): HTMLDivElement => {
    const handleGoToPreviousPosition = (): void => {
        setTileAnimationAll(false);
        const gameIsChanged = goToPreviousPosition();
        if (gameIsChanged) handleGameIndexChanged(getCurrentGameIndex());
        getCurrentPositionEvents()
            .filter(isPositionEventTransitionBackward)
            .forEach((e) => {
                updateTile(e);
            });
    };
    const handleGoToNextPosition = (): void => {
        setTileAnimationAll(true);
        const gameIsChanged = goToNextPosition();
        if (gameIsChanged) {
            setTileAnimationAll(false);
            handleGameIndexChanged(getCurrentGameIndex());
        }
        const currentPositionEvent = getCurrentPositionEvents();
        currentPositionEvent.filter(isPositionEventTransitionForward).forEach((e) => {
            updateTile(e);
        });
        currentPositionEvent.filter(isPositionEventMeld).forEach((e) => {
            showOverlay(e);
        });
    };
    const handleGoToPreviousGame = (): void => {
        goToPreviousGame();
        handleGameIndexChanged(getCurrentGameIndex());
        getCurrentPositionEvents()
            .filter(isPositionEventTransitionForward)
            .forEach((e) => {
                updateTile(e);
            });
    };
    const handleGoToNextGame = (): void => {
        goToNextGame();
        handleGameIndexChanged(getCurrentGameIndex());
        getCurrentPositionEvents()
            .filter(isPositionEventTransitionForward)
            .forEach((e) => {
                updateTile(e);
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
