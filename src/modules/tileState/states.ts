import { type TileState } from "./types";

export const getDefaultTileState = (): TileState => ({
    x: 0,
    y: 0,
    sideIndex: 0,
    isInvisible: true,
});
