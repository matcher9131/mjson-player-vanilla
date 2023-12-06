import { assertNonNull } from "@/util/error";
import { type MJsonIndexNode, type MJsonIndex, type MJsonIndexItem } from "./types";

let mJsonIndex: MJsonIndex | null = null;

const loadMJsonIndex = async (): Promise<void> => {
    const response = await fetch("/data/mjson_index.json");
    if (!response.ok) throw new Error("Failed loading 'mjson_index.json'");
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
