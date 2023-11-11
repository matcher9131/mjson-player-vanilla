import { gameResultScoreHeight, gameResultScoreWidth, svgNS, tileHeight, tileWidth } from "../const";
import { getYakuName } from "../modules/mJson/types/yaku";
import { type YakuDoubles } from "../modules/mJson/types/yakuDoubles";
import { type PositionEventGameResult } from "../modules/positionEvent/types";
import { type TileState } from "../modules/tileState/types";
import { maxBy } from "../util/arrayExtensions";
import { createSVGTextElement } from "../util/domHelper";
import { assertNonNull } from "../util/error";
import { boardId } from "./board";
import { createTile } from "./tile";

const gameResultId = "game_result";
const scoreFontSize = 400;
const yakuFontSize = 400;

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
): SVGElement => {
    const container = document.createElementNS(svgNS, "svg");
    container.setAttribute("width", `${gameResultScoreWidth}`);
    container.setAttribute("height", `${gameResultScoreHeight}`);
    container.setAttribute(
        "viewBox",
        `${-gameResultScoreWidth / 2} ${-gameResultScoreHeight / 2} ${gameResultScoreWidth} ${gameResultScoreHeight}`,
    );
    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("fill", "#111827");
    bg.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    bg.setAttribute("y", `${-gameResultScoreHeight / 2}`);
    bg.setAttribute("width", `${gameResultScoreWidth}`);
    bg.setAttribute("height", `${gameResultScoreHeight}`);
    container.appendChild(bg);

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const name = createSVGTextElement({
            text: players[sideIndex].name,
            x: scoreLocationX[sideIndex],
            y: scorePlayerNameLocationY[sideIndex],
            fontSize: scoreFontSize,
        });
        const increment = createSVGTextElement({
            text: players[sideIndex].increment === 0 ? "" : `${players[sideIndex].increment}`,
            x: scoreLocationX[sideIndex],
            y: scoreIncrementLocationY[sideIndex],
            fontSize: scoreFontSize,
            color: players[sideIndex].increment > 0 ? "#dc2626" : "#2563eb",
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
    yakuList: readonly YakuDoubles[],
    dora: readonly number[],
    hiddenDora: readonly number[],
): SVGElement => {
    const left = Math.min(...[...tileStates.values()].map((state) => state.x)) - tileWidth / 2;
    const rightTile = maxBy([...tileStates.values()], (state) => state.x);
    assertNonNull(rightTile, "rightTile");
    const right = rightTile.x + (rightTile.isRotated ?? false ? tileHeight / 2 : tileWidth / 2);
    const handWidth = right - left;
    const handHeight = tileWidth * 2; // 加槓の場合に備えて高さは牌の幅x2

    const handElement = document.createElementNS(svgNS, "svg");
    handElement.setAttribute("width", `${handWidth}`);
    handElement.setAttribute("height", `${handHeight}`);
    handElement.setAttribute("viewBox", `${-handWidth / 2} ${0} ${handWidth} ${handHeight}`);
    handElement.setAttribute("x", `${-handWidth / 2}`);
    handElement.setAttribute("y", "0");
    for (const [tileId, { x, isRotated }] of tileStates) {
        const tile = createTile(tileId, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute(
            "transform",
            `translate(${x} ${handHeight - (isRotated ?? false ? tileWidth / 2 : tileHeight / 2)}) rotate(${
                isRotated ?? false ? 90 : 0
            })`,
        );
        handElement.appendChild(tile);
    }

    const yakuWidth = tileWidth * 8;
    // temporary
    const yakuRowHeight = tileWidth * 1.5;
    const yakuColumnGap = tileWidth * 1;
    const yakuColumnWidth = (yakuWidth - yakuColumnGap) / 2;
    // end temporary
    const yakuHeight = Math.ceil(yakuList.length / 2) * yakuRowHeight;
    const yakuElement = document.createElementNS(svgNS, "svg");
    yakuElement.setAttribute("width", `${yakuWidth}`);
    yakuElement.setAttribute("height", `${yakuHeight}`);
    yakuElement.setAttribute("viewBox", `${-yakuWidth / 2} 0 ${yakuWidth} ${yakuHeight}`);
    yakuElement.setAttribute("x", `${-handWidth / 2}`);
    yakuElement.setAttribute("y", `${handHeight}`);
    for (let i = 0; i < yakuList.length; ++i) {
        const yakuNameX = i % 2 === 0 ? -yakuColumnWidth - yakuColumnGap / 2 : yakuColumnGap / 2;
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
            const yakuDoublesX = i % 2 === 0 ? -yakuColumnGap / 2 : yakuColumnGap / 2 + yakuColumnWidth;
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

    const doraCaptionHeight = tileWidth;
    const doraWidth = tileWidth * 5;
    const doraHeight = doraCaptionHeight + tileHeight + (hiddenDora.length > 0 ? tileHeight : 0);
    const doraElement = document.createElementNS(svgNS, "svg");
    doraElement.setAttribute("width", `${doraWidth}`);
    doraElement.setAttribute("height", `${doraHeight}`);
    doraElement.setAttribute("viewBox", `0 0 ${doraWidth} ${doraHeight}`);
    doraElement.appendChild(
        createSVGTextElement({
            text: "ドラ",
            x: doraWidth / 2,
            y: 0,
            fontSize: scoreFontSize,
            textAnchor: "middle",
            dominantBaseline: "text-before-edge",
        }),
    );
    for (let i = 0; i < 5; ++i) {
        const tile = createTile(dora[i] ?? null, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute("x", `${i * tileWidth + tileWidth / 2}`);
        tile.setAttribute("y", `${doraCaptionHeight + tileHeight / 2}`);
        doraElement.appendChild(tile);
    }
    if (hiddenDora.length > 0) {
        for (let i = 0; i < 5; ++i) {
            const tile = createTile(hiddenDora[i] ?? null, false);
            tile.setAttribute("opacity", "1");
            tile.setAttribute("x", `${i * tileWidth + tileWidth / 2}`);
            tile.setAttribute("y", `${doraCaptionHeight + tileHeight + tileHeight / 2}`);
            doraElement.appendChild(tile);
        }
    }
    doraElement.setAttribute("x", `${handWidth / 2 - 5 * tileWidth}`);
    doraElement.setAttribute("y", `${handHeight}`);

    const width = handWidth + tileWidth;
    const height = handHeight + Math.max(yakuHeight, doraHeight);
    const container = document.createElementNS(svgNS, "svg");
    container.setAttribute("width", `${width}`);
    container.setAttribute("height", `${height}`);
    container.setAttribute("viewBox", `${-width / 2} 0 ${width} ${height}`);
    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("fill", "#111827");
    bg.setAttribute("width", `${width}`);
    bg.setAttribute("height", `${height}`);
    bg.setAttribute("x", `${-width / 2}`);
    bg.setAttribute("y", `${0}`);
    container.appendChild(bg);
    container.append(handElement, yakuElement, doraElement);
    return container;
};

const createGameResult = (event: PositionEventGameResult): SVGGElement => {
    const result = document.createElementNS(svgNS, "g");
    result.setAttribute("id", gameResultId);
    let scoreY = -gameResultScoreHeight / 2;
    if (event.kind === "gameResultWin") {
        const hand = createHandElement(event.handTileStates, event.yakuList, event.dora, event.hiddenDora);
        const handWidth = hand.getAttribute("width");
        assertNonNull(handWidth, "handWidth");
        hand.setAttribute("x", `${-parseInt(handWidth) / 2}`);
        const handHeight = hand.getAttribute("height");
        assertNonNull(handHeight, "handHeight");
        hand.setAttribute("y", `${-(parseInt(handHeight) + gameResultScoreHeight) / 2}`);
        scoreY += parseInt(handHeight) / 2;
        result.appendChild(hand);
    }
    const score = createScoreElement(event.players);
    score.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    score.setAttribute("y", `${scoreY}`);
    result.appendChild(score);

    return result;
};

export const showGameResult = (event: PositionEventGameResult): void => {
    const board = document.getElementById(boardId);
    assertNonNull(board);
    const gameResult = createGameResult(event);
    board.appendChild(gameResult);
};

export const hideGameResult = (): void => {
    const gameResult = document.getElementById(gameResultId);
    gameResult?.remove();
};
