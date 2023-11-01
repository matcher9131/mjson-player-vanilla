import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import sampleMJson from "./data/sample1.json";
import "./index.css";
import { createPositionEvents } from "./states/positionEvent";
import { setTileAnimationAll, updateTileState } from "./states/tileState";
import { type MJson } from "./types/Mjson/mJson";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

const positionEvents = createPositionEvents(sampleMJson as MJson);
let positionIndex = 0;
// TODO: 局開始positionがわかるようにする
const handleGoToPreviousPosition = (): void => {
    positionIndex = (positionIndex - 1 + positionEvents.length) % positionEvents.length;
    setTileAnimationAll(false);
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "backward"),
    );
};
const handleGoToNextPosition = (): void => {
    positionIndex = (positionIndex + 1) % positionEvents.length;
    setTileAnimationAll(true); // TODO: 局開始時はfalseにする
    updateTileState(
        positionEvents[positionIndex].tileStateTransitions.filter((transition) => transition.kind === "forward"),
    );
};
const handleGoToPreviousGame = (): void => {
    // NOT IMPLEMENTED
};
const handleGoToNextGame = (): void => {
    // NOT IMPLEMENTED
};

const board = createBoard();
const controlPanel = createControlPanel({
    onGoToPreviousPosition: handleGoToPreviousPosition,
    onGoToNextPosition: handleGoToNextPosition,
    onGoToPreviousGame: handleGoToPreviousGame,
    onGoToNextGame: handleGoToNextGame,
});
root.append(board, controlPanel);
