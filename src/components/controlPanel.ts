const createButton = (onClick: () => void, text: string): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    button.classList.add("bg-slate-700", "text-white", "px-2", "py-2", "rounded");
    return button;
};

type ControlPanelProps = {
    onGoToPreviousPosition: () => void;
    onGoToNextPosition: () => void;
    onGoToPreviousGame: () => void;
    onGoToNextGame: () => void;
};

export const createControlPanel = ({
    onGoToPreviousPosition,
    onGoToNextPosition,
    onGoToPreviousGame,
    onGoToNextGame,
}: ControlPanelProps): HTMLDivElement => {
    const panel = document.createElement("div");
    panel.append(
        createButton(onGoToPreviousPosition, "←"),
        createButton(onGoToNextPosition, "→"),
        createButton(onGoToPreviousGame, "←←"),
        createButton(onGoToNextGame, "→→"),
    );
    panel.classList.add("grid-cols-2");
    return panel;
};
