import { boardOneSize, svgNS } from "@/const";
import { createSVGTextElement } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";
import { rotate } from "@/util/vector2D";

const openingDisplayId = "opening_display";

export const createOpeningDisplay = (playerNames: readonly string[]): SVGGElement => {
    const element = document.createElementNS(svgNS, "g");
    element.setAttribute("id", openingDisplayId);
    playerNames.forEach((name, sideIndex) => {
        const { x, y } = rotate({ x: 0, y: boardOneSize / 2 }, -90 * sideIndex);
        const text = createSVGTextElement({
            text: name,
            x,
            y,
            fontSize: 400,
        });
        element.appendChild(text);
    });
    return element;
};

export const setOpeningDisplayVisible = (isVisible: boolean): void => {
    const element = document.getElementById(openingDisplayId);
    assertNonNull(element, openingDisplayId);
    element.setAttribute("opacity", isVisible ? "1" : "0");
};
