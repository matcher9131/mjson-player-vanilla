import {
    handleGoToNextGame,
    handleGoToNextPosition,
    handleGoToPreviousGame,
    handleGoToPreviousPosition,
    handleShowMatchSelectWindowButton,
} from "@/controllers/positionEventController";

const positionNavigatorButtonClassName = "position-navigator-button";

const createButton = (onClick: () => void, icon: Element, isAlwaysEnabled = false): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("flex-1", "flex", "justify-center", "item-stretch");
    const button = document.createElement("button");
    button.appendChild(icon);
    button.onclick = onClick;
    button.classList.add(
        "flex-auto",
        "bg-neutral-800",
        "text-white",
        "enabled:hover:brightness-125",
        "disabled:brightness-75",
        "disabled:cursor-not-allowed",
        "mx-0.5",
        "my-0.5",
        "px-[min(2vw,2vh)]",
        "py-[min(2vw,2vh)]",
        "rounded",
        "flex",
        "justify-center",
        "items-center",
        "select-none",
    );
    button.classList.add(positionNavigatorButtonClassName);
    // 初期状態
    button.disabled = !isAlwaysEnabled;

    container.appendChild(button);
    return container;
};

export const setPositionNavigatorButtonsEnabled = (isEnabled: boolean): void => {
    for (const element of document.getElementsByClassName(positionNavigatorButtonClassName)) {
        (element as HTMLButtonElement).disabled = !isEnabled;
    }
};

const createIcon = (filepath: string): HTMLObjectElement => {
    const element = document.createElement("object");
    element.setAttribute("type", "image/svg+xml");
    element.setAttribute("data", filepath);
    element.classList.add("w-[min(5vw,5vh)]", "h-[min(5vw,5vh)]", "pointer-events-none", "select-none");
    return element;
};

export const createControlPanel = (): HTMLDivElement => {
    const panel = document.createElement("div");
    panel.append(
        createButton(handleGoToPreviousGame, createIcon("resources/arrows/white_double_left.svg")),
        createButton(handleGoToPreviousPosition, createIcon("resources/arrows/white_left.svg")),
        createButton(handleGoToNextPosition, createIcon("resources/arrows/white_right.svg")),
        createButton(handleGoToNextGame, createIcon("resources/arrows/white_double_right.svg")),
        createButton(handleShowMatchSelectWindowButton, createIcon("resources/folder.svg"), true),
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
