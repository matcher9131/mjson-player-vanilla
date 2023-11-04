import { svgNS } from "../const";
import { type PositionEventTileTransition } from "../modules/positionEvent/types";
import { assertNonNull } from "../util/error";

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
    newState: { x, y, sideIndex, isRotated, isInvisible },
}: PositionEventTileTransition): void => {
    const tile = document.querySelector(`#tile${tileId}`);
    assertNonNull(tile, `#tile${tileId}`);
    tile.setAttribute(
        "transform",
        `rotate(${-sideIndex * 90}) translate(${x} ${y}) rotate(${isRotated ?? false ? 90 : 0})`,
    );
    tile.setAttribute("opacity", isInvisible ?? false ? "0" : "1");
};
