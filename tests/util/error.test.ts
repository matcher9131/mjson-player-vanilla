import { assertFiniteNumber, assertNonNull } from "@/util/error";
import { describe, expect, test } from "vitest";

describe("error", () => {
    describe("assertsNonNullが", () => {
        test("非nullishに対してエラーを投げない", () => {
            expect(() => {
                assertNonNull(42);
            }).not.toThrowError();
        });

        test("nullに対してエラーを投げる", () => {
            expect(() => {
                assertNonNull(null);
            }).toThrowError();
        });

        test("undefinedに対してエラーを投げる", () => {
            expect(() => {
                assertNonNull(undefined);
            }).toThrowError();
        });
    });

    describe("assertFiniteNumberが", () => {
        test("NaNに対してエラーを投げる", () => {
            expect(() => {
                assertFiniteNumber(Math.log(-1));
            }).toThrowError();
        });

        test("Positive Infinityに対してエラーを投げる", () => {
            expect(() => {
                assertFiniteNumber(1 / 0);
            }).toThrowError();
        });

        test("Negative Infinityに対してエラーを投げる", () => {
            expect(() => {
                assertFiniteNumber(1 / -0);
            }).toThrowError();
        });

        test("NaNでもInfinityでもない数に対してエラーを投げない", () => {
            expect(() => {
                assertFiniteNumber(42);
            }).not.toThrowError();
        });
    });
});
