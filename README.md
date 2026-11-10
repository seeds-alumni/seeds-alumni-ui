# @seeds-alumni/ui

SEEDS同窓会のサービスで共通に使う UI です。会員ポータル・会員管理システム（[seeds-alumni-idaas](https://github.com/seeds-alumni/seeds-alumni-idaas)）・SEEDS TOTP などで、同じ見た目と同じ画面の型を使えるようにします。

- **トークンと CSS**（`css/`）：色・余白・角丸などの値と、素の HTML でも使えるクラス
- **React の骨組みの部品**（`src/` → `dist/`）：画面の枠・カード・一覧・詳細・ダッシュボード・フォームの1項目・ダイアログ
- **素の HTML 向けのスクリプト**（`js/theme.js`）：ライト・ダークの切り替え
- **ルールの確認**（`bin/seeds-ui-check.mjs`）：インライン style・色の直書き・存在しないクラスなどを CI で検出する

細かい部品をたくさん持つデザインシステムにはせず、**画面の骨組みに絞って**います（保守を続けられる範囲にするため）。値の決め方は freee の [vibes](https://github.com/freee/vibes)（Apache-2.0）にならい、ブランド色の深緑を当てはめています。

## 見本

- Storybook・デモ：`https://ui.seeds-alumni.jp/`（公開の設定は [docs/deploy.md](docs/deploy.md)）
- ローカル：`npm run storybook`（http://localhost:6006）、`npm run dev:demo`

## ドキュメント

| 文書 | 内容 |
|---|---|
| [docs/usage.md](docs/usage.md) | 導入のしかた（React のアプリ・素の HTML・CDN） |
| [docs/catalog.md](docs/catalog.md) | 原則・トークン・クラス・React の部品と画面の型・ルール（**画面を作るときはまずここ**） |
| [docs/deploy.md](docs/deploy.md) | 公開（Cloudflare Pages）と版の出し方 |
| [docs/dependencies.md](docs/dependencies.md) | 依存ライブラリの更新（Dependabot）の対応 |

## 開発

```bash
npm install
npm run storybook   # 見本を見ながら直す
npm run check       # ルールの確認（カタログとの食い違いも）
npm run typecheck
npm run build       # dist/ を書き出す（Git に入れる）
npm run build:site  # 公開するサイトを site/ に作る
```

ロゴ（`seeds-logo.svg` など）は提供元の決まりがあるので、このリポジトリには入れていません。各アプリの側に置いてください。

## ライセンス

[MIT License](LICENSE)（© 2026 大阪大学SEEDSプログラム同窓会）。

- 値の決め方は freee の [vibes](https://github.com/freee/vibes)（Apache-2.0）を参考にしていますが、vibes のコードは含んでいません
- ロゴなど同窓会の商標・ブランドの素材は、このライセンスの対象外です（このリポジトリにも入れていません）
