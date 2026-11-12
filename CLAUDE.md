# CLAUDE.md — seeds-alumni-ui

SEEDS同窓会の共通 UI（トークン・CSS・React の骨組みの部品・素の HTML 向けのスクリプト）。**画面を作る・直すときは `docs/catalog.md` が正**。

## 決めごと

- ユーザーとは日本語でやりとりする。画面の文言も日本語
- **構築（実装）が終わったら PR を出し、レビュアーまたはアサイニー（Assignees）にユーザー本人（GitHub の `massasnake`）を入れる**。この環境から出す PR は作成者が `massasnake` 本人になり、GitHub は作成者をレビュアーにできないので、そのときはアサイニーに入れる（作成者がほかの人・Bot のときはレビュアーに入れる）。どちらも付けられなかったときは、PR を出したうえでそのことを伝える（ユーザーの指定、2026-11-11。同日にレビュアーだけの指定から変更。向き先は main）
- **作り込みすぎない**：共通にするのはトークンと CSS、画面の骨組みの React の部品、小さな共通処理だけ。細かい見た目の React の部品は作らず、クラスで組む。1つのアプリだけで使う見た目は、そのアプリの側に置く
- **依存を小さく**：実行時の依存は React（peerDependencies）だけ。UI ライブラリ・CSS-in-JS・Tailwind は入れない。Storybook などは devDependencies
- ブランド色は深緑（seeds-alumni-idaas の CLAUDE.md の経緯を参照）
- **見た目は2つ**（2026-11-11、ユーザーの決定。1.4.0）：アプリ（既定。マイポータル・管理画面・ツール。淡い深緑の地に白いカード。**今のまま変えない**）と、公開サイト（`<html data-look="site">`。ホームページ。白い地・Noto Sans JP・深緑の色面・丸い矢印）。公開サイトの値の上書きは `css/tokens.css` の末尾、部品は `css/site.css`、決めごとは `docs/catalog.md` §3.10。アプリの画面に公開サイトの部品を持ち込まない
- **管理画面の枠は2つ**（2026-11-12、ユーザーの依頼。1.5.0）：タブの枠（`<AppShell wide tabs>`）と、管理コンソール（`<ConsoleShell>`。上のヘッダー＋左のメニュー。部品は `css/console.css`、決めごとは `docs/catalog.md` §3.11）。どちらも「アプリ」の見た目で**色は変えない**（ユーザーの指定）。一覧・検索・フォーム・空の状態・知らせの組み方は `docs/catalog.md` §8
- **会員向けの画面は PC でも広く使う・ヘッダーのログイン中の人は1つの形**（2026-11-12、ユーザーの依頼。1.7.0）：`main` とヘッダーは 1040px（`--layout-member`）、ログイン・申請だけのページは `main.narrow`（640px）、会員向けの画面のフォームは 640px まで。ログイン中の人は `<AccountMenu>`（`.account`。アイコンの右、上の段に「氏名（会員番号）」、下の段にロール名。ほかの画面への入口・ログアウトはそのメニューの中）。すべてのサービスで同じ形にする（`docs/catalog.md` §3.0）
- **アイコンは Lucide**（2026-11-12、ユーザーの決定）：依存に入れず、版を固定した `lucide-static` から使う SVG だけを各アプリに写す。形は変えず、ライセンス（ISC と Feather 由来の MIT）の全文を写したリポジトリに置く。共通 UI はアイコンを配らない（例外は CSS の検索の虫めがね）。決めごとは `docs/catalog.md` §3.12
- **画面の日本語は共通 UI の `docs/writing.md`（UI の日本語の書き方）に従う**（2026-11-12、ユーザーの指定）。文体・ボタン・エラー・メール・用語（SEEDS-ID・マイポータル・申込・会員番号など）は、すべてのサービスで同じ言い方にそろえる。このリポジトリの `docs/writing.md` が正で、ほかのリポジトリの CLAUDE.md はここを指す。用語を足したら §5・§6 の表に書く。実装が終わったら、変えた画面に出る日本語をすべて読み直す
- 色の値は `css/tokens.css` にだけ書く。インライン style は書かない（Storybook の見本も同じ）。`npm run check` が確かめる
- クラス・トークン・部品を足したら `docs/catalog.md` に書き、`stories/` に見本を足す
- `dist/` は Git に入れる（Git の依存として、ビルドせずに使えるように）。`src/` を変えたら `npm run build` して一緒にコミットする。CI が食い違いを検出する
- 版は `package.json` の `version` とタグ（`v1.2.3`）。クラスの削除・意味の変更は大きい版（`docs/deploy.md`）
- ロゴはこのリポジトリに入れない（提供元の決まり。各アプリに置く）
- ライセンスは MIT（© 大阪大学SEEDSプログラム同窓会。ユーザーの指定、2026-11-10）。ほかのプロジェクトのコードを取り込むときは、そのライセンスと両立するか確かめる
- 依存の更新（Dependabot）の対応は `docs/dependencies.md`（CI が成功していればマージ。失敗したら Dependabot の PR に手でコミットせず、グループの設定を直すか、別の PR で直す。依存の更新だけなら版を上げない）
- 公開先は Cloudflare Pages（Storybook・デモ・`/v1/` の CDN）。`npm run build:site` で `site/` に作る

## 使っているところ

- seeds-alumni-idaas（React。`github:seeds-alumni/seeds-alumni-ui#vX.Y.Z` のタグで取り込む。版を上げたら idaas の指定を変える PR を出す。2026-11-12 に v1.5.0 にした（seeds-alumni/seeds-alumni-idaas#56。管理画面を管理コンソールに））
- seeds-alumni-event-manager（React。idaas と同じ取り込み方。2026-11-12 に v1.5.0 にした（seeds-alumni/seeds-alumni-event-manager#13。運営画面を管理コンソールに））
- seeds-alumni-totp-site（素の HTML。2026-11-10 に CSS のコピーをやめ、CDN の `https://ui.seeds-alumni.jp/v1/seeds.css`・`/v1/theme.js` を読み込む形にした。このサイトだけの見た目は `design/totp.css`。CI で `seeds-ui-check` を実行。チェックの版は `.github/workflows/check.yml` と README に書いてあり、2026-11-11 に v1.4.0 にした）

- seeds-alumni-wiki（**同窓会の公式ホームページ** https://www.seeds-alumni.jp/ 。リポジトリ名は Wiki だったころのまま。2026-11-10 に HonKit をやめ、`base/` の Markdown を `scripts/build.mjs` で HTML にして、CDN の `/v1/seeds.css`・`/v1/theme.js` を読み込む形にした。このサイトだけの見た目は `theme/site.css`。CI で `seeds-ui-check` を実行）

**CDN（`/v1/`）は main へのマージから最長1時間で totp-site・ホームページなどに反映される**（タグを待たない）。`css/` や `js/` の変更は、Storybook と素の HTML のデモ（`/demo/`）で確かめてからマージする。クラスを消す・意味を変える変更は v2 にして `/v2/` に置く（`docs/deploy.md`）
