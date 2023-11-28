import { boardOneSize, playerNameDisplayOffsetX, playerNameDisplayOffsetY, svgNS } from "@/const";
import { createCenterDisplay } from "./centerDisplay";
import { createClosingDisplay } from "./closingDisplay";
import { createOpeningDisplay } from "./openingDisplay";
import { createMeldDisplay } from "./meldDisplay";
import { createTile } from "./tile";
import { createPlayerNameDisplay } from "./playerNameDisplay";

export const boardId = "board";

export const createBoard = (): SVGSVGElement => {
    const board = document.createElementNS(svgNS, "svg");
    board.setAttribute("id", boardId);
    board.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);

    // 背景
    board.classList.add("flex-none", "bg-green-950");

    // CenterDisplay
    const centerDisplay = createCenterDisplay();
    board.appendChild(centerDisplay);

    // 重なり順を考慮してPlayerNameDisplay, Tiles, OverlayTextの順で追加する
    // PlayerNameDisplay
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const playerName = createPlayerNameDisplay(sideIndex);
        playerName.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${playerNameDisplayOffsetX} ${playerNameDisplayOffsetY})`,
        );
        board.appendChild(playerName);
    }

    // Tiles
    for (let i = 0; i < 136; ++i) {
        const tile = createTile(i);
        board.appendChild(tile);
    }

    // OverlayText
    for (let i = 0; i < 4; ++i) {
        const overlay = createMeldDisplay(i);
        board.appendChild(overlay);
    }

    // OpeningDisplay
    const openingDisplay = createOpeningDisplay();
    board.appendChild(openingDisplay);

    // ClosingDisplay
    const closingDisplay = createClosingDisplay();
    board.appendChild(closingDisplay);

    // CSS
    board.classList.add("w-[min(100vw,100vh)]", "h-[min(100vw,100vh)]");

    return board;
};
