import { gameResultScoreWidth, svgNS, tileWidth } from "@/const";
import { type DrawKind } from "@/models/mJson/types/drawKind";
import { createSVGTextElement } from "@/util/domHelper";

const drawRowHeight = tileWidth * 1.25;

export const createDrawKindElement = (
    drawKind: DrawKind,
): { readonly element: SVGSVGElement; readonly width: number; readonly height: number } => {
    const drawKindElement = document.createElementNS(svgNS, "svg");
    drawKindElement.setAttribute("width", `${gameResultScoreWidth}`);
    drawKindElement.setAttribute("height", `${drawRowHeight}`);
    drawKindElement.setAttribute(
        "viewBox",
        `${-gameResultScoreWidth / 2} ${-drawRowHeight / 2} ${gameResultScoreWidth} ${drawRowHeight}`,
    );
    const text = createSVGTextElement({
        text: drawKind,
        x: 0,
        y: 0,
        fontSize: 500,
    });
    drawKindElement.appendChild(text);
    return {
        element: drawKindElement,
        width: gameResultScoreWidth,
        height: drawRowHeight,
    };
};
