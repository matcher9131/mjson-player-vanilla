import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import {
    betsDisplayHeight,
    betsDisplayWidth,
    centerDisplayHeight,
    centerDisplayOffsetX,
    centerDisplayOffsetY,
    centerDisplayWidth,
    gameNumberTextOffsetX,
    gameNumberTextOffsetY,
    scoreTextOffsetX,
    scoreTextOffsetY,
    svgNS,
    tileWidth,
} from "@/const";
import { getMJson } from "@/modules/mJson/states";
import { type GameIndex } from "@/modules/positionEvent/types";
import { createBetsDisplay } from "./betsDisplay";
import { createDoraDisplay } from "./doraDisplay";
import { createRiichiStickDisplay, createScoreText } from "./scoreDisplay";

const centerDisplayId = "center_display";
const roundTextId = "round_text";

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
    const element = createSVGTextElement({
        text: "",
        x: gameNumberTextOffsetX,
        y: gameNumberTextOffsetY,
        fontSize: 1000,
    });
    element.setAttribute("id", roundTextId);
    return element;
};

export const createCenterDisplay = (): SVGGElement => {
    const cd = document.createElementNS(svgNS, "g");
    cd.setAttribute("id", centerDisplayId);
    // 背景
    const bg = createBackground();
    cd.appendChild(bg);
    // 局表示
    const roundText = createRoundText();
    cd.appendChild(roundText);
    // 積み棒表示
    const betsDisplay = createBetsDisplay();
    // temporary
    betsDisplay.setAttribute("x", `${-betsDisplayWidth / 2}`);
    betsDisplay.setAttribute("y", `${-betsDisplayHeight / 2}`);
    // end temporary
    cd.appendChild(betsDisplay);
    // ドラ表示
    const doraDisplay = createDoraDisplay();
    // temporary
    doraDisplay.setAttribute("x", `${-tileWidth * 2.5}`);
    doraDisplay.setAttribute("y", `${tileWidth * 0.75}`);
    // end temporary
    cd.appendChild(doraDisplay);
    // 点棒表示・リーチ棒表示
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const scoreText = createScoreText(sideIndex);
        scoreText.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${scoreTextOffsetX} ${scoreTextOffsetY})`,
        );
        cd.appendChild(scoreText);
        const riichiStick = createRiichiStickDisplay(sideIndex);
        // temporary
        riichiStick.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${scoreTextOffsetX} ${scoreTextOffsetY})`,
        );
        // end temporary
        cd.appendChild(riichiStick);
    }
    // 初期状態
    cd.setAttribute("opacity", "0");
    return cd;
};

export const setCenterDisplayVisibility = (gameIndex: GameIndex): void => {
    const cd = getElementByIdOrThrowError(centerDisplayId);
    cd.setAttribute("opacity", `${gameIndex === "pre" || gameIndex === "post" ? 0 : 1}`);
};

export const updateRoundText = (gameIndex: GameIndex): void => {
    if (gameIndex === "pre" || gameIndex === "post") return;
    const roundText = getElementByIdOrThrowError(roundTextId);
    const round = getMJson().games[gameIndex].round;
    roundText.textContent = `${["東", "南", "西", "北"][round >> 2]}${(round % 4) + 1}局`;
};
