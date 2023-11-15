import { boardOneSize, svgNS } from "../const";
import { createCenterDisplay } from "./centerDisplay";
import { createOverlayText } from "./overlayText";
import { createTile } from "./tile";

export const boardId = "board";

export const createBoard = (): SVGSVGElement => {
    const board = document.createElementNS(svgNS, "svg");
    board.setAttribute("id", boardId);
    board.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);
    board.classList.add("flex-none", "bg-green-950");
    // temporary
    board.setAttribute("width", "500");
    board.setAttribute("height", "500");
    // end temporary
    const cd = createCenterDisplay();
    board.appendChild(cd);
    for (let i = 0; i < 136; ++i) {
        const tile = createTile(i);
        board.appendChild(tile);
    }
    for (let i = 0; i < 4; ++i) {
        const overlay = createOverlayText(i);
        board.appendChild(overlay);
    }
    return board;
};
