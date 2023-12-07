import { type PositionEventTileTransition } from "@/modules/positionEvent/types";
import { svgNS } from "@/const";
import { getDefaultTileState } from "@/modules/tileState/states";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const tileDomId = (tileId: number): string => `tile${tileId}`;

export const getSrcTileId = (tileId: number | null): string => {
    return tileId == null
        ? "src_tile_facedown"
        : tileId === 16
        ? "src_tile4r"
        : tileId === 52
        ? "src_tile13r"
        : tileId === 88
        ? "src_tile22r"
        : `src_tile${tileId >> 2}`;
};

export const createTile = (tileId: number | null, setsId = true): SVGUseElement => {
    const srcTileId = getSrcTileId(tileId);
    const tile = document.createElementNS(svgNS, "use");
    if (setsId && tileId != null) tile.setAttribute("id", tileDomId(tileId));
    tile.classList.add("board-tile");
    tile.setAttribute("href", `#${srcTileId}`);
    // 初期状態
    tile.setAttribute("opacity", "0");
    return tile;
};

export const setTileAnimationAll = (animates: boolean): void => {
    if (animates) {
        document.querySelectorAll(".board-tile").forEach((element) => {
            element.classList.add("transition-all");
        });
    } else {
        document.querySelectorAll(".board-tile").forEach((element) => {
            element.classList.remove("transition-all");
        });
    }
};

export const updateTile = ({
    tileId,
    newState: { x, y, sideIndex, isRotated, isInvisible, isFacedown },
}: Omit<PositionEventTileTransition, "kind" | "isForward">): void => {
    const tile = getElementByIdOrThrowError(tileDomId(tileId));
    tile.setAttribute("href", isFacedown ?? false ? `#${getSrcTileId(null)}` : `#${getSrcTileId(tileId)}`);
    tile.setAttribute(
        "transform",
        `rotate(${-sideIndex * 90}) translate(${x} ${y}) rotate(${isRotated ?? false ? 90 : 0})`,
    );
    tile.setAttribute("opacity", isInvisible ?? false ? "0" : "1");
};

export const resetAllTiles = (): void => {
    for (let tileId = 0; tileId < 136; ++tileId) {
        updateTile({ tileId, newState: getDefaultTileState() });
    }
};
