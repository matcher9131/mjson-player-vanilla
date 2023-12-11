import { type PositionEventGameResultWin } from "@/models/positionEvent/types";
import { createHandElement } from "./handElement";
import { createYakuElement, yakuWidth } from "./yakuElement";
import { createDoraElement, scaledDoraWidth } from "./doraElement";
import { svgNS, tileWidth } from "@/const";

const yakuDoraPadding = tileWidth / 2;
const yakuDoraGap = tileWidth * 0.75;
// |<-- yakuDoraPadding -->|<-- yakuWidth -->|<-- yakuDoraGap -->|<-- scaledDoraWidth -->|<-- yakuDoraPadding -->|
const yakuDoraWidth = yakuDoraPadding * 2 + yakuWidth + yakuDoraGap + scaledDoraWidth;

type CreateWinHandElementReturnType = {
    readonly element: SVGSVGElement;
    readonly width: number;
    readonly height: number;
};
export const createWinHandElement = ({
    handTileStates,
    winScore,
    isSelfDraw,
    isDealer,
    points,
    yakuList,
    dora,
    hiddenDora,
}: PositionEventGameResultWin): CreateWinHandElementReturnType => {
    const { handElement, handWidth, handHeight } = createHandElement(handTileStates);
    handElement.setAttribute("x", `${-handWidth / 2}`);
    handElement.setAttribute("y", "0");

    const { yakuHeight, yakuElement } = createYakuElement({
        yakuList,
        isSelfDraw,
        isDealer,
        winScore,
        points,
    });
    yakuElement.setAttribute("x", `${-yakuDoraWidth / 2 + yakuDoraPadding}`);
    yakuElement.setAttribute("y", `${handHeight}`);

    // Origin: UpperMiddle
    const { doraHeight, doraElement } = createDoraElement({ dora, hiddenDora });
    doraElement.setAttribute("x", `${yakuDoraWidth / 2 - yakuDoraPadding - scaledDoraWidth}`);
    doraElement.setAttribute("y", `${handHeight + tileWidth / 4}`);

    const width = Math.max(yakuDoraWidth, handWidth + tileWidth);
    const height = handHeight + Math.max(yakuHeight, doraHeight);
    // Origin: UpperMiddle
    const element = document.createElementNS(svgNS, "svg");
    element.setAttribute("width", `${width}`);
    element.setAttribute("height", `${height}`);
    element.setAttribute("viewBox", `${-width / 2} 0 ${width} ${height}`);
    element.append(handElement, yakuElement, doraElement);

    return {
        element,
        width,
        height,
    };
};
