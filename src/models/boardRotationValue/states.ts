let boardRotationValue = 0;

export const getBoardRotateionValue = (): number => {
    return boardRotationValue;
};

export const increaseBoardRotationValue = (): void => {
    boardRotationValue = (boardRotationValue + 1) % 4;
};

export const decreaseBoardRotationValue = (): void => {
    boardRotationValue = (boardRotationValue + 3) % 4;
};

export const resetBoardRotationValue = (): void => {
    boardRotationValue = 0;
};
