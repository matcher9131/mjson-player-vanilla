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
