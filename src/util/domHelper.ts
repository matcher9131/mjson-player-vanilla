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

type Size = { readonly width: number; readonly height: number };
type CreateCenterOriginSVGOptions = {
    readonly size: Size;
    readonly viewBoxSize?: Size;
};
export const createCenterOriginSVG = ({ size, viewBoxSize }: CreateCenterOriginSVGOptions): SVGElement => {
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
