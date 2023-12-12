import { gameNumberTextOffsetX, gameNumberTextOffsetY } from "@/const";
import { getMJson } from "@/models/mJson/states";
import { type GameIndex } from "@/models/positionEvent/types";
import { createSVGTextElement, getElementByIdOrThrowError } from "@/util/domHelper";

const roundTextId = "round_text";

export const createRoundDisplay = (): SVGTextElement => {
    const element = createSVGTextElement({
        text: "",
        x: gameNumberTextOffsetX,
        y: gameNumberTextOffsetY,
        fontSize: 900,
    });
    element.setAttribute("id", roundTextId);
    return element;
};

export const updateRoundDisplay = (gameIndex: GameIndex): void => {
    if (gameIndex === "pre" || gameIndex === "post") return;
    const roundText = getElementByIdOrThrowError(roundTextId);
    const round = getMJson().games[gameIndex].round;
    roundText.textContent = `${["東", "南", "西", "北"][round >> 2]}${(round % 4) + 1}局`;
};
