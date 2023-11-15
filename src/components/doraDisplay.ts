import { svgNS, tileHeight, tileWidth } from "../const";
import { assertNonNull } from "../util/error";
import { createTile, getSrcTileId } from "./tile";

const doraDisplayTileId = "dora_display_tile";

let rightIndex = -1;
let doraTileIds: readonly number[] = [];

export const createDoraDisplay = (): SVGSVGElement => {
    const element = document.createElementNS(svgNS, "svg");
    const width = 5 * tileWidth;
    element.setAttribute("width", `${width}`);
    element.setAttribute("height", `${tileHeight}`);
    element.setAttribute("viewBox", `0 0 ${width} ${tileHeight}`);
    for (let i = 0; i < 5; ++i) {
        const tile = createTile(null, false);
        tile.setAttribute("id", `${doraDisplayTileId}${i}`);
        tile.setAttribute("x", `${tileWidth / 2 + i * tileWidth}`);
        tile.setAttribute("y", `${tileHeight / 2}`);
        tile.setAttribute("opacity", "1");
        element.appendChild(tile);
    }
    return element;
};

export const updateDoraTileIds = (tileIds: readonly number[]): void => {
    doraTileIds = tileIds;
    updateDoraRightIndex(rightIndex);
};

export const updateDoraRightIndex = (value: number): void => {
    rightIndex = value;
    let i = 0;
    for (; i <= rightIndex && i < doraTileIds.length; ++i) {
        const tileId = `${doraDisplayTileId}${i}`;
        const tile = document.getElementById(tileId);
        assertNonNull(tile, tileId);
        tile.setAttribute("href", `tiles.svg#${getSrcTileId(doraTileIds[i])}`);
    }
    for (; i < 5; ++i) {
        const tileId = `${doraDisplayTileId}${i}`;
        const tile = document.getElementById(tileId);
        assertNonNull(tile, tileId);
        tile.setAttribute("href", `tiles.svg#${getSrcTileId(null)}`);
    }
};
