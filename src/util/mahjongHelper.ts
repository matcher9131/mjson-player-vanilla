export const getDoraTileId = (doraDisplayTileId: number): number => {
    const tileKindId = doraDisplayTileId >> 2;
    if (tileKindId < 27) {
        // 数牌
        const color = Math.floor(tileKindId / 9);
        const num = (tileKindId + 1) % 9;
        return 4 * (9 * color + num) + 1; // 0 (mod 4)だと赤ドラが選ばれる可能性があるので1 (mod 4)にする
    } else if (tileKindId < 31) {
        // 風牌
        return 4 * (27 + ((tileKindId - 27 + 1) % 4));
    } else {
        // 三元牌
        return 4 * (31 + ((tileKindId - 31 + 1) % 3));
    }
};
