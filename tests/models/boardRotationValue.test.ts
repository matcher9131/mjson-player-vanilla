import {
    decreaseBoardRotationValue,
    getBoardRotateionValue,
    increaseBoardRotationValue,
    resetBoardRotationValue,
} from "@/models/boardRotationValue/states";
import { beforeAll, describe, expect, test } from "vitest";

describe("boardRotationValue", () => {
    beforeAll(() => {
        resetBoardRotationValue();
    });

    describe("resetBoardRotationValueが", () => {
        test("呼び出されるとboardRotationValueが0になる", () => {
            increaseBoardRotationValue();
            resetBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(0);
            decreaseBoardRotationValue();
            resetBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(0);
        });
    });

    describe("increaseBoardRotationValueが", () => {
        test("呼び出される毎にboardRotationValueが0,1,2,3...の順に変化する", () => {
            expect(getBoardRotateionValue()).toBe(0);
            increaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(1);
            increaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(2);
            increaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(3);
            increaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(0);
        });
    });

    describe("decreaseBoardRotationValueが", () => {
        test("呼び出される毎にboardRotationValueが0,3,2,1...の順に変化する", () => {
            expect(getBoardRotateionValue()).toBe(0);
            decreaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(3);
            decreaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(2);
            decreaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(1);
            decreaseBoardRotationValue();
            expect(getBoardRotateionValue()).toBe(0);
        });
    });
});
