import { betsDisplayHeight, betsDisplayWidth, doraDisplayOffsetX, doraDisplayOffsetY, svgNS } from "@/const";
import { createCenterDisplayBackground } from "./centerDisplayBackground";
import { createRoundDisplay } from "./roundDisplay";
import { createBetsDisplay } from "./betsDisplay";
import { createDoraDisplay } from "./doraDisplay";
import { createRotationBoard } from "./rotationBoard/rotationBoard";
import { createMeldDisplay } from "./meldDisplay";

export const boardId = "board";

export const createBoard = (): SVGGElement => {
    const board = document.createElementNS(svgNS, "g");
    board.setAttribute("id", boardId);

    const centerDisplay = createCenterDisplayBackground();
    board.appendChild(centerDisplay);

    const roundText = createRoundDisplay();
    board.appendChild(roundText);

    const betsDisplay = createBetsDisplay();
    betsDisplay.setAttribute("x", `${-betsDisplayWidth / 2}`);
    betsDisplay.setAttribute("y", `${-betsDisplayHeight / 2}`);
    board.appendChild(betsDisplay);

    const doraDisplay = createDoraDisplay();
    doraDisplay.setAttribute("x", `${doraDisplayOffsetX}`);
    doraDisplay.setAttribute("y", `${doraDisplayOffsetY}`);
    board.appendChild(doraDisplay);

    const rotationBoard = createRotationBoard();
    board.appendChild(rotationBoard);

    for (let i = 0; i < 4; ++i) {
        const overlay = createMeldDisplay(i);
        board.appendChild(overlay);
    }

    // 初期状態
    board.setAttribute("opacity", "0");

    return board;
};
