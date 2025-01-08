import { assertNonNull } from "@/util/error";
import { type MJsonIndexNode, type MJsonIndex, type MJsonIndexItem } from "./types";
import { type Mock } from "vitest"; // For in-source testing

const loadMJsonIndexFailureMessage = "Failed loading 'mjson_index.json'";

let mJsonIndex: MJsonIndex | null = null;

const loadMJsonIndex = async (): Promise<void> => {
    const response = await fetch("/data/mjson_index.json");
    if (!response.ok) throw new Error(loadMJsonIndexFailureMessage);
    const json = await response.json();
    mJsonIndex = json as MJsonIndex;
};

export const getMJsonIndex = async (): Promise<MJsonIndex> => {
    if (mJsonIndex == null) {
        await loadMJsonIndex();
    }
    assertNonNull(mJsonIndex);
    return mJsonIndex;
};

const getMJsonIndexItems = function* (node: MJsonIndexNode): IterableIterator<MJsonIndexItem> {
    if ("children" in node) {
        for (const child of node.children) {
            yield* getMJsonIndexItems(child);
        }
    } else {
        for (const item of node.items) {
            yield item;
        }
    }
};

export const getAllMatchIds = async (): Promise<string[]> => {
    const mji = await getMJsonIndex();
    return [...getMJsonIndexItems(mji)].map((item) => item.id);
};

// In-source testing
if (import.meta.vitest != null) {
    const { afterAll, beforeEach, describe, test, vi, expect } = import.meta.vitest;

    const mJsonIndexRootOnly: MJsonIndex = {
        label: "root",
        children: [],
    };

    const mJsonIndexFoo: MJsonIndex = {
        label: "root",
        children: [
            {
                label: "foo1",
                children: [
                    {
                        label: "foo11",
                        items: [
                            {
                                id: "bar1",
                                label: "bar1 label",
                            },
                            {
                                id: "bar2",
                                label: "bar2 label",
                            },
                        ],
                    },
                ],
            },
            {
                label: "foo2",
                items: [
                    {
                        id: "baz1",
                        label: "baz1 label",
                    },
                ],
            },
            {
                label: "foo3",
                items: [],
            },
        ],
    };

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const fetchMJsonIndexRootOnly = (): Promise<Pick<Response, "ok" | "json">> =>
        new Promise((resolve) => {
            resolve({
                ok: true,
                json: async () => mJsonIndexRootOnly,
            });
        });

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const fetchMJsonIndexFoo = (): Promise<Pick<Response, "ok" | "json">> =>
        new Promise((resolve) => {
            resolve({
                ok: true,
                json: async () => mJsonIndexFoo,
            });
        });

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const fetchMJsonIndexFailure = (): Promise<Pick<Response, "ok">> =>
        new Promise((resolve) => {
            resolve({
                ok: false,
            });
        });

    describe("mJsonIndex", () => {
        beforeEach(() => {
            mJsonIndex = null;
        });

        test("MJsonIndexの読み込みに失敗したときにgetMJsonIndexがエラーを投げる", async () => {
            const mockFetch = vi.fn().mockImplementation(fetchMJsonIndexFailure);
            global.fetch = mockFetch;

            expect.assertions(1);
            try {
                await getMJsonIndex();
            } catch (e) {
                expect((e as Error).message).toBe(loadMJsonIndexFailureMessage);
            }
        });

        test("初めてgetMJsonIndexを呼び出したときにloadMJsonIndexが呼ばれる", async (): Promise<void> => {
            const mockFetch = vi.fn().mockImplementation(fetchMJsonIndexRootOnly);
            global.fetch = mockFetch;

            expect(mockFetch).toBeCalledTimes(0);
            await getMJsonIndex();
            expect(mockFetch).toBeCalledTimes(1);
            await getMJsonIndex();
            expect(mockFetch).toBeCalledTimes(1);
        });

        test("getAllMatchIdsがMJsonIndex内のIDのみからなる配列を返す", async (): Promise<void> => {
            const mockFetch = vi.fn().mockImplementation(fetchMJsonIndexFoo);
            global.fetch = mockFetch;

            await getMJsonIndex();
            const allMatchIds = await getAllMatchIds();
            expect(allMatchIds).toStrictEqual(["bar1", "bar2", "baz1"]);
        });

        test("rootしかないMJsonIndexを読み込んだ後にgetAllMatchIdsが空の配列を返す", async (): Promise<void> => {
            const mockFetch = vi.fn().mockImplementation(fetchMJsonIndexRootOnly);
            global.fetch = mockFetch;

            await getMJsonIndex();
            const allMatchIds = await getAllMatchIds();
            expect(allMatchIds).toStrictEqual([]);
        });

        afterAll(() => {
            (global.fetch as Mock).mockClear();
        });
    });
}
