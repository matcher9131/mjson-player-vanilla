import { boardOneSize, svgNS } from "@/const";
import { createClosingDisplay } from "./closingDisplay";
import { createOpeningDisplay } from "./openingDisplay";
import { getElementByIdOrThrowError } from "@/util/domHelper";
import { createBoard } from "./board/board";

// <BoardContainer>
//   <Board>
//     <!-- 重なり順も考慮すること！ -->
//     <CenterDisplayBackground />
//     <RoundDisplay />
//     <BetsDisplay />
//     <DoraDisplay />
//     <RotationBoard>
//       <ScoreDisplay /> *
//       <WindDisplay /> *
//       <RiichiStickDisplay /> *
//       <PlayerNameDisplay /> *
//       <Tile /> *
//     </RotationBoard>
//     <MeldDisplay /> *
//     [<GameResultDispaly />]
//   </Board>
//   <OpeningDisplay />
//   <ClosingDisplay />
// </BoardContainer>

export const boardContainerId = "board_container";
const boardId = "board";

export const createBoardContainer = (): SVGSVGElement => {
    const boardContainer = document.createElementNS(svgNS, "svg");
    boardContainer.setAttribute("id", boardContainerId);
    boardContainer.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);

    const board = createBoard();
    boardContainer.appendChild(board);

    const openingDisplay = createOpeningDisplay();
    boardContainer.appendChild(openingDisplay);

    const closingDisplay = createClosingDisplay();
    boardContainer.appendChild(closingDisplay);

    boardContainer.classList.add(
        "flex-none",
        "w-[min(100vw,100vh)]",
        "h-[min(100vw,100vh)]",
        "bg-green-950",
        "select-none",
    );

    return boardContainer;
};

export const showBoard = (): void => {
    const board = getElementByIdOrThrowError(boardId);
    board.setAttribute("opacity", "1");
};

export const hideBoard = (): void => {
    const board = getElementByIdOrThrowError(boardId);
    board.setAttribute("opacity", "0");
};
