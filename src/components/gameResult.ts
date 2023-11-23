import {
    gameResultScoreHeight,
    gameResultScoreWidth,
    negativeNumberColor,
    positiveNumberColor,
    svgNS,
    tileHeight,
    tileWidth,
} from "@/const";
import { getYakuName } from "@/modules/mJson/types/yaku";
import { type PositionEventGameResultWin, type PositionEventGameResult } from "@/modules/positionEvent/types";
import { maxBy } from "@/util/arrayExtensions";
import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";
import { boardId } from "./board";
import { createTile } from "./tile";
import { type TileState } from "@/modules/tileState/types";
import { type YakuDoubles } from "@/modules/mJson/types/yakuDoubles";
import { type DrawKind } from "@/modules/mJson/types/drawKind";

const gameResultId = "game_result";
const scoreFontSize = 400;
const yakuFontSize = 350;
const yakuSummaryFontSize = 500;

const yakuRowHeight = tileWidth * 1.25;
const yakuSummaryRowHeight = yakuRowHeight * 1.5;
const yakuColumnGap = tileWidth * 1;
const yakuColumnWidth = tileWidth * 4.5;
// |<-- yakuColumnWidth -->|<-- yakuColumnGap -->|<-- yakuColumnWidth -->|
const yakuWidth = yakuColumnWidth * 2 + yakuColumnGap;

const doraCaptionHeight = tileWidth;
const doraWidth = tileWidth * 5;
const doraScale = 0.8;

const yakuDoraPadding = tileWidth / 2;
const yakuDoraGap = tileWidth * 0.75;
// |<-- yakuDoraPadding -->|<-- yakuWidth -->|<-- yakuDoraGap -->|<-- doraWidth * doraScale -->|<-- yakuDoraPadding -->|
const yakuDoraWidth = yakuDoraPadding * 2 + yakuWidth + yakuDoraGap + doraWidth * doraScale;

const scoreLocationX = [0, gameResultScoreWidth / 3, 0, -gameResultScoreWidth / 3];
const scorePlayerNameLocationY = [
    gameResultScoreHeight * (1 / 3 - 1 / 9),
    gameResultScoreHeight * (0 - 1 / 9),
    gameResultScoreHeight * (-1 / 3 - 1 / 9),
    gameResultScoreHeight * (0 - 1 / 9),
];
const scoreIncrementLocationY = [(gameResultScoreHeight * 1) / 3, 0, gameResultScoreHeight * (-1 / 3), 0];
const scoreLocationY = [
    gameResultScoreHeight * (1 / 3 + 1 / 9),
    gameResultScoreHeight * (0 + 1 / 9),
    gameResultScoreHeight * (-1 / 3 + 1 / 9),
    gameResultScoreHeight * (0 + 1 / 9),
];

const createScoreElement = (
    players: ReadonlyArray<{ readonly name: string; readonly newScore: number; readonly increment: number }>,
): SVGSVGElement => {
    const container = document.createElementNS(svgNS, "svg");
    container.setAttribute("width", `${gameResultScoreWidth}`);
    container.setAttribute("height", `${gameResultScoreHeight}`);
    container.setAttribute(
        "viewBox",
        `${-gameResultScoreWidth / 2} ${-gameResultScoreHeight / 2} ${gameResultScoreWidth} ${gameResultScoreHeight}`,
    );
    // const bg = document.createElementNS(svgNS, "rect");
    // bg.setAttribute("fill", "#111827");
    // bg.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    // bg.setAttribute("y", `${-gameResultScoreHeight / 2}`);
    // bg.setAttribute("width", `${gameResultScoreWidth}`);
    // bg.setAttribute("height", `${gameResultScoreHeight}`);
    // container.appendChild(bg);

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const name = createSVGTextElement({
            text: players[sideIndex].name,
            x: scoreLocationX[sideIndex],
            y: scorePlayerNameLocationY[sideIndex],
            fontSize: scoreFontSize,
        });
        const increment = createSVGTextElement({
            text:
                players[sideIndex].increment === 0
                    ? ""
                    : players[sideIndex].increment > 0
                    ? `+${players[sideIndex].increment}`
                    : `${players[sideIndex].increment}`,
            x: scoreLocationX[sideIndex],
            y: scoreIncrementLocationY[sideIndex],
            fontSize: scoreFontSize,
            color: players[sideIndex].increment > 0 ? positiveNumberColor : negativeNumberColor,
        });
        const score = createSVGTextElement({
            text: `${players[sideIndex].newScore}`,
            x: scoreLocationX[sideIndex],
            y: scoreLocationY[sideIndex],
            fontSize: scoreFontSize,
        });
        container.append(name, increment, score);
    }

    return container;
};

