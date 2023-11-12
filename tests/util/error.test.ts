import { assertNonNull } from "@/util/error";
import { describe, expect, test } from "vitest";

describe("error", () => {
    test("assertsNonNullが非nullishに対してエラーを投げない", () => {
        expect(() => {
            assertNonNull(42);
        }).not.toThrowError();
    });

    test("assertsNonNullがnullに対してエラーを投げる", () => {
        expect(() => {
            assertNonNull(null);
        }).toThrowError();
    });

    test("assertsNonNullがundefinedに対してエラーを投げる", () => {
        expect(() => {
            assertNonNull(undefined);
        }).toThrowError();
    });
});
