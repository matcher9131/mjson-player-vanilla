import { createPositionEvents } from "./initializer";
import { type MatchPositionEvents, type GameIndex, type PositionEvent } from "./types";
import { assertNonNull } from "../../util/error";
import { type MJson } from "../mJson/types/mJson";

let positionEvents: MatchPositionEvents = new Map();
let gameIndex: GameIndex = "pre";
let positionIndex: number = 0;

const getNumGames = (): number =>
    [...positionEvents.keys()].filter((gameIndex) => gameIndex !== "pre" && gameIndex !== "post").length;

const getCurrentGameEvents = (): ReadonlyArray<readonly PositionEvent[]> => {
    const currentGameEvents = positionEvents.get(gameIndex);
    assertNonNull(currentGameEvents, `positionEvents[${gameIndex}]`);
    return currentGameEvents;
};

export const getCurrentPositionEvents = (): readonly PositionEvent[] => getCurrentGameEvents()[positionIndex];

export const getCurrentGameIndex = (): GameIndex => gameIndex;
export const getCurrentPositionIndex = (): number => positionIndex;

export const goToPreviousPosition = (): boolean => {
    if (positionIndex === 0) {
        goToPreviousGame();
        positionIndex = getCurrentGameEvents().length - 1;
        return true;
    } else {
        --positionIndex;
        while (
            getCurrentPositionEvents().find((e) => e.kind === "meld" && (e.text === "ツモ" || e.text === "ロン")) !=
            null
        ) {
            --positionIndex;
        }
        return false;
    }
};

export const goToNextPosition = (): boolean => {
    if (positionIndex === getCurrentGameEvents().length - 1) {
        goToNextGame();
        return true;
    } else {
        ++positionIndex;
        return false;
    }
};

export const goToPreviousGame = (): void => {
    if (positionIndex > 0) {
        positionIndex = 0;
    } else {
        switch (gameIndex) {
            case 0:
                gameIndex = "pre";
                break;
            case "pre":
                gameIndex = "post";
                break;
            case "post":
                gameIndex = getNumGames() - 1;
                break;
            default:
                --gameIndex;
                break;
        }
        positionIndex = 0;
    }
};

export const goToNextGame = (): void => {
    positionIndex = 0;
    switch (gameIndex) {
        case getNumGames() - 1:
            gameIndex = "post";
            break;
        case "pre":
            gameIndex = 0;
            break;
        case "post":
            gameIndex = "pre";
            break;
        default:
            ++gameIndex;
            break;
    }
};

export const setPositionEvents = (mJson: MJson): void => {
    positionEvents = createPositionEvents(mJson);
};

export const resetPositionIndex = (): void => {
    gameIndex = "pre";
    positionIndex = 0;
};
