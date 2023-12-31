import { betsDisplayHeight, betsDisplayWidth, svgNS } from "@/const";
import { createCenterOriginSVG, createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";

const stickWidth = 900;
const width = stickWidth * 5;
const height = width / (betsDisplayWidth / betsDisplayHeight); // const.tsの設定を反映させる
const fontSize = 400;
const gapX = stickWidth / 4;

const hundredStickId = "bets_stick_hundred";
const thousandStickId = "bets_stick_thousand";
const numHundredsTextId = "bets_num_hundreds";
const numThousandsTextId = "bets_num_thousands";

type AdjustXProps = {
    readonly hundredStick: SVGElement;
    readonly thousandStick: SVGElement;
    readonly numHundredsText: SVGGraphicsElement;
    readonly numThousandsText: SVGGraphicsElement;
};
const adjustX = ({ hundredStick, thousandStick, numHundredsText, numThousandsText }: AdjustXProps): void => {
    hundredStick.setAttribute("x", `${-gapX / 2 - numHundredsText.getBBox().width - stickWidth / 2}`);
    numHundredsText.setAttribute("x", `${-gapX / 2 - numHundredsText.getBBox().width / 2}`);
    thousandStick.setAttribute("x", `${gapX / 2 + stickWidth / 2}`);
    numThousandsText.setAttribute("x", `${gapX / 2 + stickWidth + numThousandsText.getBBox().width / 2}`);
};

export const createBetsDisplay = (): SVGSVGElement => {
    const element = createCenterOriginSVG({
        size: { width: betsDisplayWidth, height: betsDisplayHeight },
        viewBoxSize: { width, height },
    });
    const hundredStick = document.createElementNS(svgNS, "use");
    hundredStick.setAttribute("id", hundredStickId);
    hundredStick.setAttribute("href", "#short_hundred_point_stick");
    element.appendChild(hundredStick);
    const thousandStick = document.createElementNS(svgNS, "use");
    thousandStick.setAttribute("id", thousandStickId);
    thousandStick.setAttribute("href", "#short_thousand_point_stick");
    element.appendChild(thousandStick);
    const numHundredsText = createSVGTextElement({
        text: "×0",
        x: 0,
        y: 0,
        fontSize,
        dominantBaseline: "middle",
    });
    numHundredsText.setAttribute("id", numHundredsTextId);
    element.appendChild(numHundredsText);
    const numThousandsText = createSVGTextElement({
        text: "×0",
        x: 0,
        y: 0,
        fontSize,
        dominantBaseline: "middle",
    });
    numThousandsText.setAttribute("id", numThousandsTextId);
    element.appendChild(numThousandsText);
    adjustX({ hundredStick, thousandStick, numHundredsText, numThousandsText });
    return element;
};

export const updateNumHundredSticks = (value: number): void => {
    const hundredStick = getElementByIdOrThrowError(hundredStickId) as unknown as SVGElement;
    const thousandStick = getElementByIdOrThrowError(thousandStickId) as unknown as SVGElement;
    const numHundredsText = getElementByIdOrThrowError(numHundredsTextId) as unknown as SVGTextElement;
    const numThousandsText = getElementByIdOrThrowError(numThousandsTextId) as unknown as SVGTextElement;
    numHundredsText.textContent = `×${value}`;
    adjustX({ hundredStick, thousandStick, numHundredsText, numThousandsText });
};

export const updateNumThousandSticks = (value: number): void => {
    const hundredStick = getElementByIdOrThrowError(hundredStickId) as unknown as SVGElement;
    const thousandStick = getElementByIdOrThrowError(thousandStickId) as unknown as SVGElement;
    const numHundredsText = getElementByIdOrThrowError(numHundredsTextId) as unknown as SVGTextElement;
    const numThousandsText = getElementByIdOrThrowError(numThousandsTextId) as unknown as SVGTextElement;
    numThousandsText.textContent = `×${value}`;
    adjustX({ hundredStick, thousandStick, numHundredsText, numThousandsText });
};
