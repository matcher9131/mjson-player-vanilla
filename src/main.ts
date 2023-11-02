import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import sampleMJson from "./data/sample1.json";
import "./index.css";
import { createPositionEvents } from "./states/positionEvent";
import { setTileAnimationAll, updateTileState } from "./states/tileState";
import { type MJson } from "./types/Mjson/mJson";
import { upperBound } from "./util/arrayExtensions";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

const positionEvents = createPositionEvents(sampleMJson as MJson);
const gameBeginningPositions = positionEvents.flatMap((e, i) => (e.isBeginningGame ? [i] : []));
let positionIndex = 0;
const handleGoToPreviousPosition = (): void => {
    positionIndex = (positionIndex - 1 + positionEvents.length) % positionEvents.length;
    setTileAnimationAll(false);
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "backward"),
    );
};
const handleGoToNextPosition = (): void => {
    positionIndex = (positionIndex + 1) % positionEvents.length;
    setTileAnimationAll(!gameBeginningPositions.includes(positionIndex));
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "forward"),
    );
};
const handleGoToPreviousGame = (): void => {
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
    setTileAnimationAll(false);
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "forward"),
    );
};
const handleGoToNextGame = (): void => {
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
    setTileAnimationAll(false);
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "forward"),
    );
};

const board = createBoard();
const controlPanel = createControlPanel({
    onGoToPreviousPosition: handleGoToPreviousPosition,
    onGoToNextPosition: handleGoToNextPosition,
    onGoToPreviousGame: handleGoToPreviousGame,
    onGoToNextGame: handleGoToNextGame,
});
root.append(board, controlPanel);
