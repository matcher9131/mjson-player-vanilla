import { svgNS } from "@/const";
import { type PositionEventScore, type PositionEventRiichiStick } from "@/modules/positionEvent/types";
import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";

const score = [25000, 25000, 25000, 25000];
const showsRiichiStick = [false, false, false, false];

const scoreTextId = (sideIndex: number): string => `score_text${sideIndex}`;
const riichiStickId = (sideIndex: number): string => `riichi_stick${sideIndex}`;

export const createScoreText = (sideIndex: number): SVGTextElement => {
    const element = createSVGTextElement({
        text: `${score[sideIndex]}`,
        x: 0,
        y: 0,
        fontSize: 500,
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

export const createRiichiStickDisplay = (sideIndex: number): SVGUseElement => {
    const element = document.createElementNS(svgNS, "use");
    element.setAttribute("id", riichiStickId(sideIndex));
    element.setAttribute("href", `sticks.svg#thousand_point_stick`);
    // 初期状態
    element.setAttribute("opacity", "0");
    return element;
};

export const setShowsRiichiStick = ({ isSet, sideIndex }: Omit<PositionEventRiichiStick, "kind">): void => {
    const element = getElementByIdOrThrowError(riichiStickId(sideIndex));
    element.setAttribute("opacity", isSet ? "1" : "0");
    showsRiichiStick[sideIndex] = isSet;
};

export const resetScoreDisplay = (): void => {
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        updateScoreText({ newScore: 25000, sideIndex });
        setShowsRiichiStick({ isSet: false, sideIndex });
    }
};
