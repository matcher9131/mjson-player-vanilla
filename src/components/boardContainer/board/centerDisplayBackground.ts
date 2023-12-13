import { createSVGRectElement } from "@/util/domHelper";
import { centerDisplayHeight, centerDisplayOffsetX, centerDisplayOffsetY, centerDisplayWidth } from "@/const";

export const createCenterDisplayBackground = (): SVGRectElement => {
    return createSVGRectElement({
        x: centerDisplayOffsetX,
        y: centerDisplayOffsetY,
        width: centerDisplayWidth,
        height: centerDisplayHeight,
        color: "#171717",
    });
};
