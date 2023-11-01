import { type TileStateTransition } from "./tileStateTransition";

export type TileState = {
    readonly x: number;
    readonly y: number;
    readonly sideIndex: number;
    readonly isRotated?: boolean;
    readonly isInvisible?: boolean;
    readonly isFacedown?: boolean;
};

export const getDefaultTileState = (): TileState => ({
    x: 0,
    y: 0,
    sideIndex: 0,
    isInvisible: true,
});

export const resetAllTileState = (): void => {
    document.querySelectorAll(".board-tile").forEach((element) => {
        element.setAttribute("transform", "translate(0 0)");
        element.setAttribute("opacity", "0");
    });
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

export const updateTileState = (transitions: readonly TileStateTransition[]): void => {
    for (const {
        tileId,
        newState: { x, y, sideIndex, isRotated, isInvisible },
    } of transitions) {
        const tile = document.querySelector(`#tile${tileId}`);
        if (tile == null) continue;
        tile.setAttribute(
            "transform",
            `rotate(${-sideIndex * 90}) translate(${x} ${y}) rotate(${isRotated ?? false ? 90 : 0})`,
        );
        tile.setAttribute("opacity", isInvisible ?? false ? "0" : "1");
    }
};
