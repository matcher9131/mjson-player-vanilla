import sampleMJson from "../../data/sample1.json";
import { type MJson } from "./types/mJson";

const mJson = sampleMJson as MJson;

export const getMJson = (): MJson => mJson;
