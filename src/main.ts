import { boardOneSize, svgNS, tileHeight, tileWidth } from "./const";
import "./index.css";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

const board = document.createElementNS(svgNS, "svg");
// temporary
board.setAttribute("width", "500");
board.setAttribute("height", "500");
// end temporary
board.classList.add("flex-none", "bg-gray-400");
board.setAttribute("viewBox", `${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`);

// temporary
new Array(36).fill(0).forEach((_, tileId) => {
    const svgTileId =
        tileId === 16 ? "tile4r" : tileId === 52 ? "tile13r" : tileId === 88 ? "tile22r" : `tile${tileId >> 2}`;
    const tile = document.createElementNS(svgNS, "use");
    tile.setAttribute("id", `board_tile${tileId}`);
    if (tileId <= 1) {
        tile.classList.add("transition-all");
    }
    // tile.setAttributeNS(svgNS, "width", `${tileWidth}`);
    // tile.setAttributeNS(svgNS, "height", `${tileHeight}`);
    tile.setAttribute("href", `#${svgTileId}`);
    // tile.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${svgTileId}`);
    const x = (tileId % 9) * tileWidth;
    const y = Math.floor(tileId / 9) * tileHeight;
    tile.setAttribute("transform", `translate(${x} ${y})`);
    board.appendChild(tile);
});
// end temporary

root.append(board);

let count: number = 0;
const button = document.createElement("button");
button.textContent = "→";
button.onclick = () => {
    const tile0 = document.getElementById("board_tile0");
    if (tile0 == null) throw new Error("'board_tile0' is not found.");
    const tile1 = document.getElementById("board_tile1");
    if (tile1 == null) throw new Error("'board_tile1' is not found.");
    ++count;
    tile0.setAttribute("transform", `translate(${-tileWidth * count} ${0})`);
    tile1.setAttribute("transform", `translate(${tileWidth} ${-tileHeight * count})`);
};

root.append(button);
