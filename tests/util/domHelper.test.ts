import { describe, expect, test } from "vitest";
import { createCenterOriginSVG, createSVGTextElement } from "@/util/domHelper";

describe("domHelper", () => {
    describe("createSVGTextElement", () => {
        test("fill, text-anchor, dominant-baselineを指定しない", () => {
            const element = createSVGTextElement({
                text: "foo",
                x: 42,
                y: 123,
                fontSize: 24,
            });
            expect(element.tagName).toBe("text");
            expect(element.textContent).toBe("foo");
            expect(element.getAttribute("x")).toBe("42");
            expect(element.getAttribute("y")).toBe("123");
            expect(element.getAttribute("font-size")).toBe("24");
            expect(element.getAttribute("fill")).toBe("floralwhite");
            expect(element.getAttribute("text-anchor")).toBe("middle");
            expect(element.getAttribute("dominant-baseline")).toBe("central");
        });

        test("全てのプロパティを指定", () => {
            const element = createSVGTextElement({
                text: "foo",
                x: 42,
                y: 123,
                fontSize: 24,
                color: "black",
                textAnchor: "start",
                dominantBaseline: "hanging",
            });
            expect(element.tagName).toBe("text");
            expect(element.textContent).toBe("foo");
            expect(element.getAttribute("x")).toBe("42");
            expect(element.getAttribute("y")).toBe("123");
            expect(element.getAttribute("font-size")).toBe("24");
            expect(element.getAttribute("fill")).toBe("black");
            expect(element.getAttribute("text-anchor")).toBe("start");
            expect(element.getAttribute("dominant-baseline")).toBe("hanging");
        });
    });

    describe("createCenterOriginSVG", () => {
        test("通常", () => {
            const element = createCenterOriginSVG(500, 200);
            expect(element.getAttribute("width")).toBe("500");
            expect(element.getAttribute("height")).toBe("200");
            expect(element.getAttribute("viewBox")).toBe("-250 -100 500 200");
        });
    });
});
