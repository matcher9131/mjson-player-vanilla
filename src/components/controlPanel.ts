// import {
//     handleGoToNextGame,
//     handleGoToNextPosition,
//     handleGoToPreviousGame,
//     handleGoToPreviousPosition,
//     handleShowMatchSelectWindowButton,
// } from "@/controllers/positionEventController";

const positionNavigatorButtonClassName = "position-navigator-button";

const createButton = (
    onClick: () => void,
    isAlwaysEnabled: boolean,
    ...iconClassNames: readonly string[]
): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("flex-1", "flex", "justify-center", "item-stretch");
    const button = document.createElement("button");
    button.classList.add(positionNavigatorButtonClassName);
    button.onclick = onClick;
    button.classList.add(
        "flex-auto",
        "bg-neutral-800",
        "text-white",
        "transition-transform",
        "enabled:hover:brightness-125",
        "disabled:brightness-75",
        "disabled:cursor-not-allowed",
        "active:scale-95",
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

    const icon = document.createElement("div");
    icon.classList.add(
        "w-[min(5vw,5vh)]",
        "h-[min(5vw,5vh)]",
        "bg-floralwhite",
        "pointer-events-none",
        ...iconClassNames,
        "select-none",
        "[mask-repeat:no-repeat]",
        "[mask-position:center]",
    );
    button.appendChild(icon);

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

type CreateControlPanelParameters = {
    readonly handleGoToPreviousGame: () => void;
    readonly handleGoToPreviousPosition: () => void;
    readonly handleGoToNextPosition: () => void;
    readonly handleGoToNextGame: () => void;
    readonly handleRotateClockwise: () => void;
    readonly handleRotateCounterClockwise: () => void;
    readonly handleShowMatchSelectWindow: () => void;
};
export const createControlPanel = ({
    handleGoToPreviousGame,
    handleGoToPreviousPosition,
    handleGoToNextPosition,
    handleGoToNextGame,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleShowMatchSelectWindow,
}: CreateControlPanelParameters): HTMLDivElement => {
    const panel = document.createElement("div");
    panel.append(
        createButton(handleGoToPreviousGame, false, "[mask-image:url('@resources/arrows/double_left.svg')]"),
        createButton(handleGoToPreviousPosition, false, "[mask-image:url('@resources/arrows/left.svg')]"),
        createButton(handleGoToNextPosition, false, "[mask-image:url('@resources/arrows/left.svg')]", "scale-x-flip"),
        createButton(
            handleGoToNextGame,
            false,
            "[mask-image:url('@resources/arrows/double_left.svg')]",
            "scale-x-flip",
        ),
        // TODO: onClick
        createButton(handleRotateClockwise, false, "[mask-image:url('@resources/arrows/clockwise.svg')]"),
        createButton(
            handleRotateCounterClockwise,
            false,
            "[mask-image:url('@resources/arrows/clockwise.svg')]",
            "scale-x-flip",
        ),
        createButton(handleShowMatchSelectWindow, true, "[mask-image:url('@resources/folder.svg')]"),
    );
    panel.classList.add(
        "grid",
        "portrait:w-[min(100vw,100vh)]",
        "portrait:grid-flow-row",
        "portrait:grid-cols-4",
        "landscape:h-[min(100vw,100vh)]",
        "landscape:grid-flow-col",
        "landscape:grid-rows-4",
    );
    return panel;
};
