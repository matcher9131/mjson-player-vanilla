import {
    defaultTextColorClassName,
    gameResultScoreHeight,
    gameResultScoreWidth,
    negativeNumberColorClassName,
    positiveNumberColorClassName,
    svgNS,
    tileHeight,
    tileWidth,
} from "@/const";
import { getYakuName } from "@/modules/mJson/types/yaku";
import { type PositionEventGameResultWin, type PositionEventGameResult } from "@/modules/positionEvent/types";
import { maxBy } from "@/util/arrayExtensions";
import { createSVGRectElement, createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";
import { boardId } from "./board";
import { createTile } from "./tile";
import { type TileState } from "@/modules/tileState/types";
import { type YakuDoubles } from "@/modules/mJson/types/yakuDoubles";
import { type DrawKind } from "@/modules/mJson/types/drawKind";
import { getDoraTileId } from "@/util/mahjongHelper";

const gameResultDisplayId = "game_result_display";
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

const scoreGridClasses = [
    ["row-start-2", "row-end-3", "col-start-2", "col-end-3"],
    ["row-start-1", "row-end-3", "col-start-3", "col-end-4"],
    ["row-start-1", "row-end-2", "col-start-2", "col-end-3"],
    ["row-start-1", "row-end-3", "col-start-1", "col-end-2"],
];
const scoreFontSizeClassName = "text-[400px]";

const createScoreElement = (
    players: ReadonlyArray<{ readonly name: string; readonly newScore: number; readonly increment: number }>,
): SVGForeignObjectElement => {
    const container = document.createElementNS(svgNS, "foreignObject");
    container.setAttribute("width", `${gameResultScoreWidth}`);
    container.setAttribute("height", `${gameResultScoreHeight}`);

    const gridRoot = document.createElement("div");
    gridRoot.classList.add(
        "w-full",
        "h-full",
        "grid",
        "grid-cols-3",
        "grid-rows-2",
        scoreFontSizeClassName,
        defaultTextColorClassName,
    );

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const element = document.createElement("div");
        element.classList.add(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "leading-[120%]",
            ...scoreGridClasses[sideIndex],
        );
        const nameElement = document.createElement("div");
        nameElement.textContent = players[sideIndex].name;
        const scoreElement = document.createElement("div");
        scoreElement.textContent = `${players[sideIndex].newScore}`;
        const incrementElement = document.createElement("div");
        incrementElement.textContent =
            players[sideIndex].increment === 0
                ? ""
                : players[sideIndex].increment > 0
                ? `+${players[sideIndex].increment}`
                : `${players[sideIndex].increment}`;
        incrementElement.classList.add(
            players[sideIndex].increment >= 0 ? positiveNumberColorClassName : negativeNumberColorClassName,
        );
        element.append(nameElement, scoreElement, incrementElement);
        gridRoot.appendChild(element);
    }

    container.appendChild(gridRoot);

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
    for (const [tileId, { x, isRotated, isFacedown }] of tileStates) {
        const tile = createTile(isFacedown === true ? null : tileId, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute(
            "transform",
            `translate(${x} ${height - (isRotated === true ? tileWidth / 2 : tileHeight / 2)}) rotate(${
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
        const tile = createTile(getDoraTileId(dora[i]), false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute("x", `${(i - 2) * tileWidth}`);
        tile.setAttribute("y", `${doraCaptionHeight + tileHeight / 2}`);
        doraElement.appendChild(tile);
    }
    if (hiddenDora.length > 0) {
        for (let i = 0; i < 5; ++i) {
            const tile = createTile(getDoraTileId(hiddenDora[i]), false);
            tile.setAttribute("opacity", "1");
            tile.setAttribute("x", `${(i - 2) * tileWidth}`);
            tile.setAttribute("y", `${doraCaptionHeight + tileHeight + tileHeight / 2}`);
            doraElement.appendChild(tile);
        }
    }
    return { doraHeight, doraElement };
};

type CreateWinHandElementReturnType = {
    readonly element: SVGSVGElement;
    readonly width: number;
    readonly height: number;
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
}: PositionEventGameResultWin): CreateWinHandElementReturnType => {
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

const createGameResultDisplay = (event: PositionEventGameResult): SVGGElement => {
    const container = document.createElementNS(svgNS, "g");
    container.setAttribute("id", gameResultDisplayId);
    const {
        element: topElement,
        width: topElementWidth,
        height: topElementHeight,
    } = event.kind === "gameResultWin" ? createWinHandElement(event) : createDrawKindElement(event.drawKind);

    const width = Math.max(topElementWidth, gameResultScoreWidth);
    const height = topElementHeight + gameResultScoreHeight;

    container.appendChild(
        createSVGRectElement({
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            color: "#262626",
        }),
    );

    topElement.setAttribute("x", `${-topElementWidth / 2}`);
    topElement.setAttribute("y", `${-height / 2}`);
    const scoreElement = createScoreElement(event.players);
    scoreElement.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    scoreElement.setAttribute("y", `${-height / 2 + topElementHeight}`);
    container.append(topElement, scoreElement);

    return container;
};

export const showGameResultDisplay = (event: PositionEventGameResult): void => {
    const board = getElementByIdOrThrowError(boardId);
    const gameResult = createGameResultDisplay(event);
    board.appendChild(gameResult);
};

export const hideGameResultDisplay = (): void => {
    const gameResult = document.getElementById(gameResultDisplayId);
    gameResult?.remove();
};
