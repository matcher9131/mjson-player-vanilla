export type TileState = {
    readonly x: number;
    readonly y: number;
    readonly sideIndex: number;
    readonly isRotated?: boolean;
    readonly isInvisible?: boolean;
    readonly isFacedown?: boolean;
};

export type TileStateTransition = {
    readonly kind: "forward" | "backward";
    readonly tileId: number;
    readonly newState: TileState;
};
