import { createPositionEvents } from "./initializer";
import { type MatchPositionEvents, type GameIndex, type PositionEvent, type GamePositionEvents } from "./types";
import { assertNonNull } from "@/util/error";
import { type MJson } from "../mJson/types/mJson";

let positionEvents: MatchPositionEvents = new Map();
let gameIndex: GameIndex = "pre";
let positionIndex: number = 0;

const getNumGames = (): number =>
    [...positionEvents.keys()].filter((gameIndex) => gameIndex !== "pre" && gameIndex !== "post").length;

const getCurrentGameEvents = (): ReadonlyArray<readonly PositionEvent[]> => {
    const currentGameEvents = positionEvents.get(gameIndex);
    assertNonNull(currentGameEvents, `positionEvents[${gameIndex}]`);
    return currentGameEvents;
};

export const getCurrentPositionEvents = (): readonly PositionEvent[] => getCurrentGameEvents()[positionIndex];

export const getCurrentGameIndex = (): GameIndex => gameIndex;
export const getCurrentPositionIndex = (): number => positionIndex;

export const goToPreviousPosition = (): boolean => {
    if (positionIndex === 0) {
        goToPreviousGame();
        positionIndex = getCurrentGameEvents().length - 1;
        return true;
    } else {
        --positionIndex;
        while (
            getCurrentPositionEvents().find((e) => e.kind === "meld" && (e.text === "ツモ" || e.text === "ロン")) !=
            null
        ) {
            --positionIndex;
        }
        return false;
    }
};

export const goToNextPosition = (): boolean => {
    if (positionIndex === getCurrentGameEvents().length - 1) {
        goToNextGame();
        return true;
    } else {
        ++positionIndex;
        return false;
    }
};

export const goToPreviousGame = (): void => {
    if (positionIndex > 0) {
        positionIndex = 0;
    } else {
        switch (gameIndex) {
            case 0:
                gameIndex = "pre";
                break;
            case "pre":
                gameIndex = "post";
                break;
            case "post":
                gameIndex = getNumGames() - 1;
                break;
            default:
                --gameIndex;
                break;
        }
        positionIndex = 0;
    }
};

export const goToNextGame = (): void => {
    positionIndex = 0;
    switch (gameIndex) {
        case getNumGames() - 1:
            gameIndex = "post";
            break;
        case "pre":
            gameIndex = 0;
            break;
        case "post":
            gameIndex = "pre";
            break;
        default:
            ++gameIndex;
            break;
    }
};

export const setPositionEvents = (mJson: MJson | null): void => {
    positionEvents = createPositionEvents(mJson);
};

export const resetPositionIndex = (): void => {
    gameIndex = "pre";
    positionIndex = 0;
};

