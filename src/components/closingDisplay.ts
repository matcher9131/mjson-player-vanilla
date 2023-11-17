import { boardOneSize, negativeNumberColor, positiveNumberColor, svgNS, tileHeight } from "@/const";
import { type PlayerGameResult } from "@/modules/mJson/types/playerGameResult";
import { createSVGTextElement } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";
import { rotate } from "@/util/vector2D";

const closingDisplayId = "closing_display";
const rowHeight = tileHeight;
const fontSize = 400;

export const createClosingDisplay = (players: readonly PlayerGameResult[]): SVGGElement => {
    const element = document.createElementNS(svgNS, "g");
    element.setAttribute("id", closingDisplayId);
    players.forEach(({ name, score, income }, sideIndex) => {
        const { x, y } = rotate({ x: 0, y: boardOneSize / 2 }, -90 * sideIndex);
        const nameText = createSVGTextElement({
            text: name,
            x,
            y: y - rowHeight,
            fontSize,
        });
        const scoreText = createSVGTextElement({
            text: `${score}`,
            x,
            y,
            fontSize,
        });
        const incomeText = createSVGTextElement({
            text: `${income}`,
            x,
            y: y + rowHeight,
            fontSize,
            color: income > 0 ? positiveNumberColor : income < 0 ? negativeNumberColor : "floralwhite",
        });
        element.append(nameText, scoreText, incomeText);
    });
    return element;
};

export const setClosingDisplayVisibility = (isVisible: boolean): void => {
    const element = document.getElementById(closingDisplayId);
    assertNonNull(element, closingDisplayId);
    element.setAttribute("opacity", isVisible ? "1" : "0");
};
