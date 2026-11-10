# CLAUDE.md — seeds-alumni-ui

SEEDS同窓会の共通 UI（トークン・CSS・React の骨組みの部品・素の HTML 向けのスクリプト）。**画面を作る・直すときは `docs/catalog.md` が正**。

## 決めごと

- ユーザーとは日本語でやりとりする。画面の文言も日本語
- **作り込みすぎない**：共通にするのはトークンと CSS、画面の骨組みの React の部品、小さな共通処理だけ。細かい見た目の React の部品は作らず、クラスで組む。1つのアプリだけで使う見た目は、そのアプリの側に置く
- **依存を小さく**：実行時の依存は React（peerDependencies）だけ。UI ライブラリ・CSS-in-JS・Tailwind は入れない。Storybook などは devDependencies
- 値の決め方は freee の vibes にならい、ブランド色は深緑（seeds-alumni-idaas の CLAUDE.md の経緯を参照）
- 色の値は `css/tokens.css` にだけ書く。インライン style は書かない（Storybook の見本も同じ）。`npm run check` が確かめる
- クラス・トークン・部品を足したら `docs/catalog.md` に書き、`stories/` に見本を足す
- `dist/` は Git に入れる（Git の依存として、ビルドせずに使えるように）。`src/` を変えたら `npm run build` して一緒にコミットする。CI が食い違いを検出する
- 版は `package.json` の `version` とタグ（`v1.2.3`）。クラスの削除・意味の変更は大きい版（`docs/deploy.md`）
- ロゴはこのリポジトリに入れない（提供元の決まり。各アプリに置く）
- 公開先は Cloudflare Pages（Storybook・デモ・`/v1/` の CDN）。`npm run build:site` で `site/` に作る

## 使っているところ

- seeds-alumni-idaas（React。`github:seeds-alumni/seeds-alumni-ui#vX.Y.Z`）
- seeds-alumni-totp-site（素の HTML。いまは CSS のコピー。CDN への切り替えは今後）
