import { getElementByIdOrThrowError } from "@/util/domHelper";
import { overlayTextOffsetX, overlayTextOffsetY, svgNS } from "@/const";
import { type PositionEventMeld } from "@/modules/positionEvent/types";
import { rotateVector2D } from "@/util/vector2D";

const overlayTextId = (sideIndex: number): string => `overlay_text${sideIndex}`;
const animationClassName = "animate-[fadeOut_0.5s]";

export const createMeldDisplay = (sideIndex: number): SVGTextElement => {
    const element = document.createElementNS(svgNS, "text");
    element.setAttribute("id", overlayTextId(sideIndex));
    element.setAttribute("opacity", "0");
    const { x, y } = rotateVector2D({ x: overlayTextOffsetX, y: overlayTextOffsetY }, -90 * sideIndex);
    element.setAttribute("x", `${x}`);
    element.setAttribute("y", `${y}`);
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("dominant-baseline", "middle");
    element.setAttribute("font-size", "1000");
    element.setAttribute("fill", "floralwhite");
    element.setAttribute("style", "text-shadow: 2px 2px 0 gray;");
    return element;
};

export const showMeldDisplay = ({ sideIndex, text }: PositionEventMeld): void => {
    const element = getElementByIdOrThrowError(overlayTextId(sideIndex));
    element.textContent = text;
    element.classList.remove(animationClassName);
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            element.classList.add(animationClassName);
        });
    });
};
