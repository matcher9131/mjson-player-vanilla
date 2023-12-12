import {
    defaultTextColorClassName,
    gameResultScoreHeight,
    gameResultScoreWidth,
    negativeNumberColorClassName,
    positiveNumberColorClassName,
    svgNS,
} from "@/const";

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

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const element = document.createElement("div");
        element.classList.add(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "leading-[120%]",
            ...scoreGridClasses[sideIndex],
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
