import { gameResultScoreHeight, gameResultScoreWidth, svgNS, tileHeight, tileWidth } from "../const";
import { getYakuName } from "../modules/mJson/types/yaku";
import { type YakuDoubles } from "../modules/mJson/types/yakuDoubles";
import { type PositionEventGameResult } from "../modules/positionEvent/types";
import { type TileState } from "../modules/tileState/types";
import { MaxBy } from "../util/arrayExtensions";
import { createSVGTextElement } from "../util/domHelper";
import { assertNonNull } from "../util/error";
import { boardId } from "./board";
import { createTile } from "./tile";

const gameResultId = "game_result";
const scoreFontSize = 500;
const yakuFontSize = 500;

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
): SVGElement => {
    const left = Math.min(...[...tileStates.values()].map((state) => state.x)) - tileWidth / 2;
    const rightTile = MaxBy([...tileStates.values()], (state) => state.x);
    assertNonNull(rightTile, "rightTile");
    const right = rightTile.x + (rightTile.isRotated ?? false ? tileHeight / 2 : tileWidth / 2);
    const handWidth = right - left;
    const handHeight = tileWidth * 2; // 加槓の場合に備えて高さは牌の幅x2

    const hand = document.createElementNS(svgNS, "svg");
    hand.setAttribute("width", `${handWidth}`);
    hand.setAttribute("height", `${handHeight}`);
    hand.setAttribute("viewBox", `${-handWidth / 2} ${0} ${handWidth} ${handHeight}`);
    hand.setAttribute("x", `${-handWidth / 2}`);
    hand.setAttribute("y", "0");
    for (const [tileId, { x, isRotated }] of tileStates) {
        const tile = createTile(tileId, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute(
            "transform",
            `translate(${x} ${handHeight - tileHeight / 2}) rotate(${isRotated ?? false ? 90 : 0})`,
        );
        hand.appendChild(tile);
    }

    const yakuWidth = tileWidth * 14;
    // temporary
    const yakuRowHeight = tileWidth * 1.5;
    const yakuColumnWidth = tileWidth * 6;
    const yakuColumnGap = tileWidth * 1;
    // end temporary
    const yakuHeight = Math.ceil(yakuList.length / 2) * yakuRowHeight;
    const yaku = document.createElementNS(svgNS, "svg");
    yaku.setAttribute("width", `${yakuWidth}`);
    yaku.setAttribute("height", `${yakuHeight}`);
    yaku.setAttribute("viewBox", `${-yakuWidth / 2} 0 ${yakuWidth} ${yakuHeight}`);
    yaku.setAttribute("x", `${-yakuWidth / 2}`);
    yaku.setAttribute("y", `${handHeight}`);
    for (let i = 0; i < yakuList.length; ++i) {
        const yakuNameX = i % 2 === 0 ? -yakuColumnWidth - yakuColumnGap / 2 : yakuColumnGap / 2;
        const y = Math.floor(i / 2) * yakuRowHeight;
        const textYakuName = createSVGTextElement({
            text: getYakuName(yakuList[i].yakuId),
            x: yakuNameX,
            y,
            fontSize: yakuFontSize,
            textAnchor: "start",
            dominantBaseline: "text-before-edge",
        });
        yaku.appendChild(textYakuName);
        if (yakuList[i].doubles < 13) {
            const yakuDoublesX = i % 2 === 0 ? -yakuColumnGap / 2 : yakuColumnGap / 2 + yakuColumnWidth;
            const textYakuDoubles = createSVGTextElement({
                text: `${yakuList[i].doubles}飜`,
                x: yakuDoublesX,
                y,
                fontSize: yakuFontSize,
                textAnchor: "end",
                dominantBaseline: "text-before-edge",
            });
            yaku.appendChild(textYakuDoubles);
        }
    }

    const width = handWidth + tileWidth;
    const height = handHeight + yakuHeight;
    const container = document.createElementNS(svgNS, "svg");
    container.setAttribute("width", `${width}`);
    container.setAttribute("height", `${height}`);
    container.setAttribute("viewBox", `${-width / 2} 0 ${width} ${height}`);
    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("width", `${width}`);
    bg.setAttribute("height", `${height}`);
    bg.setAttribute("x", `${-width / 2}`);
    bg.setAttribute("y", `${0}`);
    container.appendChild(bg);
    container.append(hand, yaku);
    return container;
};

const createGameResult = (event: PositionEventGameResult): SVGGElement => {
    const result = document.createElementNS(svgNS, "g");
    result.setAttribute("id", gameResultId);
    let scoreY = -gameResultScoreHeight / 2;
    if (event.kind === "gameResultWin") {
        const hand = createHandElement(event.handTileStates, event.yakuList);
        const handWidth = hand.getAttribute("width");
        assertNonNull(handWidth, "handWidth");
        hand.setAttribute("x", `${-parseInt(handWidth) / 2}`);
        const handHeight = hand.getAttribute("height");
        assertNonNull(handHeight, "handHeight");
        hand.setAttribute("y", `${-(parseInt(handHeight) + gameResultScoreHeight) / 2}`);
        scoreY += parseInt(handHeight);
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
