import { type TileState } from "../tileState/types";

type PositionEventBase = {
    readonly kind:
        | "tileTransitionForward"
        | "tileTransitionBackward"
        | "meld"
        | "riichiStick"
        | "gameResult"
        | "beginningMatch"
        | "endMatch";
};

type PositionEventTileTransitionForward = PositionEventBase & {
    readonly kind: "tileTransitionForward";
    readonly tileId: number;
    readonly newState: TileState;
};

type PositionEventTileTransitionBackward = PositionEventBase & {
    readonly kind: "tileTransitionBackward";
    readonly tileId: number;
    readonly newState: TileState;
};

export type PositionEventMeld = PositionEventBase & {
    readonly kind: "meld";
    readonly sideIndex: number;
    readonly text: "チー" | "ポン" | "カン" | "リーチ" | "ツモ" | "ロン";
};

type PositionEventRiichiStick = PositionEventBase & {
    readonly kind: "riichiStick";
    readonly sideIndex: number;
    readonly isSet: boolean;
};

export type PositionEventGameResult = PositionEventBase & {
    readonly kind: "gameResult";
    readonly players: ReadonlyArray<{ readonly name: string; readonly increment: number; readonly newScore: number }>;
};

type PositionEventBeginningMatch = PositionEventBase & {
    readonly kind: "beginningMatch";
    readonly players: readonly string[];
};

type PositionEventEndMatch = PositionEventBase & {
    readonly kind: "endMatch";
    readonly players: ReadonlyArray<{ readonly name: string; readonly score: number }>;
};

export type PositionEvent =
    | PositionEventTileTransitionForward
    | PositionEventTileTransitionBackward
    | PositionEventMeld
    | PositionEventRiichiStick
    | PositionEventRiichiStick
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
    event.kind === "gameResult";
