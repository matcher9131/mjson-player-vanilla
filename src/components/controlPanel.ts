import {
    currentPositionIsBeginningGame,
    getCurrentPositionEvent,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
} from "../modules/positionEvent/states";
import { setTileAnimationAll, updateTileState } from "../modules/tileState/states";

const createButton = (onClick: () => void, text: string): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    button.classList.add("bg-slate-700", "text-white", "px-2", "py-2", "rounded");
    return button;
};

export const createControlPanel = (): HTMLDivElement => {
    const handleGoToPreviousPosition = (): void => {
        goToPreviousPosition();
        setTileAnimationAll(false);
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "backward"),
        );
    };
    const handleGoToNextPosition = (): void => {
        goToNextPosition();
        setTileAnimationAll(!currentPositionIsBeginningGame());
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "forward"),
        );
    };
    const handleGoToPreviousGame = (): void => {
        goToPreviousGame();
        setTileAnimationAll(false);
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "forward"),
        );
    };
    const handleGoToNextGame = (): void => {
        goToNextGame();
        setTileAnimationAll(false);
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "forward"),
        );
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
