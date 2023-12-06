import { loadNewMJson } from "@/controllers/mJsonController";
import { getMJsonIndex } from "@/modules/mJsonIndex/states";
import { type MJsonIndexNode } from "@/modules/mJsonIndex/types";
import { getElementByIdOrThrowError } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";

const matchSelectWindowContainerId = "match_select_container";
const treeViewElementId = "match_select_tree_view";
const treeViewListContainerClassName = "match-select-list-container";
const treeViewItemLabelClassName = "match-select-tree-view-item-label";
const listElementId = "match_select_list";
const listItemElementClassName = "match-select-list-item";
const okButtonId = "match_select_ok_button";

let selectedMatchId: string | null = null;
const setSelectedMatchId = (newValue: string | null): void => {
    selectedMatchId = newValue;
    const okButtonElement = getElementByIdOrThrowError(okButtonId);
    (okButtonElement as HTMLButtonElement).disabled = selectedMatchId == null;
};

const createTreeViewItemElement = (node: MJsonIndexNode): HTMLLIElement => {
    const container = document.createElement("li");
    container.classList.add(
        "list-none",
        "before:inline-block",
        "before:w-[0.8rem]",
        "before:h-[0.8rem]",
        "before:bg-[url('/resources/arrows/black_right.svg')]",
        "before:aria-expanded:bg-[url('/resources/arrows/black_down.svg')]",
        "before:bg-no-repeat",
        "before:bg-contain",
        "before:bg-center",
        "before:mx-1",
    );

    const labelElement = document.createElement("span");
    labelElement.textContent = node.label;
    labelElement.classList.add(treeViewItemLabelClassName);
    labelElement.classList.add(
        "aria-selected:bg-blue-500",
        "aria-selected:text-floralwhite",
        "hover:bg-blue-300",
        "hover:text-floralwhite",
        "select-none",
    );
    container.appendChild(labelElement);

    if ("children" in node) {
        container.onclick = (e) => {
            const target = e.currentTarget as HTMLLIElement;
            const newIsOpen = target.ariaExpanded !== "true";
            target.ariaExpanded = `${newIsOpen}`;
            const childContainer = target.querySelector(`.${treeViewListContainerClassName}`);
            assertNonNull(childContainer, "childContainer");
            childContainer.ariaHidden = `${!newIsOpen}`;
            const labelElement = target.querySelector(`.${treeViewItemLabelClassName}`);
            assertNonNull(labelElement, "labelElement");
            labelElement.ariaExpanded = `${newIsOpen}`;

            // 親のMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
        // 子ul
        const childContainer = document.createElement("ul");
        childContainer.classList.add(treeViewListContainerClassName);
        for (const childNode of node.children) {
            const childElement = createTreeViewItemElement(childNode);
            childContainer.appendChild(childElement);
        }
        childContainer.classList.add("block", "aria-hidden:hidden", "pl-3");
        // 初期状態
        childContainer.ariaHidden = "true";
        container.appendChild(childContainer);
    } else {
        container.onclick = (e) => {
            const target = e.currentTarget as HTMLLIElement;
            const targetLabel = target.querySelector(`.${treeViewItemLabelClassName}`);
            assertNonNull(targetLabel, "targetChild");
            // この要素以外の選択を解除する
            const treeViewRoot = getElementByIdOrThrowError(treeViewElementId);
            for (const childLabel of treeViewRoot.getElementsByClassName(treeViewItemLabelClassName)) {
                if (childLabel === targetLabel) {
                    childLabel.ariaSelected = "true";
                } else if (childLabel.ariaSelected === "true") {
                    childLabel.ariaSelected = "false";
                }
            }

            // リストで選択中のIDをリセットする
            setSelectedMatchId(null);

            // リストを初期化してアイテムをセットする
            const listElement = getElementByIdOrThrowError(listElementId);
            while (listElement.firstChild != null) {
                listElement.removeChild(listElement.firstChild);
            }
            for (const item of node.items) {
                const itemElement = document.createElement("div");
                itemElement.textContent = item.label;
                itemElement.classList.add(listItemElementClassName);
                itemElement.onclick = (e) => {
                    setSelectedMatchId(item.id);
                    for (const listItem of document.getElementsByClassName(listItemElementClassName)) {
                        listItem.ariaSelected = `${listItem === e.target}`;
                    }
                };
                itemElement.classList.add("aria-selected:bg-blue-500", "aria-selected:text-floralwhite", "select-none");
                listElement.appendChild(itemElement);
            }

            // TreeViewの親のMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
    }

    return container;
};

const createTreeView = async (): Promise<HTMLDivElement> => {
    const container = document.createElement("div");
    container.classList.add("overflow-auto", "w-full", "h-full", "bg-slate-100");

    const element = document.createElement("ul");
    element.setAttribute("id", treeViewElementId);
    const mJsonIndex = await getMJsonIndex();
    for (const node of mJsonIndex.children) {
        const childElement = createTreeViewItemElement(node);
        element.appendChild(childElement);
    }

    container.appendChild(element);
    return container;
};

const createSelectList = (): HTMLDivElement => {
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

export const createMatchSelectWindow = async (): Promise<HTMLDivElement> => {
    const container = document.createElement("div");
    container.setAttribute("id", matchSelectWindowContainerId);
    container.classList.add(
        "absolute",
        "w-full",
        "h-full",
        "transition-opacity",
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
    container.style.zIndex = "-50";
    container.style.opacity = "0";

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

    const treeViewElement = await createTreeView();
    const selectListElement = createSelectList();
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", okButtonId);
    buttonElement.textContent = "読み込み";
    buttonElement.onclick = async () => {
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
        "enabled:hover:brightness-125",
        "disabled:brightness-75",
        "disabled:cursor-not-allowed",
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
        container.style.zIndex = "50";
        container.style.opacity = "1";
    } else {
        container.style.opacity = "0";
        setTimeout(() => {
            container.style.zIndex = "-50";
        }, 150);
    }
};
