import { gameResultScoreHeight, gameResultScoreWidth, svgNS, tileWidth } from "@/const";
import { type PositionEventGameResult } from "@/modules/positionEvent/types";
import { createSVGRectElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { boardId } from "../board";
import { createScoreElement } from "./scoreElement";
import { createWinHandElement } from "./winHandElement";
import { createDrawKindElement } from "./drawElement";

// <GameResultWinDisplay>
//   <WinHandElement>
//     <HandElement />
//     <YakuElement />
//     <DoraElement />
//   </WinHandElement>
//   <ScoreElement />
// </GameResultWinDisplay>

// <GameResultDrawDisplay>
//   <DrawElement />
//   <ScoreElement />
// </GameResultDrawDisplay>

const gameResultDisplayId = "game_result_display";

const paddingTop = tileWidth / 2;
const paddingBottom = tileWidth / 4;

const createGameResultDisplay = (event: PositionEventGameResult): SVGGElement => {
    const container = document.createElementNS(svgNS, "g");
    container.setAttribute("id", gameResultDisplayId);
    const {
        element: topElement,
        width: topElementWidth,
        height: topElementHeight,
    } = event.kind === "gameResultWin" ? createWinHandElement(event) : createDrawKindElement(event.drawKind);

    const width = Math.max(topElementWidth, gameResultScoreWidth);
    const height = topElementHeight + gameResultScoreHeight + paddingTop + paddingBottom;

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
    topElement.setAttribute("y", `${-height / 2 + paddingTop}`);
    const scoreElement = createScoreElement(event.players);
    scoreElement.setAttribute("x", `${-gameResultScoreWidth / 2}`);
    scoreElement.setAttribute("y", `${-height / 2 + topElementHeight + paddingTop}`);
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
