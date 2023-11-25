import { type PositionEventScore } from "@/modules/positionEvent/types";
import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";

const score = [25000, 25000, 25000, 25000];

const scoreTextId = (sideIndex: number): string => `score_text${sideIndex}`;

export const createScoreText = (sideIndex: number): SVGTextElement => {
    const element = createSVGTextElement({
        text: `${score[sideIndex]}`,
        x: 0,
        y: 0,
        fontSize: 450,
        dominantBaseline: "alphabetic",
    });
    element.setAttribute("id", scoreTextId(sideIndex));
    return element;
};

export const updateScoreText = ({ newScore, sideIndex }: Omit<PositionEventScore, "kind">): void => {
    const element = getElementByIdOrThrowError(scoreTextId(sideIndex));
    element.textContent = `${newScore}`;
    score[sideIndex] = newScore;
};

export const resetScoreDisplayAll = (): void => {
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        updateScoreText({ newScore: 25000, sideIndex });
    }
};
