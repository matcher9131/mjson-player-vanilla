import { boardOneSize, svgNS } from "@/const";
import { createCenterDisplay } from "./centerDisplay";
import { createClosingDisplay } from "./closingDisplay";
import { createOpeningDisplay } from "./openingDisplay";
import { createOverlayText } from "./overlayText";
import { createTile } from "./tile";

export const boardId = "board";

export const createBoard = (): SVGSVGElement => {
    const board = document.createElementNS(svgNS, "svg");
    board.setAttribute("id", boardId);
    board.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);

    // 背景
    board.classList.add("flex-none", "bg-green-950");
    // temporary
    board.setAttribute("width", "500");
    board.setAttribute("height", "500");
    // end temporary

    // Center Display
    const centerDisplay = createCenterDisplay();
    board.appendChild(centerDisplay);

    // Tiles
    for (let i = 0; i < 136; ++i) {
        const tile = createTile(i);
        board.appendChild(tile);
    }

    // Overlay Text
    for (let i = 0; i < 4; ++i) {
        const overlay = createOverlayText(i);
        board.appendChild(overlay);
    }

    // Opening Display
    const openingDisplay = createOpeningDisplay();
    board.appendChild(openingDisplay);

    // Closing Display
    const closingDisplay = createClosingDisplay();
    board.appendChild(closingDisplay);

    return board;
};
