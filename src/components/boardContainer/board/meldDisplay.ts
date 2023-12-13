import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";
import { overlayTextOffsetX, overlayTextOffsetY } from "@/const";
import { type PositionEventMeld } from "@/models/positionEvent/types";
import { rotateVector2D } from "@/util/vector2D";
import { getBoardRotateionValue } from "@/models/boardRotationValue/states";

const overlayTextId = (sideIndex: number): string => `overlay_text${sideIndex}`;
const animationClassName = "animate-[fadeOut_0.5s]";

export const createMeldDisplay = (sideIndex: number): SVGTextElement => {
    const { x, y } = rotateVector2D({ x: overlayTextOffsetX, y: overlayTextOffsetY }, -90 * sideIndex);
    const element = createSVGTextElement({
        text: "",
        x,
        y,
        fontSize: 1000,
    });
    element.setAttribute("id", overlayTextId(sideIndex));
    element.setAttribute("opacity", "0");
    element.setAttribute("stroke", "#171717");
    element.setAttribute("stroke-width", "100");
    element.setAttribute("stroke-linejoin", "round");
    element.setAttribute("style", "paint-order: stroke;");
    return element;
};

export const showMeldDisplay = ({ sideIndex, text }: PositionEventMeld): void => {
    const index = (sideIndex + getBoardRotateionValue()) % 4;
    const element = getElementByIdOrThrowError(overlayTextId(index));
    element.textContent = text;
    element.classList.remove(animationClassName);
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            element.classList.add(animationClassName);
        });
    });
};
