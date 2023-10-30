import { svgNS } from "../const";

export const createTile = (tileId: number): SVGUseElement => {
    const srcTileId =
        tileId === 16
            ? "src_tile4r"
            : tileId === 52
            ? "src_tile13r"
            : tileId === 88
            ? "src_tile22r"
            : `src_tile${tileId >> 2}`;
    const tile = document.createElementNS(svgNS, "use");
    tile.setAttribute("id", `tile${tileId}`);
    tile.setAttribute("href", `#${srcTileId}`);
    // 初期状態
    tile.setAttribute("opacity", "0");
    return tile;
};
