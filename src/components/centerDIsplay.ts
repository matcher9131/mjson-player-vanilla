import {
    centerDisplayHeight,
    centerDisplayOffsetX,
    centerDisplayOffsetY,
    centerDisplayWidth,
    gameNumberTextOffsetX,
    gameNumberTextOffsetY,
    scoreTextOffsetX,
    scoreTextOffsetY,
    svgNS,
} from "../const";
import { getMJson } from "../modules/mJson/states";
import { type GameIndex } from "../modules/positionEvent/types";
import { assertNonNull } from "../util/error";

const centerDisplayId = "center_display";
const roundTextId = "round_text";
const scoreTextId = (sideIndex: number): string => `score_text${sideIndex}`;

const createBackground = (): SVGRectElement => {
    const element = document.createElementNS(svgNS, "rect");
    element.setAttribute("fill", "black");
    element.setAttribute("x", `${centerDisplayOffsetX}`);
    element.setAttribute("y", `${centerDisplayOffsetY}`);
    element.setAttribute("width", `${centerDisplayWidth}`);
    element.setAttribute("height", `${centerDisplayHeight}`);
    return element;
};

const createRoundText = (): SVGTextElement => {
    const element = document.createElementNS(svgNS, "text");
    element.setAttribute("id", roundTextId);
    element.setAttribute("x", `${gameNumberTextOffsetX}`);
    element.setAttribute("y", `${gameNumberTextOffsetY}`);
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("font-size", "1000");
    element.setAttribute("fill", "floralwhite");
    return element;
};

const createScoreText = (sideIndex: number): SVGTextElement => {
    const element = document.createElementNS(svgNS, "text");
    element.setAttribute("id", scoreTextId(sideIndex));
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("dominant-baseline", "alphabetic");
    element.setAttribute("font-size", "400");
    element.setAttribute("fill", "floralwhite");
    element.setAttribute("transform", `rotate(${-90 * sideIndex}) translate(${scoreTextOffsetX} ${scoreTextOffsetY})`);
    // 初期状態
    element.textContent = " 25000";
    return element;
};

export const createCenterDisplay = (): SVGGElement => {
    const cd = document.createElementNS(svgNS, "g");
    cd.setAttribute("id", centerDisplayId);
    const bg = createBackground();
    cd.appendChild(bg);
    const roundText = createRoundText();
    cd.appendChild(roundText);
    for (let i = 0; i < 4; ++i) {
        const scoreText = createScoreText(i);
        cd.appendChild(scoreText);
    }
    // 初期状態
    cd.setAttribute("opacity", "0");
    return cd;
};

export const setCenterDisplayVisibility = (gameIndex: GameIndex): void => {
    const cd = document.getElementById(centerDisplayId);
    assertNonNull(cd, centerDisplayId);
    cd.setAttribute("opacity", `${gameIndex === "pre" || gameIndex === "post" ? 0 : 1}`);
};

export const updateRoundText = (gameIndex: GameIndex): void => {
    if (gameIndex === "pre" || gameIndex === "post") return;
    const roundText = document.getElementById(roundTextId);
    assertNonNull(roundText, roundTextId);
    const round = getMJson().games[gameIndex].round;
    roundText.textContent = `${["東", "南", "西", "北"][round >> 2]}${(round % 4) + 1}局`;
};

export const updateScoreText = (sideIndex: number, score: number): void => {
    const scoreText = document.getElementById(scoreTextId(sideIndex));
    assertNonNull(scoreText, scoreTextId(sideIndex));
    scoreText.textContent = `${score}`.padStart(6, " ");
};
