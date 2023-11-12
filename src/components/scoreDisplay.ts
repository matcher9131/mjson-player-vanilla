import { svgNS } from "@/const";
import { assertNonNull } from "@/util/error";

const score = [25000, 25000, 25000, 25000];
const showsRiichiStick = [false, false, false, false];

const scoreTextId = (sideIndex: number): string => `score_text${sideIndex}`;
const riichiStickId = (sideIndex: number): string => `riichi_stick${sideIndex}`;

export const createScoreText = (sideIndex: number): SVGTextElement => {
    const element = document.createElementNS(svgNS, "text");
    element.setAttribute("id", scoreTextId(sideIndex));
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("dominant-baseline", "alphabetic");
    element.setAttribute("font-size", "400");
    element.setAttribute("fill", "floralwhite");
    // 初期状態
    element.textContent = `${score[sideIndex]}`;
    return element;
};

export const updateScoreText = (newScore: number, sideIndex: number): void => {
    const id = scoreTextId(sideIndex);
    const element = document.getElementById(id);
    assertNonNull(element, id);
    element.textContent = `${newScore}`;
    score[sideIndex] = newScore;
};

export const createRiichiStickDisplay = (sideIndex: number): SVGUseElement => {
    const element = document.createElementNS(svgNS, "use");
    element.setAttribute("id", riichiStickId(sideIndex));
    element.setAttribute("opacity", "0");
    // NOT IMPLEMENTED
    return element;
};

export const setRiichiStick = (value: boolean, sideIndex: number, incrementsScore = false): void => {
    const id = riichiStickId(sideIndex);
    const element = document.getElementById(id);
    assertNonNull(element, id);
    element.setAttribute("opacity", value ? "1" : "0");
    showsRiichiStick[sideIndex] = value;
    if (incrementsScore) {
        updateScoreText(score[sideIndex] + (value ? -1000 : 1000), sideIndex);
    }
};
