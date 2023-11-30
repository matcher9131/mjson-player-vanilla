import { getElementByIdOrThrowError } from "@/util/domHelper";

const matchSelectWindowContainerId = "match_select_container";
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
                    ],
                },
            ],
        },
    ],
};
// end temporary

const createTreeViewItemElement = (node: TreeViewNode): HTMLLIElement => {
    const container = document.createElement("li");
    container.classList.add("list-none");

    const labelElement = document.createElement("div");
    labelElement.textContent = node.label;
    labelElement.classList.add(
        "aria-selected:bg-blue-500",
        "aria-selected:text-[#fffaf0]",
        "hover:bg-blue-300",
        "hover:text-[#fffaf0]",
    );
    container.appendChild(labelElement);

    if ("children" in node) {
        container.onclick = (e) => {
            const root = e.currentTarget as HTMLLIElement;
            // 子要素のみを見る（孫要素を見たくない）のでgetElementsByTagNameは使わない
            for (const child of root.children) {
                if (child.tagName !== "UL") continue;
                const isOpen = child.ariaExpanded === "true";
                child.ariaExpanded = `${!isOpen}`;
            }
            // 親コンテナのMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
        // 子ul
        const childContainer = document.createElement("ul");
        for (const childNode of node.children) {
            const childElement = createTreeViewItemElement(childNode);
            childContainer.appendChild(childElement);
        }
        // 初期状態
        childContainer.ariaExpanded = "false";
        childContainer.classList.add("hidden", "aria-expanded:block");
        container.appendChild(childContainer);
    } else {
        container.onclick = (e) => {
            // リストで選択中のIDをリセット
            setSelectedMatchId(null);

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
                        // listItem.setAttribute("aria-selected", listItem === e.target ? "true" : "false");
                    }
                };
                itemElement.classList.add("aria-selected:bg-blue-500", "aria-selected:text-[#fffaf0]");
                listElement.appendChild(itemElement);
            }

            // 親コンテナのMouseClickが処理されてしまうので伝播を止める
            e.stopPropagation();
        };
    }

    return container;
};

const createTreeView = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("overflow-y-scroll", "w-full", "h-full"); // w要調整

    const element = document.createElement("ul");
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
    container.classList.add("overflow-y-scroll", "w-full", "h-full", "flex", "flex-col", "justify-items-stretch"); // w要調整
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
