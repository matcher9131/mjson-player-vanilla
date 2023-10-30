import { boardOneSize, svgNS } from "../const";
import { createTile } from "./tile";

export const createBoard = (): SVGElement => {
    const board = document.createElementNS(svgNS, "svg");
    for (let i = 0; i < 136; ++i) {
        const tile = createTile(i);
        board.appendChild(tile);
    }
    // temporary
    board.setAttribute("width", "500");
    board.setAttribute("height", "500");
    // end temporary
    board.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);
    board.classList.add("flex-none", "bg-gray-400");
    return board;
};
