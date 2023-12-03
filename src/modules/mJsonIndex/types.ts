type MJsonIndexItem = {
    readonly id: string;
    readonly label: string;
};
type MJsonIndexBase = {
    readonly label: string;
};
type MJsonIndexParentNode = MJsonIndexBase & {
    readonly children: readonly MJsonIndexNode[];
};
type MJsonIndexChildNode = MJsonIndexBase & {
    readonly items: readonly MJsonIndexItem[];
};

export type MJsonIndexNode = MJsonIndexParentNode | MJsonIndexChildNode;

export type MJsonIndex = MJsonIndexParentNode & {
    readonly label: "root";
};
