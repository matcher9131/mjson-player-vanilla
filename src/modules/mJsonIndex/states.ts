import { type MJsonIndex } from "./types";

export const loadMJsonIndex = async (): Promise<MJsonIndex> => {
    const response = await fetch("/data/mjson_index.json");
    if (!response.ok) throw new Error("Failed loading 'mjson_index.json'");
    const json = await response.json();
    return json as MJsonIndex;
};
