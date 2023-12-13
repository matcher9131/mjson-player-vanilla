import {
    playerNameDisplayOffsetX,
    playerNameDisplayOffsetY,
    riichiStickOffsetX,
    riichiStickOffsetY,
    scoreTextOffsetX,
    scoreTextOffsetY,
    svgNS,
    windDisplayOffsetX,
    windDisplayOffsetY,
} from "@/const";
import { createPlayerNameDisplay } from "./playerNameDisplay";
import { createScoreDisplay } from "./scoreDisplay";
import { createWindDisplay } from "./windDisplay";
import { createRiichiStickDisplay } from "./riichiStickDisplay";
import { createTile } from "./tile";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const rotationBoardId = "rotation_board";

export const createRotationBoard = (): SVGGElement => {
    const container = document.createElementNS(svgNS, "g");
    container.setAttribute("id", rotationBoardId);

    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        const scoreText = createScoreDisplay(sideIndex);
        scoreText.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${scoreTextOffsetX} ${scoreTextOffsetY})`,
        );
        container.appendChild(scoreText);

        const windDisplay = createWindDisplay(sideIndex);
        windDisplay.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${windDisplayOffsetX} ${windDisplayOffsetY})`,
        );
        container.appendChild(windDisplay);

        const riichiStick = createRiichiStickDisplay(sideIndex);
        riichiStick.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${riichiStickOffsetX} ${riichiStickOffsetY})`,
        );
        container.appendChild(riichiStick);

        const playerName = createPlayerNameDisplay(sideIndex);
        playerName.setAttribute(
            "transform",
            `rotate(${-90 * sideIndex}) translate(${playerNameDisplayOffsetX} ${playerNameDisplayOffsetY})`,
        );
        container.appendChild(playerName);
    }

    for (let i = 0; i < 136; ++i) {
        const tile = createTile(i);
        container.appendChild(tile);
    }

    return container;
};

export const rotateRotationBoard = (boardRotationValue: number): void => {
    const rotationBoard = getElementByIdOrThrowError(rotationBoardId);
    rotationBoard.setAttribute("transform", `rotate(${-90 * boardRotationValue})`);
};
