import {
    getCurrentGameIndex,
    getCurrentPositionEvent,
    goToNextGame,
    goToNextPosition,
    goToPreviousGame,
    goToPreviousPosition,
} from "../modules/positionEvent/states";
import { type GameIndex } from "../modules/positionEvent/types";
import { setTileAnimationAll, updateTileState } from "../modules/tileState/states";
import { setCenterDisplayVisibility, updateRoundText } from "./centerDIsplay";
import { showOverlay } from "./overlayText";

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
        const prevGameIndex = getCurrentGameIndex();
        goToPreviousPosition();
        const newGameIndex = getCurrentGameIndex();
        if (prevGameIndex !== newGameIndex) handleGameIndexChanged(newGameIndex);
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "backward"),
        );
    };
    const handleGoToNextPosition = (): void => {
        setTileAnimationAll(true);
        const prevGameIndex = getCurrentGameIndex();
        goToNextPosition();
        const newGameIndex = getCurrentGameIndex();
        if (prevGameIndex !== newGameIndex) handleGameIndexChanged(newGameIndex);
        const currentPositionEvent = getCurrentPositionEvent();
        updateTileState(
            currentPositionEvent.tileStateTransitions.filter((transition) => transition.kind === "forward"),
        );
        currentPositionEvent.meldEvents.forEach((e) => {
            showOverlay(e.player, e.kind);
        });
    };
    const handleGoToPreviousGame = (): void => {
        goToPreviousGame();
        handleGameIndexChanged(getCurrentGameIndex());
        updateTileState(
            getCurrentPositionEvent().tileStateTransitions.filter((transition) => transition.kind === "forward"),
        );
    };
    const handleGoToNextGame = (): void => {
        goToNextGame();
        handleGameIndexChanged(getCurrentGameIndex());
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
