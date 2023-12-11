import { additionalKongTileY, boardOneSize, svgNS, tileHeight, tileWidth } from "@/const";
import { type TileState } from "@/models/tileState/types";
import { createTile } from "../tile";
import { assertNonNull } from "@/util/error";
import { maxBy } from "@/util/arrayExtensions";

export const createHandElement = (
    tileStates: ReadonlyMap<number, TileState>,
): { readonly handElement: SVGSVGElement; readonly handWidth: number; readonly handHeight: number } => {
    const hasAdditionalKong = [...tileStates.values()].find((tileState) => tileState.y === additionalKongTileY) != null;

    const left = Math.min(...[...tileStates.values()].map((state) => state.x)) - tileWidth / 2;
    const rightTile = maxBy([...tileStates.values()], (state) => state.x);
    assertNonNull(rightTile, "rightTile");
    const right = rightTile.x + (rightTile.isRotated ?? false ? tileHeight / 2 : tileWidth / 2);
    const width = right - left;
    const height = hasAdditionalKong ? tileWidth * 2 : tileHeight;

    const handElement = document.createElementNS(svgNS, "svg");
    handElement.setAttribute("width", `${width}`);
    handElement.setAttribute("height", `${height}`);
    handElement.setAttribute("viewBox", `${-width / 2} ${boardOneSize / 2 - height} ${width} ${height}`); // BoardのTileと同じ原点なのでViewBoxを調整する
    for (const [tileId, { x, y, isRotated, isFacedown }] of tileStates) {
        const tile = createTile(isFacedown === true ? null : tileId, false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute("transform", `translate(${x} ${y}) rotate(${isRotated ?? false ? 90 : 0})`);
        handElement.appendChild(tile);
    }

    return { handElement, handWidth: width, handHeight: height };
};
