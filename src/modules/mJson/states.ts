import { assertNonNull } from "@/util/error";
import { type MJson } from "./types/mJson";

let mJson: MJson | null = null;

// export const getMJsonOrNull = (): MJson | null => mJson;
export const getMJson = (): MJson => {
    assertNonNull(mJson, "MJson");
    return mJson;
};

export const setMJson = (value: MJson): void => {
    mJson = value;
};

export const loadMJson = async (id: string): Promise<MJson> => {
    const response = await fetch(`/data/${id}.json`);
    if (!response.ok) throw new Error(`Failed loading MJson file. id = ${id}`);
    const json = await response.json();
    return json as MJson;
};
