import { svgNS, tileWidth } from "@/const";
import { getYakuName } from "@/models/mJson/types/yaku";
import { type YakuDoubles } from "@/models/mJson/types/yakuDoubles";
import { createSVGTextElement } from "@/util/domHelper";

const yakuFontSize = 350;
const yakuSummaryFontSize = 500;

const yakuRowHeight = tileWidth * 1.25;
const yakuSummaryRowHeight = yakuRowHeight * 1.5;
const yakuColumnGap = tileWidth * 1;
const yakuColumnWidth = tileWidth * 4.5;
// |<-- yakuColumnWidth -->|<-- yakuColumnGap -->|<-- yakuColumnWidth -->|
export const yakuWidth = yakuColumnWidth * 2 + yakuColumnGap;

type CreateYakuElementOptions = {
    readonly yakuList: readonly YakuDoubles[];
    readonly isSelfDraw: boolean;
    readonly isDealer: boolean;
    readonly winScore: number;
    readonly points: number;
};
export const createYakuElement = ({
    yakuList,
    isSelfDraw,
    isDealer,
    winScore,
    points,
}: CreateYakuElementOptions): { readonly yakuElement: SVGSVGElement; readonly yakuHeight: number } => {
    // Origin: UpperLeft
    const yakuElement = document.createElementNS(svgNS, "svg");
    const yakuHeight = Math.ceil(yakuList.length / 2) * yakuRowHeight + yakuSummaryRowHeight;
    yakuElement.setAttribute("width", `${yakuWidth}`);
    yakuElement.setAttribute("height", `${yakuHeight}`);
    yakuElement.setAttribute("viewBox", `0 0 ${yakuWidth} ${yakuHeight}`);
    for (let i = 0; i < yakuList.length; ++i) {
        const yakuNameX = i % 2 === 0 ? 0 : yakuColumnWidth + yakuColumnGap;
        const y = (Math.floor(i / 2) + 0.5) * yakuRowHeight;
        const textYakuName = createSVGTextElement({
            text: getYakuName(yakuList[i].yakuId),
            x: yakuNameX,
            y,
            fontSize: yakuFontSize,
            textAnchor: "start",
            dominantBaseline: "central",
        });
        yakuElement.appendChild(textYakuName);
        if (yakuList[i].doubles < 13) {
            const yakuDoublesX = yakuNameX + yakuColumnWidth;
            const textYakuDoubles = createSVGTextElement({
                text: `${yakuList[i].doubles}飜`,
                x: yakuDoublesX,
                y,
                fontSize: yakuFontSize * 0.8,
                textAnchor: "end",
                dominantBaseline: "central",
            });
            yakuElement.appendChild(textYakuDoubles);
        }
    }
    const yakuSummaryText = (() => {
        if (yakuList.find(({ doubles }) => doubles === 13) != null) {
            const doublesText =
                yakuList.length === 1
                    ? "役満"
                    : yakuList.length === 2
                    ? "ダブル役満"
                    : yakuList.length === 3
                    ? "トリプル役満"
                    : `${yakuList.length}倍役満`;
            const scoreText = isSelfDraw
                ? isDealer
                    ? `${winScore / 3}点All`
                    : `${winScore / 4}-${winScore / 2}点`
                : `${winScore}点`;
            return `${doublesText} ${scoreText}`;
        } else {
            const sumDoubles = yakuList.reduce((sum, { doubles }) => sum + doubles, 0);
            const doublesText =
                sumDoubles >= 13
                    ? "役満"
                    : sumDoubles >= 11
                    ? "三倍満"
                    : sumDoubles >= 8
                    ? "倍満"
                    : sumDoubles >= 6
                    ? "跳満"
                    : winScore >= 8000 * (isDealer ? 1.5 : 1)
                    ? "満貫"
                    : `${points}符${sumDoubles}飜`;
            const scoreText = isSelfDraw
                ? isDealer
                    ? `${winScore / 3}点All`
                    : `${winScore / 4}-${winScore / 2}点`
                : `${winScore}点`;
            return `${doublesText} ${scoreText}`;
        }
    })();
    yakuElement.appendChild(
        createSVGTextElement({
            text: yakuSummaryText,
            x: yakuWidth / 2,
            y: (Math.ceil(yakuList.length / 2) + 0.5) * yakuRowHeight,
            fontSize: yakuSummaryFontSize,
        }),
    );

    return { yakuHeight, yakuElement };
};
