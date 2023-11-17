export const svgNS = "http://www.w3.org/2000/svg";

export const tileWidth = 580;
export const tileHeight = 830;
export const boardOneSize = tileWidth * 20;
export const regularTileY = boardOneSize / 2 - tileHeight / 2;
export const rotatedTileY = boardOneSize / 2 - tileWidth / 2;
export const discardsOffsetX = -2 * tileWidth - tileWidth / 2;
export const discardsOffsetY = 4 * tileWidth;
export const drawGapX = tileWidth / 10;
export const drawGapY = tileWidth + 20;
export const meldGapX = tileWidth / 2;

export const centerDisplayWidth = 6 * tileWidth;
export const centerDisplayHeight = 6 * tileWidth;
export const centerDisplayOffsetX = -centerDisplayWidth / 2;
export const centerDisplayOffsetY = -centerDisplayHeight / 2;
export const gameNumberTextOffsetX = 0;
export const gameNumberTextOffsetY = 0;
export const scoreTextOffsetX = 0;
export const scoreTextOffsetY = centerDisplayHeight / 2 - 20;
export const betsDisplayOffsetX = 0;
export const betsDisplayOffsetY = 0;
export const betsDisplayWidth = centerDisplayWidth;
export const betsDisplayHeight = betsDisplayWidth / 8; // 要調整

export const overlayTextOffsetX = 0;
export const overlayTextOffsetY = boardOneSize * 0.35;

export const gameResultScoreWidth = boardOneSize * 0.75;
export const gameResultScoreHeight = gameResultScoreWidth / 2;

export const positiveNumberColor = "#dc2626";
export const negativeNumberColor = "#2563eb";

// TODO
// centerDisplayWidth, centerDisplayHeightをもう少し大きく
// 伴ってcenterDisplayOffsetX, centerDisplayOffsetY, discardsOffsetYを変更
// drawGapXをもう少し大きく
// meldGapXをもう少し小さく
