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
