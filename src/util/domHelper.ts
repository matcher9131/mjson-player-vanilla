import { svgNS } from "@/const";
import { assertNonNull } from "./error";

type CreateSVGTextElementOptions = {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color?: string;
    textAnchor?: "start" | "middle" | "end";
    dominantBaseline?:
        | "auto"
        | "alphabetic"
        | "ideographic"
        | "middle"
        | "central"
        | "mathematical"
        | "hanging"
        | "text-before-edge"
        | "text-after-edge";
};
export const createSVGTextElement = ({
    text,
    x,
    y,
    fontSize,
    color,
    textAnchor,
    dominantBaseline,
}: CreateSVGTextElementOptions): SVGTextElement => {
    const element = document.createElementNS(svgNS, "text");
    element.textContent = text;
    element.setAttribute("text-anchor", textAnchor ?? "middle");
    element.setAttribute("dominant-baseline", dominantBaseline ?? "central");
    element.setAttribute("x", `${x}`);
    element.setAttribute("y", `${y}`);
    element.setAttribute("font-size", `${fontSize}`);
    element.setAttribute("fill", color ?? "floralwhite");
    return element;
};

type Size = { readonly width: number; readonly height: number };
type CreateCenterOriginSVGOptions = {
    readonly size: Size;
    readonly viewBoxSize?: Size;
};
export const createCenterOriginSVG = ({ size, viewBoxSize }: CreateCenterOriginSVGOptions): SVGSVGElement => {
    const element = document.createElementNS(svgNS, "svg");
    element.setAttribute("width", `${size.width}`);
    element.setAttribute("height", `${size.height}`);
    if (viewBoxSize != null) {
        element.setAttribute(
            "viewBox",
            `${-viewBoxSize.width / 2} ${-viewBoxSize.height / 2} ${viewBoxSize.width} ${viewBoxSize.height}`,
        );
    } else {
        element.setAttribute("viewBox", `${-size.width / 2} ${-size.height / 2} ${size.width} ${size.height}`);
    }

    return element;
};

export const getElementByIdOrThrowError = (id: string): HTMLElement => {
    const element = document.getElementById(id);
    assertNonNull(element, id);
    return element;
};

type CreateSVGRectElementOptions = {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly color: string;
    readonly rx?: number;
    readonly ry?: number;
};
export const createSVGRectElement = ({
    x,
    y,
    width,
    height,
    color,
    rx,
    ry,
}: CreateSVGRectElementOptions): SVGRectElement => {
    const element = document.createElementNS(svgNS, "rect");
    element.setAttribute("x", `${x}`);
    element.setAttribute("y", `${y}`);
    element.setAttribute("width", `${width}`);
    element.setAttribute("height", `${height}`);
    element.setAttribute("fill", `${color}`);
    if (rx != null) element.setAttribute("rx", `${rx}`);
    if (ry != null) element.setAttribute("ry", `${ry}`);
    return element;
};
