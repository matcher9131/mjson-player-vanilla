import { type YakuDoubles } from "../mJson/types/yakuDoubles";
import { type TileState } from "../tileState/types";

type PositionEventTileTransitionForward = {
    readonly kind: "tileTransitionForward";
    readonly tileId: number;
    readonly newState: TileState;
};

type PositionEventTileTransitionBackward = {
    readonly kind: "tileTransitionBackward";
    readonly tileId: number;
    readonly newState: TileState;
};

export type PositionEventMeld = {
    readonly kind: "meld";
    readonly sideIndex: number;
    readonly text: "チー" | "ポン" | "カン" | "リーチ" | "ツモ" | "ロン";
};

type PositionEventRiichiStick = {
    readonly kind: "riichiStick";
    readonly sideIndex: number;
    readonly isSet: boolean;
};

type PositionEventDora = {
    readonly kind: "dora";
    readonly rightIndex: number;
};

type PositionEventGameResultBase = {
    readonly players: ReadonlyArray<{ readonly name: string; readonly increment: number; readonly newScore: number }>;
};

type PositionEventGameResultWin = PositionEventGameResultBase & {
    readonly kind: "gameResultWin";
    readonly handTileStates: ReadonlyMap<number, TileState>;
    readonly yakuList: readonly YakuDoubles[];
};

type PositionEventGameResultDraw = PositionEventGameResultBase & {
    readonly kind: "gameResultDraw";
};

export type PositionEventGameResult = PositionEventGameResultWin | PositionEventGameResultDraw;

type PositionEventBeginningMatch = {
    readonly kind: "beginningMatch";
    readonly players: readonly string[];
};

type PositionEventEndMatch = {
    readonly kind: "endMatch";
    readonly players: ReadonlyArray<{ readonly name: string; readonly score: number }>;
};

export type PositionEvent =
    | PositionEventTileTransitionForward
    | PositionEventTileTransitionBackward
    | PositionEventMeld
    | PositionEventRiichiStick
    | PositionEventDora
    | PositionEventGameResult
    | PositionEventBeginningMatch
    | PositionEventEndMatch;

export type GameIndex = number | "pre" | "post";

export type GamePositionEvents = ReadonlyArray<readonly PositionEvent[]>;
export type MatchPositionEvents = ReadonlyMap<GameIndex, GamePositionEvents>;

export const isPositionEventTransitionForward = (event: PositionEvent): event is PositionEventTileTransitionForward =>
    event.kind === "tileTransitionForward";

export const isPositionEventTransitionBackward = (event: PositionEvent): event is PositionEventTileTransitionBackward =>
    event.kind === "tileTransitionBackward";

export const isPositionEventMeld = (event: PositionEvent): event is PositionEventMeld => event.kind === "meld";

export const isPositionEventGameResult = (event: PositionEvent): event is PositionEventGameResult =>
    event.kind === "gameResultWin" || event.kind === "gameResultDraw";

export const isPositionEventDora = (event: PositionEvent): event is PositionEventDora => event.kind === "dora";
