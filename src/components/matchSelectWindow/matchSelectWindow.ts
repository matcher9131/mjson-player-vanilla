import { loadNewMJson } from "@/controllers/mJsonController";
import { getSelectedMatchId, setSelectedMatchId } from "@/models/selectedMatchId/states";
import { getElementByIdOrThrowError } from "@/util/domHelper";
import { createSelectList, removeAllSelectListItems, setSelectListItems } from "./selectList";
import { createTreeView } from "./treeView";
import { type MJsonIndexItem } from "@/models/mJsonIndex/types";

const matchSelectWindowContainerId = "match_select_container";
const okButtonId = "match_select_ok_button";

const updateOkButtonIsEnabled = (): void => {
    const okButtonElement = getElementByIdOrThrowError(okButtonId);
    (okButtonElement as HTMLButtonElement).disabled = getSelectedMatchId() == null;
};

const handleTreeViewItemSelected = (items: readonly MJsonIndexItem[]): void => {
    setSelectedMatchId(null);
    updateOkButtonIsEnabled();
    removeAllSelectListItems();
    setSelectListItems(items, updateOkButtonIsEnabled);
};

export const createMatchSelectWindow = async (): Promise<HTMLDivElement> => {
    const container = document.createElement("div");
    container.setAttribute("id", matchSelectWindowContainerId);
    container.classList.add(
        "absolute",
        "w-full",
        "h-full",
        "transition-opacity-visibility",
        "bg-white/50",
        "flex",
        "justify-center",
        "items-center",
    );
    container.onclick = (e) => {
        setMatchSelectWindowVisibility(false);
        e.stopPropagation();
    };
    // 初期状態
    container.style.opacity = "0";
    container.style.visibility = "hidden";

    const root = document.createElement("div");
    root.classList.add(
        "w-[max(50%,400px)]",
        "portrait:w-[max(50%,300px)]",
        "h-[max(50%,300px)]",
        "bg-white",
        "grid",
        "grid-cols-[1fr_2fr]",
        "grid-rows-[1fr_auto]",
        "justify-center",
        "gap-1",
        "p-1",
    ); // w,h,grid-cols要調整
    root.onclick = (e) => {
        e.stopPropagation();
    };

    const treeViewElement = await createTreeView(handleTreeViewItemSelected);
    const selectListElement = createSelectList();
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", okButtonId);
    buttonElement.textContent = "読み込み";
    buttonElement.onclick = async () => {
        const selectedMatchId = getSelectedMatchId();
        if (selectedMatchId == null) return;
        await loadNewMJson(selectedMatchId);
        setMatchSelectWindowVisibility(false);
        // クエリ引数を書き換える
        const url = new URL(window.location.toString());
        url.searchParams.set("id", selectedMatchId);
        history.pushState({}, "", url);
    };
    buttonElement.classList.add(
        "text-floralwhite",
        "bg-blue-500",
        "transition-transform",
        "enabled:hover:brightness-125",
        "disabled:brightness-75",
        "disabled:cursor-not-allowed",
        "active:scale-95",
        "rounded",
        "px-4",
        "py-2",
        "mx-auto",
        "my-1",
        "col-span-2",
        "select-none",
    );
    // 初期状態
    buttonElement.disabled = true;

    root.append(treeViewElement, selectListElement, buttonElement);
    container.appendChild(root);

    return container;
};

export const setMatchSelectWindowVisibility = (isVisible: boolean): void => {
    const container = getElementByIdOrThrowError(matchSelectWindowContainerId);
    if (isVisible) {
        container.style.visibility = "visible";
        container.style.opacity = "1";
    } else {
        container.style.opacity = "0";
        container.style.visibility = "hidden";
    }
};