// In-source testing
if (import.meta.vitest != null) {
    const { afterAll, beforeEach, describe, test, expect } = import.meta.vitest;

    const resetAllStates = (): void => {
        positionEvents = new Map();
        gameIndex = "pre";
        positionIndex = 0;
    };

    const positionEventsPre0: PositionEvent[] = [
        {
            kind: "score",
            sideIndex: 1,
            newScore: 1000,
        },
        {
            kind: "score",
            sideIndex: 2,
            newScore: 2000,
        },
    ];
    const positionEvents00: PositionEvent[] = [
        {
            kind: "meld",
            sideIndex: 0,
            text: "チー",
        },
    ];
    const positionEvents01: PositionEvent[] = [
        {
            kind: "meld",
            sideIndex: 1,
            text: "ポン",
        },
    ];
    const positionEvents02: PositionEvent[] = [
        {
            kind: "meld",
            sideIndex: 1,
            text: "ロン",
        },
        {
            kind: "meld",
            sideIndex: 2,
            text: "ロン",
        },
        {
            kind: "meld",
            sideIndex: 3,
            text: "ロン",
        },
    ];
    const positionEvents03: PositionEvent[] = [
        {
            kind: "gameResultDraw",
            drawKind: "三家和",
            players: [],
        },
    ];
    const positionEvents10: PositionEvent[] = [
        {
            kind: "riichiStick",
            sideIndex: 2,
            isSet: true,
        },
    ];
    const positionEvents11: PositionEvent[] = [
        {
            kind: "gameResultDraw",
            drawKind: "荒牌平局",
            players: [],
        },
    ];
    const positionEventsPost0: PositionEvent[] = [
        {
            kind: "score",
            sideIndex: 3,
            newScore: 3000,
        },
    ];

    const setDummyPositionEvents = (): void => {
        positionEvents = new Map<GameIndex, GamePositionEvents>([
            ["pre", [[...positionEventsPre0]]],
            [0, [[...positionEvents00], [...positionEvents01], [...positionEvents02], [...positionEvents03]]],
            [1, [[...positionEvents10], [...positionEvents11]]],
            ["post", [[...positionEventsPost0]]],
        ]);
    };

    describe("positionEvent", () => {
        describe("getCurrentPositionEventsが", () => {
            beforeEach(resetAllStates);

            test("指定されたPositionEventの配列を返す", () => {
                setDummyPositionEvents();

                gameIndex = "pre";
                positionIndex = 0;
                expect(getCurrentPositionEvents()).toStrictEqual(positionEventsPre0);

                gameIndex = 0;
                positionIndex = 0;
                expect(getCurrentPositionEvents()).toStrictEqual(positionEvents00);

                gameIndex = 0;
                positionIndex = 1;
                expect(getCurrentPositionEvents()).toStrictEqual(positionEvents01);

                gameIndex = "post";
                positionIndex = 0;
                expect(getCurrentPositionEvents()).toStrictEqual(positionEventsPost0);
            });

            afterAll(resetAllStates);
        });

        describe("getCurrentGameIndexが", () => {
            beforeEach(resetAllStates);

            test("正しいgameIndexを返す", () => {
                gameIndex = "post";
                expect(getCurrentGameIndex()).toBe("post");

                gameIndex = 1;
                expect(getCurrentGameIndex()).toBe(1);

                gameIndex = "pre";
                expect(getCurrentGameIndex()).toBe("pre");
            });

            afterAll(resetAllStates);
        });

        describe("getCurrentPositionIndexが", () => {
            beforeEach(resetAllStates);

            test("正しいpositionIndexを返す", () => {
                positionIndex = 3;
                expect(getCurrentPositionIndex()).toBe(3);

                positionIndex = 7;
                expect(getCurrentPositionIndex()).toBe(7);
            });

            afterAll(resetAllStates);
        });

        describe("goToPreviousPositionが", () => {
            beforeEach(resetAllStates);

            test("positionIndex > 0のときにpositionIndexを1減らす", () => {
                setDummyPositionEvents();

                gameIndex = 0;
                positionIndex = 2;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(1);

                gameIndex = 1;
                positionIndex = 1;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(0);
            });

            test("positionIndex > 0のときにpositionIndexを減らして「ツモ」「ロン」以外のpositionIndexにする", () => {
                setDummyPositionEvents();

                gameIndex = 0;
                positionIndex = 3;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(1);
            });

            test("positionIndex = 0のときにgameIndexを1つ前に戻し、positionIndexをその局の最後に設定する", () => {
                setDummyPositionEvents();

                gameIndex = "pre";
                positionIndex = 0;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe("post");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 0;
                positionIndex = 0;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe("pre");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 1;
                positionIndex = 0;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(3);

                gameIndex = "post";
                positionIndex = 0;
                goToPreviousPosition();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(1);
            });

            afterAll(resetAllStates);
        });

        describe("goToNextPositionが", () => {
            beforeEach(resetAllStates);

            test("positionIndexがその局の最後でないときにpositionIndexを1増やす", () => {
                setDummyPositionEvents();

                gameIndex = 0;
                positionIndex = 2;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(3);

                gameIndex = 1;
                positionIndex = 0;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(1);
            });

            test("positionIndexがその局の最後のときgameIndexを1つ後に進め、positionIndexを0にする", () => {
                setDummyPositionEvents();

                gameIndex = "pre";
                positionIndex = 0;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 0;
                positionIndex = 3;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 1;
                positionIndex = 1;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe("post");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = "post";
                positionIndex = 0;
                goToNextPosition();
                expect(getCurrentGameIndex()).toBe("pre");
                expect(getCurrentPositionIndex()).toBe(0);
            });

            afterAll(resetAllStates);
        });

        describe("goToPreviousGameが", () => {
            beforeEach(resetAllStates);

            test("positionIndex > 0のときgameIndexはそのままにpositionIndexを0にする", () => {
                setDummyPositionEvents();

                gameIndex = 0;
                positionIndex = 2;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 1;
                positionIndex = 1;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(0);
            });

            test("positionIndex = 0のときgameIndexを1つ前に戻し、positionIndexを0にする", () => {
                setDummyPositionEvents();

                gameIndex = "pre";
                positionIndex = 0;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe("post");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 0;
                positionIndex = 0;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe("pre");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 1;
                positionIndex = 0;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = "post";
                positionIndex = 0;
                goToPreviousGame();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(0);
            });

            afterAll(resetAllStates);
        });

        describe("goToNextGameが", () => {
            beforeEach(resetAllStates);

            test("gameIndexを1つ後に進め、positionIndexを0にする", () => {
                setDummyPositionEvents();

                gameIndex = "pre";
                positionIndex = 0;
                goToNextGame();
                expect(getCurrentGameIndex()).toBe(0);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 0;
                positionIndex = 2;
                goToNextGame();
                expect(getCurrentGameIndex()).toBe(1);
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = 1;
                positionIndex = 1;
                goToNextGame();
                expect(getCurrentGameIndex()).toBe("post");
                expect(getCurrentPositionIndex()).toBe(0);

                gameIndex = "post";
                positionIndex = 0;
                goToNextGame();
                expect(getCurrentGameIndex()).toBe("pre");
                expect(getCurrentPositionIndex()).toBe(0);
            });

            afterAll(resetAllStates);
        });

        describe("resetPositionIndexが", () => {
            test("gameIndexを'pre'に、positionIndexを0に設定する", () => {
                gameIndex = 1;
                positionIndex = 5;
                resetPositionIndex();
                expect(gameIndex).toBe("pre");
                expect(positionIndex).toBe(0);
            });
        });
    });
}
