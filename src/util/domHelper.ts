import { svgNS } from "../const";

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

export const createCenterOriginSVG = (width: number, height: number): SVGElement => {
    const element = document.createElementNS(svgNS, "svg");
    element.setAttribute("width", `${width}`);
    element.setAttribute("height", `${height}`);
    element.setAttribute("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);
    return element;
};
