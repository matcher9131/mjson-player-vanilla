import { getMJsonIndex } from "@/models/mJsonIndex/states";
import { type MJsonIndexItem, type MJsonIndexNode } from "@/models/mJsonIndex/types";
import { getElementByIdOrThrowError } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";

const treeViewElementId = "match_select_tree_view";
const treeViewListContainerClassName = "match-select-list-container";
const treeViewItemLabelClassName = "match-select-tree-view-item-label";

const createTreeViewItemElement = (
    node: MJsonIndexNode,
    onItemSelected: (items: readonly MJsonIndexItem[]) => void,
): HTMLLIElement => {
    const container = document.createElement("li");
    container.classList.add(
        "list-none",
        "before:inline-block",
        "before:w-[0.8rem]",
        "before:h-[0.8rem]",
        "before:[mask-image:url('resources/arrows/left.svg')]",
        "before:[mask-repeat:no-repeat]",
        "before:[mask-position:center]",
        "before:bg-black",
        "before:scale-x-flip",
        "before:aria-expanded:rotate-90",
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
            const childElement = createTreeViewItemElement(childNode, onItemSelected);
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

            // SelectList関連
            onItemSelected(node.items);

            // TreeViewの親のMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
    }

    return container;
};

export const createTreeView = async (
    onItemSelected: (items: readonly MJsonIndexItem[]) => void,
): Promise<HTMLDivElement> => {
    const container = document.createElement("div");
    container.classList.add("overflow-auto", "w-full", "h-full", "bg-slate-100");

    const element = document.createElement("ul");
    element.setAttribute("id", treeViewElementId);
    const mJsonIndex = await getMJsonIndex();
    for (const node of mJsonIndex.children) {
        const childElement = createTreeViewItemElement(node, onItemSelected);
        element.appendChild(childElement);
    }

    container.appendChild(element);
    return container;
};
