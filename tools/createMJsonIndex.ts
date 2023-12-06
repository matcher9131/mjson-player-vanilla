import { type MJson } from "../src/modules/mJson/types/mJson";
import { type MJsonIndexItem, type MJsonIndex } from "../src/modules/mJsonIndex/types";
import { promises as fs } from "fs";
import path from "path";

const arrayToGroup = <T>(arr: readonly T[], keySelector: (element: T) => string): Map<string, T[]> => {
    const map = new Map<string, T[]>();
    for (const element of arr) {
        const key = keySelector(element);
        map.set(key, [...(map.get(key) ?? []), element]);
    }
    return map;
};

const indexFileName = "mjson_index.json";
const targetDir = path.resolve("public", "data");

type DatedMJsonIndexItem = MJsonIndexItem & {
    readonly year: string;
    readonly month: string;
    readonly date: string;
};
const items: DatedMJsonIndexItem[] = [];

const fileNames = await fs.readdir(targetDir);
fileNames.sort();
for (const fileName of fileNames) {
    if (fileName === indexFileName) continue;
    if (!fileName.endsWith(".json")) continue;
    try {
        const content = await fs.readFile(path.join(targetDir, fileName), { encoding: "utf-8" });
        const mJson = JSON.parse(content) as MJson;
        const year = `${Math.floor(mJson.id / 1000000) + 2000}年`;
        const month = `${Math.floor(mJson.id / 10000) % 100}月`;
        const date = `${Math.floor(mJson.id / 100) % 100}日`;
        const order = `${mJson.id % 100}`.padStart(2, "0");
        const label = `${order} (${mJson.players
            .toSorted((x, y) => x.rank - y.rank)
            .map(({ name, income }) => `${name} ${income > 0 ? `+${income}` : income}`)
            .join(" / ")})`;
        items.push({ year, month, date, label, id: fileName.substring(0, fileName.lastIndexOf(".")) });
    } catch (err) {
        console.log(err);
    }
}

const mJsonIndex: MJsonIndex = {
    label: "root",
    children: [...arrayToGroup(items, (item) => item.year).entries()].map(([year, yearItems]) => ({
        label: year,
        children: [...arrayToGroup(yearItems, (yearItem) => yearItem.month).entries()].map(([month, monthItems]) => ({
            label: month,
            children: [...arrayToGroup(monthItems, (monthItem) => monthItem.date).entries()].map(
                ([date, dateItems]) => ({
                    label: date,
                    items: dateItems.map(({ id, label }) => ({ id, label })),
                }),
            ),
        })),
    })),
};

await fs.writeFile(path.join(targetDir, indexFileName), JSON.stringify(mJsonIndex), { encoding: "utf-8" });

console.log("Finish creating MJsonIndex file.");
