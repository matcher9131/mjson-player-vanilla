import { svgNS } from "@/const";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const windDisplayId = (sideIndex: number): string => `wind_display${sideIndex}`;
const windSrcId = (windIndex: number): string =>
    "winds.svg#" + ["wind_east", "wind_south", "wind_west", "wind_north"][windIndex % 4];

export const createWindDisplay = (sideIndex: number): SVGUseElement => {
    const element = document.createElementNS(svgNS, "use");
    element.setAttribute("id", windDisplayId(sideIndex));
    element.setAttribute("href", windSrcId(sideIndex));
    return element;
};

export const updateWindDisplay = (dealerSideIndex: number): void => {
    for (let i = 0; i < 4; ++i) {
        const sideIndex = (dealerSideIndex + i) % 4;
        const element = getElementByIdOrThrowError(windDisplayId(sideIndex));
        element.setAttribute("href", windSrcId(i));
    }
};
