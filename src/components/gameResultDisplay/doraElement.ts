import { svgNS, tileHeight, tileWidth } from "@/const";
import { createSVGTextElement } from "@/util/domHelper";
import { createTile } from "../tile";
import { getDoraTileId } from "@/util/mahjongHelper";

const doraCaptionHeight = tileWidth;
const doraWidth = tileWidth * 5;
const doraScale = 0.8;
export const scaledDoraWidth = doraWidth * doraScale;
const doraFontSize = 400;

type CreateDoraElementOptions = {
    readonly dora: readonly number[];
    readonly hiddenDora: readonly number[];
};
export const createDoraElement = ({
    hiddenDora,
    dora,
}: CreateDoraElementOptions): { readonly doraElement: SVGSVGElement; readonly doraHeight: number } => {
    const doraHeight = doraCaptionHeight + (hiddenDora.length > 0 ? 2 * tileHeight : tileHeight);
    const doraElement = document.createElementNS(svgNS, "svg");
    doraElement.setAttribute("width", `${doraWidth * doraScale}`);
    doraElement.setAttribute("height", `${doraHeight * doraScale}`);
    doraElement.setAttribute("viewBox", `${-doraWidth / 2} 0 ${doraWidth} ${doraHeight}`);
    doraElement.appendChild(
        createSVGTextElement({
            text: "ドラ",
            x: 0,
            y: 0,
            fontSize: doraFontSize,
            textAnchor: "middle",
            dominantBaseline: "text-before-edge",
        }),
    );
    for (let i = 0; i < 5; ++i) {
        const tile = createTile(getDoraTileId(dora[i]), false);
        tile.setAttribute("opacity", "1");
        tile.setAttribute("x", `${(i - 2) * tileWidth}`);
        tile.setAttribute("y", `${doraCaptionHeight + tileHeight / 2}`);
        doraElement.appendChild(tile);
    }
    if (hiddenDora.length > 0) {
        for (let i = 0; i < 5; ++i) {
            const tile = createTile(getDoraTileId(hiddenDora[i]), false);
            tile.setAttribute("opacity", "1");
            tile.setAttribute("x", `${(i - 2) * tileWidth}`);
            tile.setAttribute("y", `${doraCaptionHeight + tileHeight + tileHeight / 2}`);
            doraElement.appendChild(tile);
        }
    }
    return { doraHeight, doraElement };
};
