import { type MJsonIndexItem } from "@/models/mJsonIndex/types";
import { setSelectedMatchId } from "@/models/selectedMatchId/states";
import { getElementByIdOrThrowError } from "@/util/domHelper";

const listElementId = "match_select_list";
const listItemElementClassName = "match-select-list-item";

export const createSelectList = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.setAttribute("id", listElementId);
    container.classList.add(
        "overflow-auto",
        "w-full",
        "h-full",
        "bg-slate-100",
        "flex",
        "flex-col",
        "justify-items-stretch",
    );
    return container;
};

export const removeAllSelectListItems = (): void => {
    const listElement = getElementByIdOrThrowError(listElementId);
    while (listElement.firstChild != null) {
        listElement.removeChild(listElement.firstChild);
    }
};

export const setSelectListItems = (items: readonly MJsonIndexItem[], onItemClicked: () => void): void => {
    const listElement = getElementByIdOrThrowError(listElementId);
    for (const item of items) {
        const itemElement = document.createElement("div");
        itemElement.textContent = item.label;
        itemElement.classList.add(listItemElementClassName);
        itemElement.onclick = (e) => {
            setSelectedMatchId(item.id);
            onItemClicked();
            for (const listItem of document.getElementsByClassName(listItemElementClassName)) {
                listItem.ariaSelected = `${listItem === e.target}`;
            }
        };
        itemElement.classList.add("aria-selected:bg-blue-500", "aria-selected:text-floralwhite", "select-none");
        listElement.appendChild(itemElement);
    }
};
