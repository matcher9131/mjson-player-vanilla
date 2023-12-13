import {
    defaultTextColorClassName,
    gameResultScoreHeight,
    gameResultScoreWidth,
    negativeNumberColorClassName,
    positiveNumberColorClassName,
    svgNS,
} from "@/const";
import { getBoardRotateionValue } from "@/models/boardRotationValue/states";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const scoreElementId = (sideIndex: number): string => `game_result_score_element${sideIndex}`;

const scoreFontSizeClassName = "text-[400px]";
const scoreGridClasses = [
    ["row-start-2", "row-end-3", "col-start-2", "col-end-3"],
    ["row-start-1", "row-end-3", "col-start-3", "col-end-4"],
    ["row-start-1", "row-end-2", "col-start-2", "col-end-3"],
    ["row-start-1", "row-end-3", "col-start-1", "col-end-2"],
];

export const createScoreElement = (
    players: ReadonlyArray<{ readonly name: string; readonly newScore: number; readonly increment: number }>,
): SVGForeignObjectElement => {
    const container = document.createElementNS(svgNS, "foreignObject");
    container.setAttribute("width", `${gameResultScoreWidth}`);
    container.setAttribute("height", `${gameResultScoreHeight}`);

    const gridRoot = document.createElement("div");
    gridRoot.classList.add(
        "w-full",
        "h-full",
        "grid",
        "grid-cols-3",
        "grid-rows-2",
        scoreFontSizeClassName,
        defaultTextColorClassName,
    );

    const boardRotationValue = getBoardRotateionValue();
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const element = document.createElement("div");
        element.setAttribute("id", scoreElementId(sideIndex));
        element.classList.add(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "leading-[120%]",
            ...scoreGridClasses[(sideIndex + boardRotationValue) % 4],
        );
        const nameElement = document.createElement("div");
        nameElement.textContent = players[sideIndex].name;
        const scoreElement = document.createElement("div");
        scoreElement.textContent = `${players[sideIndex].newScore}`;
        const incrementElement = document.createElement("div");
        incrementElement.textContent =
            players[sideIndex].increment === 0
                ? ""
                : players[sideIndex].increment > 0
                ? `+${players[sideIndex].increment}`
                : `${players[sideIndex].increment}`;
        incrementElement.classList.add(
            players[sideIndex].increment >= 0 ? positiveNumberColorClassName : negativeNumberColorClassName,
        );
        element.append(nameElement, scoreElement, incrementElement);
        gridRoot.appendChild(element);
    }

    container.appendChild(gridRoot);

    return container;
};

export const updateGameResultScoreElement = (): void => {
    const boardRotationValue = getBoardRotateionValue();
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const element = getElementByIdOrThrowError(scoreElementId(sideIndex));
        element.classList.remove(...scoreGridClasses.flat());
        element.classList.add(...scoreGridClasses[(sideIndex + boardRotationValue) % 4]);
    }
};
