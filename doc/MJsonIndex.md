# MJsonIndexファイルの構造

MJsonIndexファイルはアプリ内の牌譜選択ウィンドウを利用するために必要となるファイルです。

内容は木構造で、以下のようなノードを持ちます。

<!-- TODO: ここに木構造の図 -->

いずれのノードもプロパティ`label`を共通で持ち、これが牌譜選択ウィンドウに表示されます。

## MJsonIndexChildNode

```ts
type MJsonIndexChildNode = {
    label: string;
    item: MJsonIndexItem[];
};
```

- `label`プロパティの内容が牌譜選択ウィンドウ左側のツリービューに表示されます。
- `item`プロパティには[MJsonIndexItem](#mjsonindexitem)の配列を指定します。この内容が牌譜選択ウィンドウ右側の選択リストに表示されます。

## MJsonIndexItem

```ts
type MJsonIndexItem = {
    id: string;
    label: string;
};
```

- `id`プロパティは読み込むMJsonファイル名（拡張子無し）を指定します。
- `label`プロパティの内容が牌譜選択ウィンドウ右側の選択リストに表示されます。

## MJsonIndexParentNode

```ts
type MJsonIndexParentNode = {
    label: string;
    children: (MJsonIndexParentNode | MJsonIndexChildNode)[];
};
```

- `label`プロパティの内容が牌譜選択ウィンドウ左側のツリービューに表示されます。
- `children`プロパティには子となるノードからなる配列を指定します。
    - 配列の内容には[MJsonIndexParentNode](#mjsonindexparentnode)と[MJsonIndexChildNode](#mjsonindexchildnode)を含めることができます。

## MJsonIndexRootNode

```ts
type MJsonIndexRootNode = {
    label: "root";
    children: (MJsonIndexParentNode | MJsonIndexChildNode)[];
};
```

ルートに指定するノードです。基本的には[MJsonIndexParentNode](#mjsonindexparentnode)と同じですが、`label`プロパティには`"root"`を指定します。
