import { gameResultScoreHeight, gameResultScoreWidth, svgNS } from "../const";
import { type PositionEventGameResult } from "../modules/positionEvent/types";
import { assertNonNull } from "../util/error";
import { boardId } from "./board";

const gameResultId = "game_result";
const scoreFontSize = 500;

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
    location: { readonly x: number; readonly y: number },
): SVGElement => {
    const container = document.createElementNS(svgNS, "svg");
    container.setAttribute("x", `${location.x}`);
    container.setAttribute("y", `${location.y}`);
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
        const name = document.createElementNS(svgNS, "text");
        name.setAttribute("text-anchor", "middle");
        name.setAttribute("dominant-baseline", "middle");
        name.setAttribute("x", `${scoreLocationX[sideIndex]}`);
        name.setAttribute("y", `${scorePlayerNameLocationY[sideIndex]}`);
        name.setAttribute("font-size", `${scoreFontSize}`);
        name.textContent = players[sideIndex].name;
        const increment = document.createElementNS(svgNS, "text");
        increment.setAttribute("text-anchor", "middle");
        increment.setAttribute("dominant-baseline", "middle");
        increment.setAttribute("fill", players[sideIndex].increment > 0 ? "#dc2626" : "#2563eb");
        increment.setAttribute("x", `${scoreLocationX[sideIndex]}`);
        increment.setAttribute("y", `${scoreIncrementLocationY[sideIndex]}`);
        increment.setAttribute("font-size", `${scoreFontSize}`);
        increment.textContent = players[sideIndex].increment === 0 ? "" : `${players[sideIndex].increment}`;
        const score = document.createElementNS(svgNS, "text");
        score.setAttribute("text-anchor", "middle");
        score.setAttribute("dominant-baseline", "middle");
        score.setAttribute("x", `${scoreLocationX[sideIndex]}`);
        score.setAttribute("y", `${scoreLocationY[sideIndex]}`);
        score.setAttribute("font-size", `${scoreFontSize}`);
        score.textContent = `${players[sideIndex].newScore}`;
        container.append(name, increment, score);
    }

    return container;
};

const createGameResult = (event: PositionEventGameResult): SVGGElement => {
    const result = document.createElementNS(svgNS, "g");
    result.setAttribute("id", gameResultId);
    // temporary
    const score = createScoreElement(event.players, { x: -gameResultScoreWidth / 2, y: 0 });
    // end temporary
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
