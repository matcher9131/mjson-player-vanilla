import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";

const playerNameDisplayId = (sideIndex: number): string => `player_name_display${sideIndex}`;

export const createPlayerNameDisplay = (sideIndex: number): SVGTextElement => {
    const element = createSVGTextElement({
        text: "",
        x: 0,
        y: 0,
        fontSize: 350,
    });
    element.setAttribute("id", playerNameDisplayId(sideIndex));
    // 初期状態
    element.setAttribute("opacity", "0");
    return element;
};

export const updatePlayerNames = (names: readonly string[]): void => {
    for (let sideIndex = 0; sideIndex < names.length; ++sideIndex) {
        const element = getElementByIdOrThrowError(playerNameDisplayId(sideIndex));
        element.textContent = names[sideIndex];
    }
};

export const setPlayerNamesVisibility = (isVisible: boolean): void => {
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const element = getElementByIdOrThrowError(playerNameDisplayId(sideIndex));
        element.setAttribute("opacity", isVisible ? "1" : "0");
    }
};