const createHandElement = (
    tileStates: ReadonlyMap<number, TileState>,
): { readonly handElement: SVGSVGElement; readonly handWidth: number; readonly handHeight: number } => {
    const left = Math.min(...[...tileStates.values()].map((state) => state.x)) - tileWidth / 2;
    const rightTile = maxBy([...tileStates.values()], (state) => state.x);
    assertNonNull(rightTile, "rightTile");
    const right = rightTile.x + (rightTile.isRotated ?? false ? tileHeight / 2 : tileWidth / 2);
    const width = right - left;
    const height = tileWidth * 2; // 加槓の場合に備えて高さは牌の幅x2

    // Origin: UpperMiddle
    const handElement = document.createElementNS(svgNS, "svg");
    handElement.setAttribute("width", `${width}`);
    handElement.setAttribute("height", `${height}`);
    handElement.setAttribute("viewBox", `${-width / 2} ${0} ${width} ${height}`);
    for (const [tileId, { x, isRotated }] of tileStates) {
        const tile = createTile(tileId, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute(
            "transform",
            `translate(${x} ${height - (isRotated ?? false ? tileWidth / 2 : tileHeight / 2)}) rotate(${
                isRotated ?? false ? 90 : 0
            })`,
        );
        handElement.appendChild(tile);
    }

    return { handElement, handWidth: width, handHeight: height };
};

type CreateYakuElementOptions = {
    readonly yakuList: readonly YakuDoubles[];
    readonly isSelfDraw: boolean;
    readonly isDealer: boolean;
    readonly winScore: number;
    readonly points: number;
};
const createYakuElement = ({
    yakuList,
    isSelfDraw,
    isDealer,
    winScore,
    points,
}: CreateYakuElementOptions): { readonly yakuElement: SVGSVGElement; readonly yakuHeight: number } => {
    // Origin: UpperLeft
    const yakuElement = document.createElementNS(svgNS, "svg");
    const yakuHeight = Math.ceil(yakuList.length / 2) * yakuRowHeight + yakuSummaryRowHeight;
    yakuElement.setAttribute("width", `${yakuWidth}`);
    yakuElement.setAttribute("height", `${yakuHeight}`);
    yakuElement.setAttribute("viewBox", `0 0 ${yakuWidth} ${yakuHeight}`);
    for (let i = 0; i < yakuList.length; ++i) {
        const yakuNameX = i % 2 === 0 ? 0 : yakuColumnWidth + yakuColumnGap;
        const y = (Math.floor(i / 2) + 0.5) * yakuRowHeight;
        const textYakuName = createSVGTextElement({
            text: getYakuName(yakuList[i].yakuId),
            x: yakuNameX,
            y,
            fontSize: yakuFontSize,
            textAnchor: "start",
            dominantBaseline: "central",
        });
        yakuElement.appendChild(textYakuName);
        if (yakuList[i].doubles < 13) {
            const yakuDoublesX = yakuNameX + yakuColumnWidth;
            const textYakuDoubles = createSVGTextElement({
                text: `${yakuList[i].doubles}飜`,
                x: yakuDoublesX,
                y,
                fontSize: yakuFontSize * 0.8,
                textAnchor: "end",
                dominantBaseline: "central",
            });
            yakuElement.appendChild(textYakuDoubles);
        }
    }
    const yakuSummaryText = (() => {
        if (yakuList.find(({ doubles }) => doubles === 13) != null) {
            const doublesText =
                yakuList.length === 1
                    ? "役満"
                    : yakuList.length === 2
                    ? "ダブル役満"
                    : yakuList.length === 3
                    ? "トリプル役満"
                    : `${yakuList.length}倍役満`;
            const scoreText = isSelfDraw
                ? isDealer
                    ? `${winScore / 3}点All`
                    : `${winScore / 4}-${winScore / 2}点`
                : `${winScore}点`;
            return `${doublesText} ${scoreText}`;
        } else {
            const sumDoubles = yakuList.reduce((sum, { doubles }) => sum + doubles, 0);
            const doublesText =
                sumDoubles >= 13
                    ? "役満"
                    : sumDoubles >= 11
                    ? "三倍満"
                    : sumDoubles >= 8
                    ? "倍満"
                    : sumDoubles >= 6
                    ? "跳満"
                    : winScore >= 8000 * (isDealer ? 1.5 : 1)
                    ? "満貫"
                    : `${points}符${sumDoubles}飜`;
            const scoreText = isSelfDraw
                ? isDealer
                    ? `${winScore / 3}点All`
                    : `${winScore / 4}-${winScore / 2}点`
                : `${winScore}点`;
            return `${doublesText} ${scoreText}`;
        }
    })();
    yakuElement.appendChild(
        createSVGTextElement({
            text: yakuSummaryText,
            x: yakuWidth / 2,
            y: (Math.ceil(yakuList.length / 2) + 0.5) * yakuRowHeight,
            fontSize: yakuSummaryFontSize,
        }),
    );

    return { yakuHeight, yakuElement };
};

type CreateDoraElementOptions = {
    readonly dora: readonly number[];
    readonly hiddenDora: readonly number[];
};
const createDoraElement = ({
    hiddenDora,
    dora,
}: CreateDoraElementOptions): { readonly doraElement: SVGSVGElement; readonly doraHeight: number } => {
    const doraHeight = doraCaptionHeight + (hiddenDora.length > 0 ? 2 * tileHeight : tileHeight);
    const doraElement = document.createElementNS(svgNS, "svg");
    doraElement.setAttribute("width", `${doraWidth * doraScale}`);
    doraElement.setAttribute("height", `${doraHeight * doraScale}`);
    doraElement.setAttribute("viewBox", `${-doraWidth / 2} 0 ${doraWidth} ${doraHeight}`);
    doraElement.appendChild(
        createSVGTextElement({
            text: "ドラ",
            x: 0,
            y: 0,
            fontSize: scoreFontSize,
            textAnchor: "middle",
            dominantBaseline: "text-before-edge",
        }),
    );
    for (let i = 0; i < 5; ++i) {
        const tile = createTile(dora[i] ?? null, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute("x", `${(i - 2) * tileWidth}`);
        tile.setAttribute("y", `${doraCaptionHeight + tileHeight / 2}`);
        doraElement.appendChild(tile);
    }
    if (hiddenDora.length > 0) {
        for (let i = 0; i < 5; ++i) {
            const tile = createTile(hiddenDora[i] ?? null, false);
            tile.setAttribute("opacity", "1");
            tile.setAttribute("x", `${(i - 2) * tileWidth}`);
            tile.setAttribute("y", `${doraCaptionHeight + tileHeight + tileHeight / 2}`);
            doraElement.appendChild(tile);
        }
    }
    return { doraHeight, doraElement };
};

const createWinHandElement = ({
    handTileStates,
    winScore,
    isSelfDraw,
    isDealer,
    points,
    yakuList,
    dora,
    hiddenDora,
}: PositionEventGameResultWin): {
    readonly element: SVGSVGElement;
    readonly width: number;
    readonly height: number;
} => {
    const { handElement, handWidth, handHeight } = createHandElement(handTileStates);
    handElement.setAttribute("x", `${-handWidth / 2}`);
    handElement.setAttribute("y", "0");

    const { yakuHeight, yakuElement } = createYakuElement({
        yakuList,
        isSelfDraw,
        isDealer,
        winScore,
        points,
    });
    yakuElement.setAttribute("x", `${-yakuDoraWidth / 2 + yakuDoraPadding}`);
    yakuElement.setAttribute("y", `${handHeight}`);

    // Origin: UpperMiddle
    const { doraHeight, doraElement } = createDoraElement({ dora, hiddenDora });
    doraElement.setAttribute("x", `${yakuDoraWidth / 2 - yakuDoraPadding - doraWidth * doraScale}`);
    doraElement.setAttribute("y", `${handHeight + tileWidth / 4}`);

    const width = Math.max(yakuDoraWidth, handWidth + tileWidth);
    const height = handHeight + Math.max(yakuHeight, doraHeight);
    // Origin: UpperMiddle
    const element = document.createElementNS(svgNS, "svg");
    element.setAttribute("width", `${width}`);
    element.setAttribute("height", `${height}`);
    element.setAttribute("viewBox", `${-width / 2} 0 ${width} ${height}`);
    // const bg = document.createElementNS(svgNS, "rect");
    // bg.setAttribute("fill", "#111827");
    // bg.setAttribute("width", `${width}`);
    // bg.setAttribute("height", `${height}`);
    // bg.setAttribute("x", `${-width / 2}`);
    // bg.setAttribute("y", `${0}`);
    // element.appendChild(bg);
    element.append(handElement, yakuElement, doraElement);

    return {
        element,
        width,
        height,
    };
};

const createDrawKindElement = (
    drawKind: DrawKind,
): { readonly element: SVGSVGElement; readonly width: number; readonly height: number } => {
    const drawKindElement = document.createElementNS(svgNS, "svg");
    drawKindElement.setAttribute("width", `${gameResultScoreWidth}`);
    drawKindElement.setAttribute("height", `${yakuSummaryRowHeight}`);
    drawKindElement.setAttribute(
        "viewBox",
        `${-gameResultScoreWidth / 2} ${-yakuSummaryRowHeight / 2} ${gameResultScoreWidth} ${yakuSummaryRowHeight}`,
    );
    const text = createSVGTextElement({
        text: drawKind,
        x: 0,
        y: 0,
        fontSize: yakuSummaryFontSize,
    });
    drawKindElement.appendChild(text);
    return {
        element: drawKindElement,
        width: gameResultScoreWidth,
        height: yakuSummaryRowHeight,
    };
};

const createGameResult = (event: PositionEventGameResult): SVGGElement => {
    const container = document.createElementNS(svgNS, "g");
    container.setAttribute("id", gameResultId);
    const {
        element: topElement,
        width: topElementWidth,
        height: topElementHeight,
    } = event.kind === "gameResultWin" ? createWinHandElement(event) : createDrawKindElement(event.drawKind);

    const width = Math.max(topElementWidth, gameResultScoreWidth);
    const height = topElementHeight + gameResultScoreHeight;
    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("x", `${-width / 2}`);
    bg.setAttribute("y", `${-height / 2}`);
    bg.setAttribute("width", `${width}`);
    bg.setAttribute("height", `${height}`);
    bg.setAttribute("fill", "#111827");

    topElement.setAttribute("x", `${-topElementWidth / 2}`);
    topElement.setAttribute("y", `${-height / 2}`);
    const scoreElement = createScoreElement(event.players);
    scoreElement.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    scoreElement.setAttribute("y", `${-height / 2 + topElementHeight}`);
    container.append(bg, topElement, scoreElement);

    return container;
};

export const showGameResult = (event: PositionEventGameResult): void => {
    const board = getElementByIdOrThrowError(boardId);
    const gameResult = createGameResult(event);
    board.appendChild(gameResult);
};

export const hideGameResult = (): void => {
    const gameResult = document.getElementById(gameResultId);
    gameResult?.remove();
};
