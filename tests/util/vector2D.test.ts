import { rotateVector2D } from "@/util/vector2D";
import { describe, expect, test } from "vitest";

describe("vector2D", () => {
    describe("rotate", () => {
        test.each([
            {
                v: { x: 1, y: 0 },
                degree: 90,
                expected: { x: 0, y: 1 },
            },
            {
                v: { x: 3, y: 4 },
                degree: 180,
                expected: { x: -3, y: -4 },
            },
        ])("rotate($v, $degree) = $expected", ({ v, degree, expected }) => {
            const actual = rotateVector2D(v, degree);
            expect(actual.x).toBeCloseTo(expected.x, 6);
            expect(actual.y).toBeCloseTo(expected.y, 6);
        });
    });
});
