import {
    discardsOffsetX,
    discardsOffsetY,
    drawGapX,
    drawGapY,
    meldGapX,
    regularTileY,
    rotatedTileY,
    tileHeight,
    tileWidth,
} from "../../const";
import { insertTo, removeFrom } from "../../util/arrayExtensions";
import { assertNonNull } from "../../util/error";
import { isGameResultWin } from "../mJson/types/gameResult";
import { type MJson } from "../mJson/types/mJson";
import { getDefaultTileState } from "../tileState/states";
import { type TileState } from "../tileState/types";
import { type PositionEvent, type GameIndex, type MatchPositionEvents, type GamePositionEvents } from "./types";

type Meld = {
    readonly tiles: ReadonlyArray<{
        readonly tileId: number;
        readonly isUnrevealed?: boolean;
    }>;
    readonly rotatedIndex?: number;
    addedTileId?: number;
};

type Side = {
    readonly unrevealed: number[];
    readonly melds: Meld[];
    readonly discards: number[];
    drawTile?: number; // ツモってから打牌するまでの間
    riichiIndex?: number;
};

const getUnrevealedWidth = (side: Side): number => {
    // unrevealed.length = 13 or 14 => 14 * tileWidth + drawGapX
    // unrevealed.length = 10 or 11 => 11 * tileWidth + drawGapX
    return (Math.floor((side.unrevealed.length + 2) / 3) * 3 - 1) * tileWidth + drawGapX;
};

const getMeldWidth = (meld: Meld): number => {
    return meld.tiles.length * tileWidth + (meld.rotatedIndex != null ? tileHeight - tileWidth : 0);
};

const getSideWidth = (side: Side): number => {
    const unrevealedWidth = getUnrevealedWidth(side);
    const meldsWidth = side.melds.reduce((sum, meld) => sum + meldGapX + getMeldWidth(meld), 0);
    return unrevealedWidth + meldsWidth;
};

const getDrawX = (side: Side): number => {
    return getUnrevealedWidth(side) - tileWidth / 2 - getSideWidth(side) / 2;
};

const isSameState = (state1: TileState, state2: TileState): boolean => {
    return (
        state1.x === state2.x &&
        state1.y === state2.y &&
        state1.sideIndex === state2.sideIndex &&
        state1.isRotated === state2.isRotated &&
        state1.isInvisible === state2.isInvisible
    );
};

// 'states'に捨て牌のTileStateを書き込む
const setDiscardsTilesState = (states: TileState[], side: Side, sideIndex: number): void => {
    const riichiRow = side.riichiIndex != null ? Math.min(2, Math.floor(side.riichiIndex / 6)) : -1;
    const riichiColumn = side.riichiIndex != null ? side.riichiIndex - 6 * riichiRow : -1;
    const adjustment = (i: number, j: number): number => {
        if (i === riichiRow) {
            if (j === riichiColumn) return tileHeight / 2 - tileWidth / 2;
            else if (j > riichiColumn) return tileHeight - tileWidth;
        }
        return 0;
    };
    for (let discardIndex = 0; discardIndex < side.discards.length; ++discardIndex) {
        const i = Math.min(2, Math.floor(discardIndex / 6));
        const j = discardIndex - 6 * i;
        states[side.discards[discardIndex]] = {
            x: discardsOffsetX + j * tileWidth + adjustment(i, j),
            y: discardsOffsetY + i * tileHeight,
            sideIndex,
            isRotated: discardIndex === side.riichiIndex,
        };
    }
};

const getAllTilesState = (sides: readonly Side[]): TileState[] => {
    const states = new Array(136).fill(0).map(() => getDefaultTileState());
    for (let sideIndex = 0; sideIndex < sides.length; ++sideIndex) {
        const side = sides[sideIndex];
        // 手牌（ツモ牌以外）
        const sideWidth = getSideWidth(side);
        for (let j = 0; j < side.unrevealed.length; ++j) {
            states[side.unrevealed[j]] = {
                x: j * tileWidth + tileWidth / 2 - sideWidth / 2,
                y: regularTileY,
                sideIndex,
            };
        }

        // ツモ牌
        const drawTile = side.drawTile;
        if (drawTile != null) {
            states[drawTile] = {
                x: getDrawX(side),
                y: regularTileY,
                sideIndex,
            };
        }

        // 捨て牌
        setDiscardsTilesState(states, side, sideIndex);

        // 鳴き牌
        let tileLeft = getUnrevealedWidth(side) + meldGapX - sideWidth / 2;
        for (let meldIndex = 0; meldIndex < side.melds.length; ++meldIndex) {
            const meld = side.melds[meldIndex];
            for (let j = 0; j < meld.tiles.length; ++j) {
                if (j === meld.rotatedIndex) {
                    states[meld.tiles[j].tileId] = {
                        x: tileLeft + tileHeight / 2,
                        y: rotatedTileY,
                        sideIndex,
                        isRotated: true,
                    };
                    if (meld.addedTileId != null) {
                        states[meld.addedTileId] = {
                            x: tileLeft + tileHeight / 2,
                            y: rotatedTileY - tileWidth,
                            sideIndex,
                        };
                    }
                    tileLeft += tileHeight;
                } else {
                    states[meld.tiles[j].tileId] = {
                        x: tileLeft + tileWidth / 2,
                        y: regularTileY,
                        sideIndex,
                    };
                    tileLeft += tileWidth;
                }
            }
            tileLeft += meldGapX;
        }
    }
    return states;
};

