export const svgNS = "http://www.w3.org/2000/svg";

export const tileWidth = 580;
export const tileHeight = 830;
export const boardOneSize = tileWidth * 21;
export const regularTileY = boardOneSize / 2 - tileHeight / 2;
export const rotatedTileY = boardOneSize / 2 - tileWidth / 2;
export const discardsOffsetX = -2 * tileWidth - tileWidth / 2;
export const discardsOffsetY = 4.5 * tileWidth;
export const drawGapX = tileWidth / 5;
export const drawGapY = tileWidth + 20;
export const meldGapX = tileWidth / 3;

export const centerDisplayWidth = 6 * tileWidth;
export const centerDisplayHeight = 6 * tileWidth;
export const centerDisplayOffsetX = -centerDisplayWidth / 2;
export const centerDisplayOffsetY = -centerDisplayHeight / 2;
export const gameNumberTextOffsetX = 0;
export const gameNumberTextOffsetY = -tileWidth * 1.25;
export const scoreTextOffsetX = 0;
export const scoreTextOffsetY = centerDisplayHeight / 2 - 20;
export const betsDisplayOffsetX = 0;
export const betsDisplayOffsetY = 0;
export const betsDisplayWidth = centerDisplayWidth;
export const betsDisplayHeight = betsDisplayWidth / 8; // 要調整
export const doraDisplayScale = 0.8;
export const doraDisplayOffsetX = -tileWidth * 2.5 * doraDisplayScale;
export const doraDisplayOffsetY = tileWidth * 0.5;
export const riichiStickHeight = 180;
export const riichiStickOffsetX = 0;
export const riichiStickOffsetY = tileWidth * 3.5 - riichiStickHeight / 2;
export const windDisplayOffsetX = centerDisplayWidth / 2 - 300;
export const windDisplayOffsetY = centerDisplayHeight / 2 - 300;
export const playerNameDisplayOffsetX = 0;
export const playerNameDisplayOffsetY = regularTileY - tileWidth * 1.25;

export const overlayTextOffsetX = 0;
export const overlayTextOffsetY = boardOneSize * 0.35;

export const gameResultScoreWidth = boardOneSize * 0.75;
export const gameResultScoreHeight = boardOneSize * 0.3;

export const defaultTextColor = "floralwhite";
export const positiveNumberColor = "#dc2626";
export const negativeNumberColor = "#2563eb";

export const defaultTextColorClassName = "text-[#fffaf0]";
export const positiveNumberColorClassName = "text-[#dc2626]";
export const negativeNumberColorClassName = "text-[#2563eb]";
