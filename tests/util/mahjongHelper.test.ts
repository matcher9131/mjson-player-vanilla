import { getDoraTileId } from "@/util/mahjongHelper";
import { describe, expect, test } from "vitest";

describe("mahjongHelper", () => {
    describe("getDoraTileIdが正しいtileIdを返す", () => {
        test.each([
            [0, 5], // 一萬→二萬
            [5, 9], // 二萬→三萬
            [10, 13], // 三萬→四萬
            [15, 17], // 四萬→五萬
            [16, 21], // 五萬→六萬
            [32, 1], // 九萬→一萬
            [36, 41], // 1筒→2筒
            [71, 37], // 9筒→1筒
            [72, 77], // 1索→2索
            [104, 73], // 9索→1索
            [108, 112], // 東→南
            [113, 116], // 南→西
            [118, 120], // 西→北
            [123, 108], // 北→東
            [124, 128], // 白→発
            [129, 132], // 発→中
            [134, 124], // 中→白
        ])("display tile id: %i, expected return tile id: %i", (doraDisplayTileId, expected) => {
            expect(getDoraTileId(doraDisplayTileId)).toBe(expected);
        });
    });
});
