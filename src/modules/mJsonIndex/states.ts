import { assertNonNull } from "@/util/error";
import { type MJsonIndex } from "./types";

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
