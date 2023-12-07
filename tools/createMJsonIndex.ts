import { type MJson } from "../src/modules/mJson/types/mJson";
import { type MJsonIndexItem, type MJsonIndex } from "../src/modules/mJsonIndex/types";
import { promises as fs } from "fs";
import path from "path";

const arrayToGroup = <T, K>(arr: readonly T[], keySelector: (element: T) => K): Map<K, T[]> => {
    const map = new Map<K, T[]>();
    for (const element of arr) {
        const key = keySelector(element);
        map.set(key, [...(map.get(key) ?? []), element]);
    }
    return map;
};

const indexFileName = "mjson_index.json";
const targetDir = path.resolve("public", "data");

type DatedMJsonIndexItem = MJsonIndexItem & {
    readonly year: number;
    readonly month: number;
    readonly date: number;
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
        const year = Math.floor(mJson.id / 1000000) + 2000;
        const month = Math.floor(mJson.id / 10000) % 100;
        const date = Math.floor(mJson.id / 100) % 100;
        const label = `${mJson.id} (${mJson.players
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
    children: [...arrayToGroup(items, (item) => item.year).entries()]
        .toSorted(([xKey], [yKey]) => xKey - yKey)
        .map(([year, yearItems]) => ({
            label: `${year}年`,
            children: [...arrayToGroup(yearItems, (yearItem) => yearItem.month).entries()]
                .toSorted(([xKey], [yKey]) => xKey - yKey)
                .map(([month, monthItems]) => ({
                    label: `${month}月`,
                    children: [...arrayToGroup(monthItems, (monthItem) => monthItem.date).entries()]
                        .toSorted(([xKey], [yKey]) => xKey - yKey)
                        .map(([date, dateItems]) => ({
                            label: `${date}日`,
                            items: dateItems.map(({ id, label }) => ({ id, label })),
                        })),
                })),
        })),
};

await fs.writeFile(path.join(targetDir, indexFileName), JSON.stringify(mJsonIndex), { encoding: "utf-8" });

console.log("Finish creating MJsonIndex file.");
