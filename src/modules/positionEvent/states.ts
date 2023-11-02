import { createPositionEvents } from "./initializer";
import sampleMJson from "../../data/sample1.json";
import { type MJson } from "../../types/Mjson/mJson";
import { type PositionEvent } from "./types";
import { upperBound } from "../../util/arrayExtensions";

const positionEvents = createPositionEvents(sampleMJson as MJson);
const gameBeginningPositions = positionEvents.flatMap((e, i) => (e.isBeginningGame ? [i] : []));
let positionIndex = 0;

export const getCurrentPositionEvent = (): PositionEvent => positionEvents[positionIndex];

export const currentPositionIsBeginningGame = (): boolean => gameBeginningPositions.includes(positionIndex);

export const goToPreviousPosition = (): void => {
    positionIndex = (positionIndex - 1 + positionEvents.length) % positionEvents.length;
};

export const goToNextPosition = (): void => {
    positionIndex = (positionIndex + 1) % positionEvents.length;
};

export const goToPreviousGame = (): void => {
    const gameIndex = upperBound(gameBeginningPositions, positionIndex) - 1;
    switch (positionIndex) {
        case 0:
            positionIndex = positionEvents.length - 1;
            break;
        case 1:
            positionIndex = 0;
            break;
        case positionEvents.length - 1:
            positionIndex = gameBeginningPositions[gameBeginningPositions.length - 1];
            break;
        case gameBeginningPositions[gameIndex]:
            positionIndex = gameBeginningPositions[gameIndex - 1];
            break;
        default:
            positionIndex = gameBeginningPositions[gameIndex];
            break;
    }
};

export const goToNextGame = (): void => {
    if (positionIndex === positionEvents.length - 1) {
        positionIndex = 0;
    } else {
        const gameIndex = upperBound(gameBeginningPositions, positionIndex) - 1;
        switch (gameIndex) {
            case -1:
                positionIndex = 1;
                break;
            case gameBeginningPositions.length - 1:
                positionIndex = positionEvents.length - 1;
                break;
            default:
                positionIndex = gameBeginningPositions[gameIndex + 1];
                break;
        }
    }
};
