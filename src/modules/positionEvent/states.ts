import { createPositionEvents } from "./initializer";
import { type GameIndex, type PositionEvent } from "./types";
import { getMJson } from "../mJson/states";
import { assertNonNull } from "../../util/error";

const positionEvents = createPositionEvents(getMJson());
const numGames = [...positionEvents.keys()].filter((gameIndex) => gameIndex !== "pre" && gameIndex !== "post").length;
let gameIndex: GameIndex = "pre";
let positionIndex: number = 0;

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
        return true;
    } else {
        --positionIndex;
        return false;
    }
    // TODO: ツモ、ロンのPositionEventになるときはさらにもう一つ前に戻す
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
                gameIndex = numGames - 1;
                break;
            default:
                --gameIndex;
                break;
        }
        positionIndex = 0;
    }
};

export const goToNextGame = (): void => {
    switch (gameIndex) {
        case numGames - 1:
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
