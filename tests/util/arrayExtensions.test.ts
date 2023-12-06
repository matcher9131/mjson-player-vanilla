import { describe, expect, test } from "vitest";
import { maxBy, insertTo, lowerBound, removeFrom, addVector } from "@/util/arrayExtensions";

describe("arrayExtension", () => {
    describe("lowerBoundが", () => {
        test("昇順にソート済みの配列arrに対し、x <= arr[i]となる最小のiを返す", () => {
            expect(lowerBound([1, 3, 5], 4)).toBe(2);
        });

        test("昇順にソート済みの配列arrに対し、x <= arr[i]となる最小のiを返す（x == arr[i]のパターン）", () => {
            expect(lowerBound([1, 3, 5], 3)).toBe(1);
        });

        test("昇順にソート済みの配列arrに対し、すべてのiにおいてx > arr[i]のときにarr.lengthを返す", () => {
            expect(lowerBound([1, 3, 5], 6)).toBe(3);
        });

        test("昇順にソート済みの配列arrに対し、x < arr[0]のときに0を返す", () => {
            expect(lowerBound([1, 3, 5], 0)).toBe(0);
        });

        test("空の配列arrに対し、0を返す", () => {
            expect(lowerBound([], 42)).toBe(0);
        });
    });

    describe("insertToにより", () => {
        test("昇順にソート済みの配列arrに対し、昇順を保つような箇所にxが挿入される（0 < i < length）", () => {
            const arr = [1, 3, 5];
            expect(insertTo(arr, 4)).toBe(2);
            expect(arr).toStrictEqual([1, 3, 4, 5]);
        });

        test("昇順にソート済みの配列arrに対し、昇順を保つような箇所にxが挿入される（0 < i < lengthかつ同じ要素がある）", () => {
            const arr = [1, 3, 5];
            expect(insertTo(arr, 3)).toBe(1);
            expect(arr).toStrictEqual([1, 3, 3, 5]);
        });

        test("昇順にソート済みの配列arrに対し、昇順を保つような箇所にxが挿入される（末尾に挿入）", () => {
            const arr = [1, 3, 5];
            expect(insertTo(arr, 6)).toBe(3);
            expect(arr).toStrictEqual([1, 3, 5, 6]);
        });

        test("昇順にソート済みの配列arrに対し、昇順を保つような箇所にxが挿入される（先頭に挿入）", () => {
            const arr = [1, 3, 5];
            expect(insertTo(arr, 0)).toBe(0);
            expect(arr).toStrictEqual([0, 1, 3, 5]);
        });

        test("空の配列arrに対し、先頭にxが挿入される", () => {
            const arr: number[] = [];
            expect(insertTo(arr, 42)).toBe(0);
            expect(arr).toStrictEqual([42]);
        });
    });

    describe("removeFromにより", () => {
        test("昇順にソート済みの配列arrに対し、xが削除される（0 < i < length）", () => {
            const arr = [1, 3, 5];
            expect(removeFrom(arr, 3)).toBe(1);
            expect(arr).toStrictEqual([1, 5]);
        });

        test("昇順にソート済みの配列arrに対し、複数あるxのうち1つが削除される（0 < i < length）", () => {
            const arr = [1, 3, 3, 5];
            expect(removeFrom(arr, 3)).toBe(1);
            expect(arr).toStrictEqual([1, 3, 5]);
        });

        test("昇順にソート済みの配列arrに対し、xが削除される（i == 0）", () => {
            const arr = [1, 3, 5];
            expect(removeFrom(arr, 1)).toBe(0);
            expect(arr).toStrictEqual([3, 5]);
        });

        test("昇順にソート済みの配列arrに対し、xが削除される（i == length - 1）", () => {
            const arr = [1, 3, 5];
            expect(removeFrom(arr, 5)).toBe(2);
            expect(arr).toStrictEqual([1, 3]);
        });

        test("昇順にソート済みの配列arrに対し、arrに含まれない要素xが指定されたとき何も削除されない", () => {
            const arr = [1, 3, 5];
            expect(removeFrom(arr, 4)).toBe(-1);
            expect(arr).toStrictEqual([1, 3, 5]);
        });
    });

    describe("MaxByが", () => {
        test("配列arrに対しpredicateで指定された計算で最大になるような要素を返す", () => {
            const f1 = { foo: "foo", bar: 3 };
            const f2 = { foo: "bar", bar: 42 };
            expect(maxBy([f1, f2], ({ bar }) => bar)).toStrictEqual(f2);
        });

        test("配列arrに対しpredicateで指定された計算で最大になるような要素を返す2", () => {
            const f1 = { foo: "foo", bar: 3 };
            const f2 = { foo: "bar", bar: 42 };
            expect(maxBy([f1, f2], ({ bar }) => -bar)).toStrictEqual(f1);
        });

        test("配列arrに対しpredicateで指定された計算で最大になるような要素を返す（計算が同じ結果になる要素がある）", () => {
            const f1 = { foo: "foo", bar: 42 };
            const f2 = { foo: "bar", bar: 42 };
            expect(maxBy([f1, f2], ({ bar }) => bar)).toStrictEqual(f1);
        });

        test("空の配列arrに対しnullを返す", () => {
            expect(maxBy([], () => 0)).toBeNull();
        });
    });

    describe("addVectorが", () => {
        test("同じ長さの配列x, yに対し各要素を足してできた配列を新たに返す", () => {
            const arr1 = [1, 3, 5];
            const arr2 = [8, -1, -10];
            expect(addVector(arr1, arr2)).toStrictEqual([9, 2, -5]);
        });

        test("異なる長さの配列x, yに対しエラーを投げる", () => {
            expect(() => {
                addVector([1], [2, 4]);
            }).toThrowError();
        });

        test("ともに空の配列x, yに対し空の配列を返す", () => {
            expect(addVector([], [])).toStrictEqual([]);
        });
    });
});
