import { getElementByIdOrThrowError } from "@/util/domHelper";
import { assertNonNull } from "@/util/error";

const matchSelectWindowContainerId = "match_select_container";
const treeViewElementId = "match_select_tree_view";
const listElementId = "match_select_list";
const listItemElementClassName = "match-select-list-item";
const okButtonId = "match_select_ok_button";

let selectedMatchId: string | null = null;
const setSelectedMatchId = (newValue: string | null): void => {
    selectedMatchId = newValue;
    const okButtonElement = getElementByIdOrThrowError(okButtonId);
    (okButtonElement as HTMLButtonElement).disabled = selectedMatchId == null;
};

// temporary
type TreeViewNodeBase = {
    readonly label: string;
};
type TreeViewParentNode = TreeViewNodeBase & {
    readonly children: readonly TreeViewNode[];
};
type TreeViewChildNode = TreeViewNodeBase & {
    readonly items: ReadonlyArray<{
        readonly id: string;
        readonly label: string;
    }>;
};
type TreeViewNode = TreeViewParentNode | TreeViewChildNode;
const mJsonTreeData: TreeViewNode = {
    label: "root",
    children: [
        {
            label: "2023年",
            children: [
                {
                    label: "10月",
                    children: [
                        {
                            label: "21日",
                            items: [{ id: "20041201", label: "01" }],
                        },
                        {
                            label: "31日",
                            items: [],
                        },
                    ],
                },
                {
                    label: "11月",
                    children: [
                        {
                            label: "3日",
                            items: [],
                        },
                        {
                            label: "4日",
                            items: [],
                        },
                        {
                            label: "5日",
                            items: [],
                        },
                        {
                            label: "6日",
                            items: [],
                        },
                        {
                            label: "7日",
                            items: [],
                        },
                        {
                            label: "8日",
                            items: [],
                        },
                        {
                            label: "9日",
                            items: [],
                        },
                        {
                            label: "10日",
                            items: [],
                        },
                        {
                            label: "11日",
                            items: [],
                        },
                        {
                            label: "12日",
                            items: [],
                        },
                    ],
                },
            ],
        },
    ],
};
// end temporary

const createTreeViewItemElement = (node: TreeViewNode): HTMLLIElement => {
    const container = document.createElement("li");
    container.classList.add(
        "list-none",
        "before:inline-block",
        "before:w-[0.8em]",
        "before:h-[0.8em]",
        "before:bg-[url('/arrows/black_right.svg')]",
        "before:aria-expanded:bg-[url('/arrows/black_down.svg')]",
        "before:bg-no-repeat",
        "before:bg-contain",
        "before:bg-center",
        "before:mx-1",
    );

    const labelElement = document.createElement("span");
    labelElement.textContent = node.label;
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
            for (const child of target.children) {
                if (child.tagName === "UL") {
                    child.ariaHidden = `${!newIsOpen}`;
                } else if (child.tagName === "SPAN") {
                    child.ariaExpanded = `${newIsOpen}`;
                }
            }
            // 親のMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
        // 子ul
        const childContainer = document.createElement("ul");
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
            const targetLabel = target.querySelector("span");
            assertNonNull(targetLabel, "targetChild");
            // この要素以外の選択を解除する
            const treeViewRoot = getElementByIdOrThrowError(treeViewElementId);
            for (const childLabel of treeViewRoot.getElementsByTagName("span")) {
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

const createTreeView = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("overflow-y-auto", "w-full", "h-full", "bg-slate-100");

    const element = document.createElement("ul");
    element.setAttribute("id", treeViewElementId);
    for (const node of mJsonTreeData.children) {
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
        "overflow-y-auto",
        "w-full",
        "h-full",
        "bg-slate-100",
        "flex",
        "flex-col",
        "justify-items-stretch",
    );
    return container;
};

export const createMatchSelectWindow = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.setAttribute("id", matchSelectWindowContainerId);
    container.classList.add(
        "absolute",
        "w-full",
        "h-full",
        "z-50",
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
    container.classList.add("hidden");

    const root = document.createElement("div");
    root.classList.add(
        "w-1/2",
        "h-1/2",
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

    const treeViewElement = createTreeView();
    const selectListElement = createSelectList();
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", okButtonId);
    buttonElement.textContent = "読み込み";
    buttonElement.onclick = (e) => {
        // MJson読み込みをここに
        setMatchSelectWindowVisibility(false);
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
        "my-2",
        "col-span-2",
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
        // setSelectedMatchId(null);
        container.classList.remove("hidden");
    } else {
        container.classList.add("hidden");
    }
};
