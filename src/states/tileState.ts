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

const states = new Array(136).fill(0).map(() => getDefaultTileState());

export const getTileState = (tileId: number): TileState => {
    return states[tileId];
};

export const setTileState = (tileId: number, state: TileState): void => {
    states[tileId] = state;
};

export const resetAllTileState = (): void => {
    for (let i = 0; i < states.length; ++i) {
        states[i] = getDefaultTileState();
    }
};
