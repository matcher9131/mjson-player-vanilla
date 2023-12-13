type EventItemBase = {
    readonly k: "t" | "d" | "c" | "p" | "a" | "m" | "k";
    readonly p: number;
};

export type EventDiscard = EventItemBase & {
    readonly k: "d";
    readonly t: number;
    readonly isRiichi?: boolean;
};

export type EventDraw = EventItemBase & {
    readonly k: "t";
    readonly t: number;
};

type EventMeldBase = EventItemBase & {
    readonly k: "c" | "p" | "a" | "m" | "k";
};

export type EventAdditionalKong = EventMeldBase & {
    readonly k: "k";
    readonly t: number;
};

export type EventChow = EventMeldBase & {
    readonly k: "c";
    readonly from: number;
    readonly t: number;
    readonly tiles: readonly number[];
};

export type EventConcealedKong = EventMeldBase & {
    readonly k: "a";
    readonly tiles: readonly number[];
};

export type EventOpenKong = EventMeldBase & {
    readonly k: "m";
    readonly from: number;
    readonly t: number;
    readonly tiles: readonly number[];
};

export type EventPung = EventMeldBase & {
    readonly k: "p";
    readonly from: number;
    readonly t: number;
    readonly tiles: readonly number[];
};

export type EventItem = EventMeld | EventDiscard | EventDraw;

export type EventMeld = EventAdditionalKong | EventChow | EventConcealedKong | EventOpenKong | EventPung;
