import { boardOneSize, defaultTextColor, negativeNumberColor, positiveNumberColor, svgNS, tileWidth } from "@/const";
import { type PlayerGameResult } from "@/modules/mJson/types/playerGameResult";
import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { rotateVector2D } from "@/util/vector2D";

const closingDisplayId = "closing_display";
const playerNameTextId = (sideIndex: number): string => `closing_display_player_name${sideIndex}`;
const scoreTextId = (sideIndex: number): string => `closing_display_score${sideIndex}`;
const incomeTextId = (sideIndex: number): string => `closing_display_income${sideIndex}`;
const rowHeight = tileWidth;
const fontSize = 400;

export const createClosingDisplay = (): SVGGElement => {
    const element = document.createElementNS(svgNS, "g");
    element.setAttribute("id", closingDisplayId);
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const { x, y } = rotateVector2D({ x: 0, y: boardOneSize / 4 }, -90 * sideIndex);
        const nameText = createSVGTextElement({
            text: "",
            x,
            y: y - rowHeight,
            fontSize,
        });
        nameText.setAttribute("id", playerNameTextId(sideIndex));
        const scoreText = createSVGTextElement({
            text: "",
            x,
            y,
            fontSize,
        });
        scoreText.setAttribute("id", scoreTextId(sideIndex));
        const incomeText = createSVGTextElement({
            text: "",
            x,
            y: y + rowHeight,
            fontSize,
        });
        incomeText.setAttribute("id", incomeTextId(sideIndex));
        element.append(nameText, scoreText, incomeText);
    }
    // 初期状態
    element.setAttribute("opacity", "0");

    return element;
};

export const setPlayerMatchResults = (results: readonly PlayerGameResult[]): void => {
    results.forEach(({ name, score, income }, sideIndex) => {
        const nameText = getElementByIdOrThrowError(playerNameTextId(sideIndex));
        nameText.textContent = name;
        const scoreText = getElementByIdOrThrowError(scoreTextId(sideIndex));
        scoreText.textContent = `${score}`;
        const incomeText = getElementByIdOrThrowError(incomeTextId(sideIndex));
        incomeText.textContent = income > 0 ? `+${income}` : `${income}`;
        incomeText.setAttribute(
            "fill",
            income > 0 ? positiveNumberColor : income < 0 ? negativeNumberColor : defaultTextColor,
        );
    });
};

export const setClosingDisplayVisibility = (isVisible: boolean): void => {
    const element = getElementByIdOrThrowError(closingDisplayId);
    element.setAttribute("opacity", isVisible ? "1" : "0");
};
