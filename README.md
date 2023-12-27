<!-- Some icons from https://github.com/devicons/devicon -->
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5 logo" width="60" height="60"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3 logo" width="60" height="60">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript logo" width="60" height="60">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" alt="tailwindcss logo" width="60">
<img src="https://vitejs.dev/logo.svg" alt="Vite logo" width="60">
<img src="https://vitest.dev/logo.svg" alt="Vitest logo" width="60">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js logo" width="60">

# MJson Player

MJson形式の牌譜を盤面で再生するウェブアプリです。

# デプロイ例

<!-- TODO: ここにデプロイしたサイトのリンク -->

# 使用技術

| カテゴリ                   | 技術                                |
| -------------------------- | ----------------------------------- |
| フロントエンド             | HTML5, CSS, TypeScript, tailwindcss |
| バックエンド               | Firebase Hosting                    |
| ビルドツール               | Vite                                |
| テストフレームワーク       | Vitest                              |
| ローカルスクリプト実行環境 | Node.js                             |
| その他                     | ESLint, Prettier                    |

# MJsonとは

牌譜を表すファイルフォーマットで、JSONをベースとしています。詳しくは以下をご覧ください。

https://github.com/matcher9131/MJson

# デプロイ手順

## 1. MJsonファイルの用意

MJsonファイルを用意し、`public/data`ディレクトリ直下に配置します。

## 2. 目次ファイルの編集

目次ファイルを作成するために、ルートディレクトリで`npm run create-index`を実行します。

※ 目次ファイルとは`public/data/mjson_index.json`のことで、アプリ内の牌譜選択ウィンドウを利用するために必要になります。

※ 手動での編集も可能です。形式などに関しては[こちら](doc/MJsonIndex.md)をご覧ください。

## 3. ビルド

ルートディレクトリにて`npm run build`でビルドします。ビルド内容は`dist`ディレクトリ内に出力されます。

## 4. デプロイ

お好みのツールで`dist`ディレクトリ以下をデプロイします。
