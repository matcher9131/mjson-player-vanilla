import { boardOneSize, svgNS, tileWidth } from "@/const";
import { createSVGRectElement, createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { rotateVector2D } from "@/util/vector2D";

const openingDisplayId = "opening_display";
const playerNameTextId = (sideIndex: number): string => `opening_display_player_name${sideIndex}`;
const windIconId = (sideIndex: number): string => `opening_display_wind_icon${sideIndex}`;
const windSrcId = (windIndex: number): string => ["wind_east", "wind_south", "wind_west", "wind_north"][windIndex % 4];
const bgOneSize = (boardOneSize * 2) / 3;
const rowHeight = tileWidth * 1.25;

export const createOpeningDisplay = (): SVGGElement => {
    const element = document.createElementNS(svgNS, "g");
    element.setAttribute("id", openingDisplayId);

    element.appendChild(
        createSVGRectElement({
            x: -bgOneSize / 2,
            y: -bgOneSize / 2,
            width: bgOneSize,
            height: bgOneSize,
            color: "#262626",
        }),
    );

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const { x, y } = rotateVector2D({ x: 0, y: boardOneSize / 6 }, -90 * sideIndex);
        const textElement = createSVGTextElement({
            text: "",
            x,
            y: y - rowHeight / 2,
            fontSize: 400,
        });
        textElement.setAttribute("id", playerNameTextId(sideIndex));
        element.appendChild(textElement);

        const iconElement = document.createElementNS(svgNS, "use");
        iconElement.setAttribute("id", windIconId(sideIndex));
        iconElement.setAttribute("x", `${x}`);
        iconElement.setAttribute("y", `${y + rowHeight / 2}`);
        iconElement.setAttribute("href", `#${windSrcId(sideIndex)}`);
        element.appendChild(iconElement);
    }
    // 初期状態
    element.setAttribute("opacity", "0");

    return element;
};

export const setPlayerNames = (playerNames: readonly string[]): void => {
    for (let sideIndex = 0; sideIndex < playerNames.length; ++sideIndex) {
        const text = getElementByIdOrThrowError(playerNameTextId(sideIndex));
        text.textContent = playerNames[sideIndex];
    }
};

export const setOpeningDisplayVisible = (isVisible: boolean): void => {
    const element = getElementByIdOrThrowError(openingDisplayId);
    element.setAttribute("opacity", isVisible ? "1" : "0");
};
