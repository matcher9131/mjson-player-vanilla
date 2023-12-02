import { svgNS } from "@/const";
import { type PositionEventRiichiStick } from "@/modules/positionEvent/types";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const showsRiichiStick = [false, false, false, false];
const riichiStickId = (sideIndex: number): string => `riichi_stick${sideIndex}`;

export const createRiichiStickDisplay = (sideIndex: number): SVGUseElement => {
    const element = document.createElementNS(svgNS, "use");
    element.setAttribute("id", riichiStickId(sideIndex));
    element.setAttribute("href", `resources/sticks.svg#thousand_point_stick`);
    // 初期状態
    element.setAttribute("opacity", "0");
    return element;
};

export const setShowsRiichiStick = ({ isSet, sideIndex }: Omit<PositionEventRiichiStick, "kind">): void => {
    const element = getElementByIdOrThrowError(riichiStickId(sideIndex));
    element.setAttribute("opacity", isSet ? "1" : "0");
    showsRiichiStick[sideIndex] = isSet;
};

export const resetRiichiStickAll = (): void => {
    for (let sideIndex = 0; sideIndex < 4; ++sideIndex) {
        setShowsRiichiStick({ isSet: false, sideIndex });
    }
};
