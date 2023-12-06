import { createSVGRectElement, createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import {
    betsDisplayHeight,
    betsDisplayWidth,
    centerDisplayHeight,
    centerDisplayOffsetX,
    centerDisplayOffsetY,
    centerDisplayWidth,
    doraDisplayOffsetX,
    doraDisplayOffsetY,
    gameNumberTextOffsetX,
    gameNumberTextOffsetY,
    riichiStickOffsetX,
    riichiStickOffsetY,
    scoreTextOffsetX,
    scoreTextOffsetY,
    svgNS,
    windDisplayOffsetX,
    windDisplayOffsetY,
} from "@/const";
import { getMJson } from "@/modules/mJson/states";
import { type GameIndex } from "@/modules/positionEvent/types";
import { createBetsDisplay } from "./betsDisplay";
import { createDoraDisplay } from "./doraDisplay";
import { createScoreText } from "./scoreDisplay";
import { createWindDisplay } from "./windDisplay";
import { createRiichiStickDisplay } from "./riichiStickDisplay";

const centerDisplayId = "center_display";
const roundTextId = "round_text";

const createRoundText = (): SVGTextElement => {
    const element = createSVGTextElement({
        text: "",
        x: gameNumberTextOffsetX,
        y: gameNumberTextOffsetY,
        fontSize: 900,
    });
    element.setAttribute("id", roundTextId);
    return element;
};

export const createCenterDisplay = (): SVGGElement => {
    const cd = document.createElementNS(svgNS, "g");
    cd.setAttribute("id", centerDisplayId);
    // 背景
    cd.appendChild(
        createSVGRectElement({
            x: centerDisplayOffsetX,
            y: centerDisplayOffsetY,
            width: centerDisplayWidth,
            height: centerDisplayHeight,
            color: "#171717",
        }),
    );
    // 局表示
    const roundText = createRoundText();
    cd.appendChild(roundText);
    // 積み棒表示
    const betsDisplay = createBetsDisplay();
    betsDisplay.setAttribute("x", `${-betsDisplayWidth / 2}`);
    betsDisplay.setAttribute("y", `${-betsDisplayHeight / 2}`);
    cd.appendChild(betsDisplay);
    // ドラ表示
    const doraDisplay = createDoraDisplay();
    doraDisplay.setAttribute("x", `${doraDisplayOffsetX}`);
    doraDisplay.setAttribute("y", `${doraDisplayOffsetY}`);
    cd.appendChild(doraDisplay);
    // 点棒表示・リーチ棒表示・自風表示
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const scoreText = createScoreText(sideIndex);
        scoreText.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${scoreTextOffsetX} ${scoreTextOffsetY})`,
        );
        cd.appendChild(scoreText);
        const riichiStick = createRiichiStickDisplay(sideIndex);
        riichiStick.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${riichiStickOffsetX} ${riichiStickOffsetY})`,
        );
        cd.appendChild(riichiStick);
        const windDisplay = createWindDisplay(sideIndex);
        windDisplay.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${windDisplayOffsetX} ${windDisplayOffsetY})`,
        );
        cd.appendChild(windDisplay);
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
