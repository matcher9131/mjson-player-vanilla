import { updateGameResultScoreElement } from "@/components/boardContainer/board/gameResultDisplay/scoreElement";
import { rotateRotationBoard } from "@/components/boardContainer/board/rotationBoard/rotationBoard";
import { setTileAnimationAll } from "@/components/boardContainer/board/rotationBoard/tile";
import { updatePlayerMatchResults } from "@/components/boardContainer/closingDisplay";
import { updateOpeningDisplayContent } from "@/components/boardContainer/openingDisplay";
import {
    decreaseBoardRotationValue,
    getBoardRotateionValue,
    increaseBoardRotationValue,
    resetBoardRotationValue,
} from "@/models/boardRotationValue/states";
import { getMJson } from "@/models/mJson/states";

const handleRotateBoard = (): void => {
    const boardRotationValue = getBoardRotateionValue();
    setTileAnimationAll(false); // Tileアニメーションを切っておく
    rotateRotationBoard(boardRotationValue);
    updateOpeningDisplayContent(getMJson().players.map(({ name }) => name));
    updatePlayerMatchResults(getMJson().players);
    updateGameResultScoreElement();
};

export const handleRotateClockwise = (): void => {
    decreaseBoardRotationValue();
    handleRotateBoard();
};

export const handleRotateCounterClockwise = (): void => {
    increaseBoardRotationValue();
    handleRotateBoard();
};

export const handleResetBoardRotation = (): void => {
    resetBoardRotationValue();
    handleRotateBoard();
};
