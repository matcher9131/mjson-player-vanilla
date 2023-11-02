import { type TileStateTransition } from "../tileState/types";

type MeldEventKind = "チー" | "ポン" | "カン" | "リーチ" | "ツモ" | "ロン";

export type MeldEvent = {
    readonly kind: MeldEventKind;
    readonly player: number;
};

export type RiichiStickEvent = {
    readonly kind: "set" | "reset";
    readonly player: number;
};

export type PositionEvent = {
    readonly tileStateTransitions: readonly TileStateTransition[];
    readonly meldEvents: readonly MeldEvent[];
    readonly riichiStickEvents: readonly RiichiStickEvent[];
    readonly isBeginningGame: boolean;
};