export const createPositionEvents = (mJson: MJson): MatchPositionEvents => {
    return new Map<GameIndex, GamePositionEvents>([
        ["pre", [[{ kind: "beginningMatch", players: mJson.players.map((player) => player.name) }]]],
        ...mJson.games.map((game, gameIndex) => {
            const sides = game.dealtTiles.map(
                (dealt): Side => ({
                    unrevealed: [...dealt],
                    melds: [],
                    discards: [],
                }),
            );

            // states[tileId]
            let prevStates: TileState[] = getAllTilesState(sides);
            let riichiStickShouldBeHandled: number | null = null;

            const events: PositionEvent[][] = [];
            let positionIndex = 0;
            for (const e of game.events) {
                events.push([]);
                ++positionIndex;
                if (riichiStickShouldBeHandled != null) {
                    events[positionIndex].push({
                        kind: "riichiStick",
                        sideIndex: riichiStickShouldBeHandled,
                        isSet: true,
                    });
                    events[positionIndex - 1].push({
                        kind: "riichiStick",
                        sideIndex: riichiStickShouldBeHandled,
                        isSet: false,
                    });
                    riichiStickShouldBeHandled = null;
                }
                const sideIndex = e.p;
                const side = sides[sideIndex];
                switch (e.k) {
                    case "t": // ツモ
                        {
                            const tileId = e.t;
                            side.drawTile = tileId;
                            // ツモるアニメーションのために一つ前の局面にツモ牌を仕込んでおく
                            const state: TileState = {
                                x: getDrawX(side),
                                y: regularTileY - drawGapY,
                                sideIndex,
                                isInvisible: true,
                            };
                            events[positionIndex - 1].push({
                                kind: "tileTransitionBackward",
                                tileId,
                                newState: { ...state },
                            });
                            prevStates[tileId] = state;
                        }
                        break;
                    case "d": // 捨て
                        {
                            const tileId = e.t;
                            if (side.drawTile != null) {
                                insertTo(side.unrevealed, side.drawTile);
                            }
                            removeFrom(side.unrevealed, tileId);
                            side.drawTile = undefined;
                            side.discards.push(e.t);
                            if (e.isRiichi ?? false) {
                                events[positionIndex].push({
                                    kind: "meld",
                                    sideIndex,
                                    text: "リーチ",
                                });
                                side.riichiIndex = side.discards.length - 1;
                                riichiStickShouldBeHandled = sideIndex;
                            }
                        }
                        break;
                    case "c": // チー
                        {
                            events[positionIndex].push({
                                kind: "meld",
                                sideIndex,
                                text: "チー",
                            });
                            for (const t of e.tiles) {
                                removeFrom(side.unrevealed, t);
                            }
                            const tiles = [e.t, ...e.tiles];
                            const rotatedIndex = 0;
                            side.melds.push({
                                tiles: tiles.map((t) => ({ tileId: t })),
                                rotatedIndex,
                            });
                            // 捨て牌から鳴かれた牌を消す
                            sides[(sideIndex + 3) % 4].discards.pop();
                        }
                        break;
                    case "p": // ポン
                        {
                            events[positionIndex].push({
                                kind: "meld",
                                sideIndex,
                                text: "ポン",
                            });
                            const sideFrom = sides.findIndex((s) => s.discards.includes(e.t));
                            if (sideFrom < 0) throw new Error(`Assertion: sideFrom >= 0, actual: ${sideFrom}`);
                            for (const t of e.tiles) {
                                removeFrom(side.unrevealed, t);
                            }
                            const tiles = [...e.tiles];
                            const rotatedIndex = ((): number => {
                                const relativeIndex = (sideFrom + 4 - sideIndex) % 4;
                                switch (relativeIndex) {
                                    case 1:
                                        return 2;
                                    case 2:
                                        return 1;
                                    case 3:
                                        return 0;
                                    default:
                                        throw new Error(
                                            `Assertion: relativeIndex === 1, 2, 3, actual: ${relativeIndex}`,
                                        );
                                }
                            })();
                            tiles.splice(rotatedIndex, 0, e.t);
                            side.melds.push({
                                tiles: tiles.map((t) => ({ tileId: t })),
                                rotatedIndex,
                            });
                            // 捨て牌から鳴かれた牌を消す
                            sides[sideFrom].discards.pop();
                        }
                        break;
                    case "a": // 暗槓
                        // eslint-disable-next-line no-lone-blocks
                        {
                            events[positionIndex].push({
                                kind: "meld",
                                sideIndex,
                                text: "カン",
                            });
                            assertNonNull(side.drawTile, "drawTile");
                            insertTo(side.unrevealed, side.drawTile);
                            side.drawTile = undefined;
                            for (const t of e.tiles) {
                                removeFrom(side.unrevealed, t);
                            }
                            side.melds.push({
                                tiles: e.tiles.map((tileId) => ({
                                    tileId,
                                    isUnrevealed: tileId % 4 === 1 || tileId % 4 === 2,
                                })),
                            });
                        }
                        break;
                    case "m": // 明槓
                        {
                            events[positionIndex].push({
                                kind: "meld",
                                sideIndex,
                                text: "カン",
                            });
                            const sideFrom = sides.findIndex((s) => s.discards.includes(e.t));
                            for (const t of e.tiles) {
                                removeFrom(side.unrevealed, t);
                            }
                            const tiles = [...e.tiles];
                            const rotatedIndex = ((): number => {
                                const relativeIndex = (sideFrom + 4 - sideIndex) % 4;
                                switch (relativeIndex) {
                                    case 1:
                                        return 3;
                                    case 2:
                                        return 1;
                                    case 3:
                                        return 0;
                                    default:
                                        throw new Error(
                                            `Assertion: relativeIndex == 1, 2, 3, actual: ${relativeIndex}`,
                                        );
                                }
                            })();
                            tiles.splice(rotatedIndex, 0, e.t);
                            side.melds.push({
                                tiles: tiles.map((t) => ({ tileId: t })),
                                rotatedIndex,
                            });
                            // 捨て牌から鳴かれた牌を消す
                            sides[sideFrom].discards.pop();
                        }
                        break;
                    case "k": // 加槓
                        {
                            events[positionIndex].push({
                                kind: "meld",
                                sideIndex,
                                text: "カン",
                            });
                            side.drawTile = undefined;
                            const meldIndex = side.melds.findIndex((meld) =>
                                meld.tiles.every((t) => t.tileId >> 2 === e.t >> 2),
                            );
                            if (meldIndex === -1) throw new Error("Assertion meldIndex >= 0, actual: -1");
                            side.melds[meldIndex].addedTileId = e.t;
                        }
                        break;
                }
                // 全ての牌の位置を記録
                const newStates = getAllTilesState(sides);
                for (let tileId = 0; tileId < 136; ++tileId) {
                    if (!isSameState(prevStates[tileId], newStates[tileId])) {
                        events[positionIndex].push({
                            kind: "tileTransitionForward",
                            tileId,
                            newState: { ...newStates[tileId] },
                        });
                        events[positionIndex - 1].push({
                            kind: "tileTransitionBackward",
                            tileId,
                            newState: { ...prevStates[tileId] },
                        });
                    }
                }
                prevStates = newStates;
            }
            // 和了（ツモ or ロン）
            const winMeld = game.gameResults.filter(isGameResultWin).map(
                (gameResultWin): PositionEvent => ({
                    kind: "meld",
                    sideIndex: gameResultWin.player,
                    text: gameResultWin.from != null ? "ロン" : "ツモ",
                }),
            );
            if (winMeld.length > 0) {
                events.push(winMeld);
            }
            // 点数表示
            events.push(...game.gameResults.map((gameResult): PositionEvent[] => [{ kind: "gameResult" }])); // NOT IMPLEMENTED
            return [gameIndex, events] as [GameIndex, GamePositionEvents];
        }),
        ["post", [[{ kind: "endMatch", players: mJson.players.map(({ name, score }) => ({ name, score })) }]]],
    ]);
};
