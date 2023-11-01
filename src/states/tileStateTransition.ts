import { type TileState } from "./tileState.ts";

export type TileStateTransition = {
    readonly kind: "forward" | "backward";
    readonly tileId: number;
    readonly newState: TileState;
};
