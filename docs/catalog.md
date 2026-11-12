# カタログ（@seeds-alumni/ui）

SEEDS同窓会のサービス（マイポータル・会員管理システム・SEEDS-TOTP など）で共通に使う見た目のルール。**人と AI（Claude Code など）の両方が読む前提**で書いている。
画面を作る・直すときは、この文書の「React の部品と画面の型」（§4）と「クラス」（§3）から選び、新しい見た目を作らない。

- 実装：`css/`（`tokens.css` → `base.css` → `components.css` → `console.css` → `site.css` → `utilities.css` の順に `index.css` で読み込む）、`src/`（React の部品）、`js/theme.js`（素の HTML 向けの表示の切り替え）、`js/nav.js`（ハンバーガーメニュー）、`js/console.js`（管理コンソールの左のメニュー・ドロップダウン）
- 画面の組み方の決めごと（一覧・検索・フォーム・空の状態・知らせ）：§8
- **UI の日本語の書き方（表記規約・用語の統一）：`docs/writing.md`**（すべてのサービスで共通）
- 導入のしかた：`docs/usage.md`（React のアプリ・素の HTML・CDN）
- 見本：Storybook（部品ごと）とデモ（画面の型）。公開先は `docs/deploy.md`
- 検査：`seeds-ui-check`（§6。このリポジトリでは `npm run check`）。カタログと CSS が食い違うと失敗する

## 1. 原則

**作り込みすぎない**：細かい部品をたくさん持つデザインシステムは、作るのも保守するのも手間がかかる。少人数の運営で続けられるよう、共通にするのは次の3つに絞る。

1. **トークンと CSS**：色・余白・角丸などの値と、素の HTML でも使えるクラス（§2・§3）
2. **画面の骨組みの React の部品**：画面の枠・カード・一覧・詳細・ダッシュボード・フォームの1項目（§4）。細かい見た目はクラスで組む
3. **小さな共通処理**：表示の切り替え、アプリ内のダイアログ

**値の決め方**（ブランド色は深緑）：

- **地と面**：ページの地は淡い深緑、その上に白いカードを影で浮かせる。カードの中で文を載せる淡い地（コラム）は温かみのある灰色
- **色の段階と意味**：深緑を淡い（01）〜濃い（10）の段階で考え、役割ごとに使う段階を決める（§2.1）。リンク・ボタンは G07、現在地（選択中のタブ）・フォーカスは G05、マウスを載せたときの地は G02
- **コントラスト**：文字は 4.5:1 以上、入力欄の枠など画面を読み取るのに必要な線は 3:1 以上
- **影は3段階**：カード（`--shadow-card`）→ 浮かせる要素（`--shadow-float`）→ ダイアログ（`--shadow-popup`）
- **角丸は役割で決める**：小さい部品 4px、ボタン・入力欄 8px、カード 12px、ダイアログ 24px
- **フォーカスは二重の輪**：内側から白・ブランド色・白（どの地の上でも見える）
- **部品の見た目**：ボタンは太字、マウスを載せると淡いブランド色の地。タブは下線で現在地を示す。状態のバッジは枠つき。注意の箱は色の枠と淡い地

**見た目は2つ**（2026-11-11）：

| 見た目 | 使うところ | 決め方 |
|---|---|---|
| **アプリ**（既定） | マイポータル・会員管理システム・SEEDS-TOTP などのツール | 上の決め方。淡い深緑の地に白いカードを影で浮かせる |
| **公開サイト**（`<html data-look="site">`） | 同窓会のホームページ | 白い地に黒い文字と深緑の色面。カードと影は使わず、淡い灰色の帯・罫線・丸い矢印で区切る。書体は Noto Sans JP（§3.10） |

**管理画面の枠は2つ**（2026-11-12。どちらも「アプリ」の見た目で、色は同じ）：

| 枠 | 使うところ | 組み方 |
|---|---|---|
| **タブの枠**（`<AppShell wide tabs>`） | 画面の少ない管理画面（目安：6画面まで） | 上のヘッダーとタブ。一覧は `<ListLayout>`（カードの中に検索・表） |
| **管理コンソール**（`<ConsoleShell>`、§3.11） | 画面が多い・まとまりで分けたい管理画面 | 上のヘッダー（全体の検索・ログイン中の人）＋左のメニュー。各画面は `<PageHeader>` → `<CollectionLayout>`・`<Card>`（§4.6） |

トークンの名前・ブランド色・ボタン・バッジ・フォーカスの輪・ライト／ダークは2つで共通。公開サイトは地の色・書体・ヘッダーの高さだけを上書きし、公開サイト向けの部品（§3.10）を足す。**アプリの画面で公開サイトの部品（色面・大きな写真）を使わない**（操作する画面は静かに保つ）。

そのうえで守ること：

1. **読みやすさ・押しやすさ優先**：利用者は同窓生（スマートフォンが多い）と少人数の運営。装飾より、文字の大きさ・余白・押せる場所の分かりやすさを優先する。入力欄とボタンは同じ高さ（40px）にそろえる
2. **深緑がブランド色**：リンク・主要なボタン・選択中のタブ・フォーカスは深緑（`--color-brand*`）。成功（`--color-success`）は少し明るい緑で区別する。それ以外の色は「注意・危険」などの意味だけに使う。色だけで状態を伝えず、必ず文字を添える
3. **線より面と影で区切る**：カードは枠線ではなく白い面と影で地から浮かせる。線は区切り線（`--color-divider`）と入力欄・ボタンの枠（`--color-border` / `--color-border-soft`）、状態を示す枠（`--color-*-line`）だけ
4. **ライト・ダークの両対応**：色はトークン経由でだけ使う。初めは OS の設定に従い、ヘッダーのボタンで切り替えられる（`localStorage` の `theme`。同じドメインのサービスで表示がそろう）
5. **部品を増やす前に組み合わせる**：既存の部品と補助クラスで足りないときだけ部品を追加する（§7）。1つのアプリだけで使う見た目は、そのアプリの CSS に置く
6. **依存を小さく**：UI ライブラリ・CSS-in-JS・Tailwind は使わない。外部ライブラリは保守が止まると危険になり、画面を重くし、中のバグに手が出せないため。React の部品の実行時の依存は React だけ。Storybook などは開発のときだけ使う

## 2. デザイントークン

すべて `css/tokens.css` に定義する（アプリ固有のトークンはアプリのトークンのファイルに）。色は `light-dark(ライト, ダーク)` で1行に書く。どちらの値が使われるかは `color-scheme` で決まり、既定は OS の設定、`<html data-theme="light|dark">` で固定する（React は `<ThemeToggle>`、素の HTML は `js/theme.js` が切り替え、`localStorage` の `theme` に残す。描画の前に戻すスクリプトを `<head>` に置くので、ちらつかない。`docs/usage.md`）。ダークの値も同じ考え方で決めた。

### 2.1 色

| トークン | ライト | ダーク | 使う場面 |
|---|---|---|---|
| `--color-bg` | #f1f6f3 | #121413 | ページの地（淡い深緑） |
| `--color-surface` | #ffffff | #1d201e | カード（`section`、`.tile`）・ダイアログ・候補リスト。`--shadow-card` で浮かせる |
| `--color-field` | #ffffff | #161817 | 入力欄・標準ボタン・`.choice`・カードの中の箱（`.box`） |
| `--color-column` | #f7f5f5 | #252826 | カードの中で文を載せる淡い地。表の見出しの行、`.notice` |
| `--color-hover` | #ecf4ef | #26302a | 表の行・タブ・タイルにマウスを載せたとき（ブランド色 6%） |
| `--color-header` | 白 92% | カードの色 92% | 上部のヘッダー（半透明＋ぼかし） |
| `--color-backdrop` | 黒 50% | 黒 65% | ダイアログの後ろを暗くする（`.dialog::backdrop`） |
| `--color-band` | #f4f4f4 | #1e211f | 公開サイトの淡い灰色の帯（`.band.soft`・題名の帯・フッター） |
| `--color-ink` / `--color-ink-hover` | #3f4441 / #2b2f2d | #3a403d / #4a514d | 濃い灰色の面（`.quick-links` の大きなリンクボタン、`.arrow-dot.ink`）。上の文字は `--color-on-solid` |
| `--color-bar` | #111111 | #0a0b0a | 公開サイトのフッターのいちばん下の黒い帯（`.app-footer-bar`） |
| `--color-on-solid-muted` | #d5e5dc | #c4dccf | 深緑の色面（`.color-band`）の上の補足の文字と線 |
| `--color-text` | #323232 | #e3e5e3 | 本文 |
| `--color-text-strong` | #1e1e1e | #f5f6f5 | 見出し・ラベル・数値 |
| `--color-text-muted` | #6e6b6b | #a3a7a4 | 補足・表の見出し・`dt`（`.muted`） |
| `--color-divider` | #e9e7e7 | #2f3431 | 区切り線（表の行、ヘッダーの下、タブの下） |
| `--color-border` | #8c8989 | #6b716d | 入力欄の枠（白に対して 3:1 以上） |
| `--color-border-soft` | #dcdcdc | #3d433f | 標準ボタン・`.choice` の枠（文字が太字なので淡い線でよい） |
| `--color-brand` / `--color-brand-hover` | #1d5c3f / #163d2b | #8cc7a8 / #b4dcc6 | リンク・選択中の文字（G07）／マウスを載せたとき（G09） |
| `--color-brand-solid` / `--color-brand-solid-hover` | #1d5c3f / #163d2b | #2f6a4e / #3a7d5d | 主要ボタン（`.button.primary`）の地、ロゴ |
| `--color-brand-current` | #2b7553 | #8cc7a8 | 現在地（選択中のタブの下線）・フォーカスの輪（G05） |
| `--color-brand-tint` | #dcebe2 | #24382c | 標準ボタン・`.choice`・表示切り替えにマウスを載せたときの地（G02） |
| `--color-on-solid` | #ffffff | #ffffff | brand-solid・danger-solid・env の上の文字 |
| `--color-logo-bg` | #ffffff | #ffffff | ロゴの地（`img.brand-mark`）。ロゴは白い地に置く決まりなので、ダークでも白 |
| `--color-success` / `--color-success-line` / `--color-success-soft` | #18794e / #2b7553 / #e3f2e9 | #5fd59a / #3d9b6c / #1d3527 | 完了・一致・承認済み・利用中（文字／枠／地） |
| `--color-warning` / `--color-warning-line` / `--color-warning-soft` | #825a0f / #be8c14 / #fff0d2 | #f2c66d / #a87c1c / #3a2f17 | 要確認・部分一致・審査中・仮番号 |
| `--color-danger` / `--color-danger-line` / `--color-danger-soft` | #a51428 / #dc1e32 / #fad2d7 | #ff8a96 / #e0505e / #45202a | エラー・不一致・却下・停止 |
| `--color-danger-solid` / `--color-danger-solid-hover` | #dc1e32 / #a51428 | #c13a44 / #d14b55 | 取り消せない操作のボタン（`.button.danger`）の地（RE5 → RE7） |
| `--color-neutral-line` | #8c8989 | #6b716d | 既定のバッジ（`.badge.none` など）の枠 |
| `--color-env` | #d9480f | （同じ） | 環境バッジ専用（本番以外であることを示す） |

### 2.2 文字

| トークン | 値 | 使う場面 |
|---|---|---|
| `--font-family` | -apple-system、Helvetica Neue、ヒラギノ角ゴ、游ゴシック、メイリオ、Noto Sans JP ほか | すべて（Web フォントは読み込まない） |
| `--font-size-xs` | 0.75rem | バッジ・表の見出し・環境バッジ |
| `--font-size-sm` | 0.875rem | 補足（`.small`）、表、`dt`、タブ、小さいボタン |
| `--font-size-base` | 1rem | 本文・h3（スマートフォンで読む会員が多いので大きめ） |
| `--font-size-lg` | 1.125rem | カードの見出し（h2）、ヘッダーの名前 |
| `--font-size-xl` | 1.5rem | ページの見出し（h1、`.page-title`） |
| `--font-size-display` | 2rem | ダッシュボードの数値（`.tile-value`） |
| `--font-family-site` | Noto Sans JP、ヒラギノ角ゴ、游ゴシック、メイリオ | 公開サイト（`data-look="site"`）の書体。Noto Sans JP は使う側のページで Google Fonts から読み込む（§3.10） |
| `--font-size-2xl` | 1.5〜2rem（画面の幅で伸び縮み） | 公開サイトの下層ページの題名（`.page-head h1`）・色面の見出し |
| `--font-size-3xl` | 1.5〜3rem（同上） | 公開サイトのトップの大見出し |
| `--font-size-en` | 2〜2.75rem（同上） | 公開サイトの欧文の大きい見出し（`.heading-en`） |
| `--font-weight-medium` | 500 | 表の中のリンク |
| `--font-weight-bold` | 700 | 見出し・ラベル・バッジ・ボタン・タブ |
| `--font-weight-heavy` | 700 | 数値・ロゴ・環境バッジ |
| `--line-height` | 1.7 | 本文（日本語の読みやすさのため広め） |
| `--line-height-tight` | 1.4 | 見出し・ボタン・入力欄・表 |

### 2.3 余白・大きさ・角丸・線・レイアウト

| トークン | 値 | 使う場面 |
|---|---|---|
| `--space-2xs` | 4px | タブの間、バッジの間 |
| `--space-xs` | 6px | ラベルと入力欄の間 |
| `--space-sm` | 8px | 横並び（`.row`）の間、入力欄の上下 |
| `--space-md` | 12px | 縦並び（`.stack`）の間、表のセル、入力欄の左右 |
| `--space-lg` | 16px | カードの間、ボタンの左右、ページの左右 |
| `--space-xl` | 20px | フォームの項目の間 |
| `--space-2xl` | 24px | カードの内側、タブの下 |
| `--space-3xl` | 32px | 大きな区切り |
| `--space-4xl` | 48px | ページの下 |
| `--control-height` | 40px | 入力欄・ボタンの高さ（横並びでそろう） |
| `--control-height-sm` | 32px | 小さいボタン（`.small-btn`） |
| `--check-size` | 1.125rem | チェックボックス・ラジオボタン（1行目の中央にそろえる） |
| `--header-height` | 56px | 上部のヘッダー |
| `--tab-height` | 44px | 管理画面のタブ（`.tabs a`） |
| `--sidebar-width` | 248px | 管理コンソールの左のメニュー（`.console-sidebar`。狭い画面で引き出すときは画面の 85% まで） |
| `--avatar-size` / `--avatar-size-sm` / `--avatar-size-lg` | 32px / 24px / 40px | 人の丸いアイコン（`.avatar` / `.avatar.sm` / `.avatar.lg`） |
| `--icon-size` / `--icon-size-sm` | 1.25rem / 1rem | ボタン・メニューの中のアイコン（20px）／入力欄の中のアイコン（16px） |
| `--dot-size` | 8px | 状態の点（`.status-dot`）・未読の点（`.icon-button.has-dot`） |
| `--label-width` | 12em | 横並びのフォーム（`.form.aligned`）の項目名の列 |
| `--icon-search` | 虫めがねの形（SVG） | `.search-field` の虫めがね。`mask` で形だけ使い、色はトークンで付ける。共通 UI が持つただ1つのアイコン（独自に描いたもの。§3.12） |
| `--radius-sm` | 4px | バッジ・小さいボタン・候補 |
| `--radius-md` | 8px | 入力欄・ボタン・タブ（上だけ）・`.box`・`fieldset`・ヘッダーのロゴ |
| `--radius-lg` | 12px | カード（`section`、`.tile`、`.choice`） |
| `--radius-xl` | 24px | ダイアログ（`.dialog`） |
| `--radius-block` | 28px | 公開サイトの色面の、1つだけ大きく丸める角（`.photo-block`・`.color-band`） |
| `--radius-full` | 999px | 丸いボタン（表示の切り替え） |
| `--border-width` / `--border` | 1px / 1px solid border 色 | 入力欄・ボタンの枠（`border: var(--border)`） |
| `--divider` | 1px solid divider 色 | 区切り線（`border-bottom: var(--divider)`） |
| `--focus-ring` | 内側から 白 1px・`--color-brand-current` 2px・白 1px（`box-shadow`） | ボタン・リンクのキーボードフォーカス（`:focus-visible`）と入力欄のフォーカス。`outline` は Windows のハイコントラスト表示のために透明で残す |
| `--shadow-card` | 広くぼかした薄い影＋近くの影 | カード（`section`、`.tile`）・ヘッダー |
| `--shadow-float` | カードより一段強い影 | 画面に浮かせる要素（候補リスト） |
| `--shadow-popup` | いちばん強い影 | ダイアログ |
| `--z-dropdown` / `--z-header` / `--z-drawer` / `--z-toast` | 90 / 100 / 110 / 200 | 重なりの順：ドロップダウン（`.dropdown-menu`）→ ヘッダー → 狭い画面で引き出す左のメニュー → 短い知らせ（`.toast-region`） |
| `--transition` | 0.2s ease | マウスを載せたときの色の変化 |
| `--layout-narrow` | 640px | 会員向け画面の幅（`main`） |
| `--layout-wide` | 1200px | 管理画面の幅（`main.wide`）・ホームページの帯の幅（`.container.wide`） |
| `--layout-reading` | 820px | 長い文章（`.prose`）の1行の長さ（`.container.reading`。左右の余白は別） |
| `--layout-console` | 1600px | 管理コンソールの本文の最大幅（`main.console-main`。列の多い一覧のために広い） |
| `--layout-dialog` | 440px | ダイアログの幅（狭い画面では左右に `--space-lg` を残して縮む） |
| `--layout-toast` | 28rem | 短い知らせ（`.toast-region`）の幅 |
| `--tile-min` | 200px | `.tiles` の1枚の最小幅 |
| `--column-min` | 300px | `.grid2` の1列の最小幅 |

ブレークポイントは **640px と 980px の2段**（media query では `var()` を使えないので値を直接書く）：

- **640px**（`@media (max-width: 640px)`。スマートフォン）：カードとページの余白を詰め、ヘッダーのログイン中の名前を隠す
- **980px**（`@media (max-width: 980px)`。タブレット）：ヘッダーのメニュー（`.header-nav`）を隠してハンバーガーメニューに切り替える。メニューを横に並べるには 640px では狭すぎるため（ホームページで確かめた）

使う側で幅に応じた見た目を足すときも、この2つの値を使う。

## 3. クラス（部品カタログ）

クラスのない要素（`h1`〜`h3`、`section`、`dl`、`fieldset`、`input`、`table` など）は `base.css` で整えてあるので、そのまま使う。`section` は**カード**（白い地・角丸 12px・`--shadow-card`、枠線なし）として使う。React では `<Card>` が `section` を作る。`section` 以外の要素（`article`・`div`）をカードにするときは `.card` を付ける。カードにしない区切りには `section` を使わず `div` にする（`section` の見た目を外すのは v2 の候補。`docs/deploy.md` §3）。

### 3.0 アプリの枠（ヘッダー）

React では `<AppShell>`（ヘッダー＋本文＋ダイアログ）か `<AppHeader>` を使い、クラスを直接は書かない（§4）。素の HTML では `docs/usage.md` のマークアップをそのまま使う。

| クラス | 使う場面 |
|---|---|
| `.app-header` / `.app-header.wide` | 上部に固定するヘッダー（半透明＋ぼかし、下に区切り線）。管理画面は `wide` |
| `.app-header-inner` | ヘッダーの中身の幅をページ（`main`）とそろえる |
| `.brand` / `.brand-mark` / `.brand-name` | 左上のロゴ（深緑の四角に S。`<img class="brand-mark">` にすると各アプリのロゴの画像を高さ 32px・白い地で出す。幅は縦横比に任せる）とサイト名（例：「SEEDS-ID マイポータル」。「SEEDS同窓会」の間に空白を入れない）。押すとトップへ。狭い画面ではサイト名を2行に折り返す |
| `.header-actions` | 右側の操作（ログイン中の人、ログアウト、マイポータルへのリンク、表示の切り替え） |
| `.header-user` | ログイン中の人の名前。狭い画面では隠す |
| `.theme-toggle` | ライト・ダークの切り替えボタン（React は `<ThemeToggle>`。素の HTML は `<button class="theme-toggle"></button>` を置いて `js/theme.js` を読み込む） |
| `.app-footer` / `.app-footer.wide` | ページの下のフッター（公開サイト。白い地、上に区切り線）。`body` の直下に置くと、短いページでも画面の下端に寄る。幅はヘッダーとそろえる（`wide`） |
| `.app-footer-inner` | フッターの中身（左に団体名・所在地、右にメニューの `ul`。狭い画面では折り返す） |
| `.app-footer-name` / `.app-footer-copy` | 団体名（太字）／一番下の著作権の行（中央、小さい補足の文字） |

```tsx
<AppShell title="SEEDS-ID 会員管理システム" href="/admin" wide envLabel={envLabel}
  actions={<><span className="header-user">管理 太郎（管理者）</span><a href="/">マイポータル</a></>}>
  …
</AppShell>
```

### 3.1 レイアウト

| クラス | 使う場面 |
|---|---|
| `main` / `main.wide` | ページの本文の枠。会員向けは `main`（640px）、管理画面は `main.wide`（1200px） |
| `main.full` | 幅も余白も決めない本文の枠（ホームページなど、帯ごとに幅を変えるサイト）。幅は中の `.container` で決める |
| `.container` / `.container.wide` / `.container.reading` | 中身の幅を決めて中央に置く（左右に `--space-lg`）。既定は 640px、`wide` は 1200px、`reading` は長い文章の幅（`--layout-reading`＋左右の余白）。`main.full` の中や `.page-head` の中で使う |
| `.card` | `section` と同じカードの見た目を、`article` や `div` に付ける（`.card.prose` で文章のカード） |
| `.page-head` | ページの上の帯（白い地。パンくず・題名・記事の日付）。中に `.container` を置き、本文と幅をそろえる |
| `.page-meta` | 題名の下の行（記事の日付・分類の `.badge`）。補足の色の小さい文字 |
| `.page-title` | カードの外に置くページの見出し（h1 と同じ大きさ。h1 はヘッダーの名前と重ならないよう、必要なときだけ） |
| `.back-link` | 一覧へ戻るリンク（先頭に ←）。詳細の画面の一番上（`<DetailLayout back>`） |
| `.stack` | ボタンや `.choice` を縦に並べる（ログイン方法の選択など） |
| `.row` | 横に並べて折り返す（ボタンの組、入力欄＋ボタン）。`.row.between` は両端に寄せる（見出し＋操作） |
| `.grid2` | 2列（狭い画面では1列）。審査画面の「申請」と「名簿」の比較など |
| `.box` | カードの中の白い箱。フォームの中の小さなまとまり（追加フォーム、確認コードの入力） |
| `.warnbox` | `.box` と組み合わせて注意を促す（`.box.warnbox`、注意の色の枠と淡い黄色の地）。中の `ul` は箇条書き。カードの外・フォームの上の知らせは `.message-box`（§3.6） |
| `.headline` | 管理画面の画面の見出し（カードの外、地の上）。パンくず（`.breadcrumb`）→ 左に題名と説明、右に画面全体の操作。React は `<PageHeader>` |
| `.headline-main` / `.headline-title` / `.headline-desc` / `.headline-actions` | 題名と説明のまとまり／題名（h1。右に `.count`）／1行の説明（補足の色）／右の操作（主要な操作 `.button.primary.inline` は1つ、いちばん右） |
| `.toolbar` / `.toolbar-group` | 一覧の上の帯（地の上）。左に表示の切り替え（`.segmented`）、右に `form.toolbar-group[role=search]`（絞り込みの `.dropdown` と `.search-field`）。入らなければまとまりごと次の行へ。React は `<CollectionLayout>` |

```tsx
<div className="row between">
  <h2>申請の詳細</h2>
  <a href="#/applications">一覧へ</a>
</div>
```

### 3.2 ボタン・リンク

`.button` は単独で**幅いっぱいのブロック**になる（スマートフォンで押しやすい）。管理画面や横並びでは `inline` などを付ける。高さは入力欄と同じ 40px、文字は太字。マウスを載せると淡い緑の地に、枠と文字が濃い緑になる。

| クラス | 使う場面 |
|---|---|
| `.button` | 幅いっぱいの標準ボタン（`a` でも `button` でも） |
| `.button.primary` | 画面の主要な操作（送信・承認・保存）。1つの画面・フォームに1つまで |
| `.button.danger` | 取り消せない・失う操作（却下・停止・削除）。押す前に確認を入れる |
| `.button.secondary` | 補助的な操作（変更画面を開く・キャンセル）。横幅は中身に合わせる |
| `.button.inline` | 幅を中身に合わせる（`primary` / `danger` と組み合わせる） |
| `.button.small-btn` | 表の中・行の中の小さな操作（削除・前へ・次へ） |
| `.link` | 見た目をリンクにした `button`（ログアウト、画面内の切り替えなど） |
| `.button.ghost` | 枠のないボタン（一覧の上の絞り込み「期 ▾」、ヘッダーの中の操作）。`.applied` は条件を選んでいる状態（淡いブランド色の地と緑の文字。中に選んだ数の `.count`） |
| `.has-caret` | 押すとメニューが開くボタンの右の山形（`details[open]` の中では上向き）。`<summary class="button ghost has-caret">` |
| `.button svg` | ボタンの文字の左のアイコン（20px、小さいボタンは 16px）。アイコンは飾りなので `aria-hidden="true"`、意味は文字で伝える。アイコンの出どころと写し方は §3.12 |
| `.icon-button` | アイコンだけの丸いボタン（ヘルプ・お知らせ）。**必ず `aria-label`**（「ヘルプ」）。`.has-dot` は右上に未読の赤い点（`aria-label` にも「（未読あり）」と書く）。ライト・ダークの切り替え（`.theme-toggle`）と同じ大きさ |
| `.kbd` | キーの案内（`<kbd class="kbd">Ctrl K</kbd>`）。`.search-field` の右端に置ける |
| `.choice` | 選択肢の大きなカード（右端に緑の →。マウスを載せると淡い緑の地になり、→ が少し右へ動く）。行き先を選ばせるリンク（ログイン方法、旧ログインでの引き継ぎ）。`.stack` の中に縦に並べる |

```tsx
<div className="stack">
  <a className="choice" href="/auth/login?method=google">Google でログイン</a>
  <a className="choice" href="/auth/login?method=email">メールアドレスでログイン（確認コード）</a>
</div>
```

```tsx
<div className="row">
  <button className="button primary inline" onClick={approve}>承認</button>
  <button className="button danger inline" onClick={reject}>却下</button>
</div>
```

### 3.3 フォーム

| クラス・要素 | 使う場面 |
|---|---|
| `.form` | フォーム全体（項目を縦に並べる）。中の `label` は「ラベル文字＋入力欄」の縦並び |
| `.form-field` | フォームの1項目（ラベル→入力欄→補足）。React は `<Field>`。`label` にできない項目（入力欄が複数ある、検索の候補を出すなど）は `div.form-field` にする |
| `label.check` / `label.radio` | チェックボックス・ラジオボタンと文の横並び（`input` を `label` の中に入れる） |
| `fieldset` + `legend` | 選択肢のまとまり（ラジオボタンの組など） |
| `.filters` | 一覧の上の検索・絞り込み（1行に並べ、高さと縦の位置をそろえる。最初の入力欄が広い。中の `label.check` は1行で中央にそろう） |
| `.form.aligned` | 横並びのフォーム：項目名を左の列（`--label-width`）、入力欄・補足・誤りを右の列（640px 以下は縦）。管理画面の設定など、項目が多く何度も使うフォーム。会員向けの申請など一度きりのフォームは縦（`.form`）のまま |
| `.form-actions` / `.form-actions.sticky` | 送信ボタンの行（上に区切り線。主要な操作を左に、続けて「キャンセル」「元に戻す」）。`.sticky` は長いフォームで画面の下に貼りつける（カードの中で使う） |
| `[aria-invalid="true"]` | 誤りのある入力欄（枠が赤）。誤りの文は欄の直後の `.error.small`（`<Field error>`） |
| `.search-field` | 虫めがねつきの検索欄（`span.search-field > input[type=search]`）。入力欄に `aria-label`（「会員を検索」）。一覧の上は `.toolbar` の中、全体の検索は `.console-search` の中 |
| `.dropdown` / `.dropdown-menu` / `.dropdown-label` | 押すと開くメニュー（`details.dropdown > summary + div.dropdown-menu`）。中は `a`・`button`・`label.check`（絞り込みの選択肢）・`hr`・小さい見出しの `.dropdown-label`。`.dropdown-menu.end` は右端にそろえる（ヘッダーの右など）。`button.danger` は赤い文字。外を押す・Esc・項目を押すと閉じる（React は `<AppShell>`・`<ConsoleShell>`、素の HTML は `js/console.js`）。表の中では開かない（表の枠で切れる） |
| `.filter-tags` / `.filter-tag` | 適用中の絞り込みの条件（`.toolbar` の下）。1つの条件ごとに `button.filter-tag`（「期：1期 ×」。押すとその条件を外す。`aria-label` は「期：1期 の条件を外す」）、最後に「すべて外す」（`.link`）。条件がないときは出さない |
| `.suggest` | 入力欄の下に出す候補リスト（`ul.suggest` の中の `li > button`。マウスを載せた候補は淡い地。学校の検索など） |

- 入力の誤りは、その項目の直後に `<span className="error small">…</span>` で出す
- 補足は `<span className="muted small">…</span>`
- 任意の項目はラベルに「（任意）」と書く（必須は書かず、`required` を付ける）

```tsx
<form className="form" onSubmit={submit}>
  <label>
    氏名
    <input value={name} onChange={(e) => setName(e.target.value)} required />
    <span className="muted small">補足の説明</span>
  </label>
  <label className="check">
    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
    会則とプライバシーポリシーに同意します
  </label>
  <button className="button primary">申請</button>
</form>
```

### 3.4 ナビゲーション

| クラス | 使う場面 |
|---|---|
| `.tabs` | 管理画面の上のタブ（`nav.tabs` の中に `a`。選択中は `a.active` で緑の文字と太い下線、マウスを載せると淡い地と細い下線。狭い画面では横にスクロール） |
| `.segmented` | 同じ一覧の表示の切り替え（「すべて 63・利用中 56・停止中 3」）。選んでいるものは白い地と枠。URL が変わるなら `nav.segmented > a[aria-current="page"]`、画面の中で切り替えるなら `div.segmented[role=group] > button[aria-pressed]`。**画面そのものの切り替えは `.tabs`** |
| `.pager` | ページ送りの行。React は `<Pager>`（`<ListLayout pager>`）が付けるので直接は書かない |
| `.breadcrumb` | パンくず（`nav.breadcrumb[aria-label="現在地"] > ol > li`。項目の間に ›。いまのページは `<span aria-current="page">`）。`.page-head` の中など |
| `.header-nav` / `.header-nav-item` / `.header-nav-sub` | ヘッダーのサイトのメニュー（`.brand` と `.header-actions` の間の `nav.header-nav > ul > li.header-nav-item`）。広い画面で横に並べ、**980px 以下では隠れてハンバーガーメニューに切り替わる**（`.nav-toggle` は 981px 以上で自動で隠れ、ヘッダーの表示の切り替えは 980px 以下で隠れるので、`.nav-screen-theme` をメニューの中に置く）。React は `<AppHeader nav>` |
| `.header-nav-item.active` / `.header-nav-item.has-children` | いまいるセクション（緑の文字と下線）／下にページがある項目（▾。マウスを載せるかフォーカスすると `ul.header-nav-sub` が出る） |
| `.nav-toggle` / `.nav-toggle-bars` | ハンバーガーメニューのボタン（ヘッダーの右端。3本線、開いているあいだは ×）。ページがいくつもあるサイト（ホームページなど）の狭い画面で使う。出す画面の幅は使う側の CSS で決める |
| `.nav-screen` / `.nav-screen-inner` | ボタンで開くメニューの画面（ヘッダーの下に画面いっぱいに重ねる）。`.app-header` の**外の直後**に置き、`hidden` で隠しておく |
| `.nav-screen-list` / `.nav-screen-row` / `.nav-screen-expand` | メニューの一覧（項目ごとに区切り線）。下にページがある項目は `.nav-screen-row` にリンクと `.nav-screen-expand`（＋／−）を並べ、下のページの `ul` を開け閉めする。いまのページは `aria-current="page"`（緑の文字） |
| `.nav-screen-footer` / `.nav-screen-theme` | メニューの下の操作（表示の切り替えの行・ログインのボタンなど） |
| `.nav-open` | 開いているあいだ `html` に付く（後ろのページをスクロールさせない）。`js/nav.js` が付けるので書かない |

ハンバーガーメニューは素の HTML 向け。開け閉めは `js/nav.js`（CDN の `/v1/nav.js`）が行う：押すと `aria-expanded` と `hidden` を切り替え、Esc・メニューの中のリンク・画面が広くなったときに閉じる。開いているあいだは本文とフッターを `inert` にする。マークアップは `docs/usage.md`。

### 3.5 表

| クラス | 使う場面 |
|---|---|
| `.table-wrap` | 表は必ずこれで囲む（狭い画面で横スクロール） |
| `tr.clickable` | 行全体を押して詳細へ進む（`onClick` で `location.hash` を変える） |
| `tr.mismatch` | 照合で「不一致」・取り込みでエラーの行（赤い背景） |
| `tr.partial` | 照合で「部分一致」・取り込みで警告の行（黄色い背景） |
| `table.compare` | 2つの値を並べて比べる表（1列目が項目名） |
| `.table-card` | 表を入れるカード（管理コンソールの一覧）。表を端から端まで広げ、行の中身を上下の中央にそろえる。中は `.table-card-bar` → `.table-wrap` か `.empty-state` → `.table-card-foot` |
| `.table-card-bar` / `.table-card-bar.bulk` | 表の上の帯（左に件数、右に表示中の範囲への小さい操作）。行を選んでいるあいだは `.bulk`（淡いブランド色。「n 件を選択中」・一括操作・「選択を解除」） |
| `.table-card-foot` | 表の下の帯（ページ送り `.pager`） |
| `.check-cell` | 一括操作のチェックボックスの列（`th.check-cell` は「表示中の行をすべて選ぶ」）。チェックボックスには `aria-label`（「山田 太郎を選ぶ」） |
| `button.sort` | 並べ替えられる列の見出し（`th[aria-sort="none|ascending|descending"] > button.sort`）。並べ替えている列は緑の矢印、ほかは淡い矢印。押すたびに昇順 ↔ 降順 |
| `.num` | 数値の列（金額・件数）を右にそろえる（`th.num`・`td.num`）。会員番号などの番号は左のまま |
| `.actions-cell` | 行の操作の列（右端、折り返さない）。操作は `.button.small-btn` を1〜2個まで。同じ操作は詳細の画面でもできるようにする |
| `tr.selected` | 選んでいる行（淡いブランド色の地） |

### 3.6 状態の表示

| クラス | 使う場面 |
|---|---|
| `.badge` | 状態の小さなラベル（角丸 4px、状態の色の枠と文字、淡い地）。React では `<Badge kind="…">` |
| `.badge.ok` | 完了・一致・利用中（緑） |
| `.badge.warn` | 要確認・審査中・仮の状態（黄） |
| `.badge.ng` | エラー・不一致・却下・停止（赤） |
| `.badge.none` | 該当なし・未登録・取り下げ（灰色の枠） |
| `.tiles` / `.tile` / `.tile-value` | ダッシュボードの数値のカード（`a.tile` に `href` を付けると一覧へのリンクになり、右上に →。マウスを載せると淡い緑の地と緑の枠）。中身は上にそろう（説明の行数が違っても位置がずれない） |
| `.tile-title` | 数値ではなく題名＋説明のリンクのカード（入口のページの「団体概要」「設立経緯」など）。`<a class="tile" href="…"><strong class="tile-title">団体概要</strong><span class="muted small">説明</span></a>` |
| `.env-badge` | 環境バッジ（`<AppHeader envLabel>` がサイト名の右横に置く。本番では出さない） |
| `.status-dot` | 状態の点と文字（`<span class="status-dot ok">利用中</span>`）。点の色は `.badge` と同じ意味（`.ok` / `.warn` / `.ng` / `.none`）、文字は本文の色。**行の多い表の状態の列**は、目立ちすぎないようにこちらを使う。詳細の画面の見出しの横など、1つだけ目立たせるときは `.badge` |
| `.tag` / `.tag.brand` | 分類の札（ロール・区分・タグなど、状態ではないもの）。灰色の丸い札。`.brand` は目立たせたい分類（役職・「管理コンソール」の表示）。**状態は `.tag` にしない**（`.badge` か `.status-dot`） |
| `.count` | 件数（見出しの横・`.segmented`・左のメニューの中）。読み上げのために `<span class="count">63<span class="visually-hidden">件</span></span>` |
| `.avatar` / `.avatar.sm` / `.avatar.lg` | 人の丸いアイコン（32px / 24px / 40px）。写真があれば `img.avatar`、なければ名字の1文字（`aria-hidden="true"`。名前は横に文字で書く） |
| `.person` / `.person-text` / `.person-name` / `.person-sub` | 人：`.avatar` と、名前（太字）＋補足（メールアドレスなど）。表の氏名の列・ヘッダーのログイン中の人。`a.person` にすると詳細へのリンク（名前は黒、マウスを載せると緑の下線） |
| `.empty-state` / `.empty-state-title` | 空の状態：一覧に1件もない・検索に当てはまるものがないとき、表の代わりに置く（題名・説明・次にできる操作の `.row`）。文言は §8.4 |
| `.message-box` / `.message-title` | 画面の中に置く知らせ（淡い地と色の枠）。`.info`（説明。既定）・`.ok`（できた）・`.warn`（確かめて）・`.ng`（できなかった・入力の誤りのまとめ。`role="alert"`）。1行目を太字にするときは `p.message-title` |
| `.toast-region` / `.toast-list` / `.toast` / `.toast-text` / `.toast-close` | 画面の下に一時的に出す短い知らせ（保存・送信の結果）。React は `toast()`（§8.5）。`.toast.ng` は失敗（赤い地。閉じるまで残る） |

アプリの状態の名前（`approved` など）をそのままバッジの種類にしたいときは、アプリの CSS で `.badge.approved` などに ok / warn / ng と同じ色を当て、アプリのカタログに載せる（seeds-alumni-idaas の `web/src/design/app.css` が例）。

### 3.7 文書（規約へのリンク・お知らせ）

| クラス | 使う場面 |
|---|---|
| `.doc-links` | 規約・プライバシーポリシーなど文書へのリンクの箇条書き |
| `.notice` | お知らせ・改訂の通知の本文（淡い地。改行をそのまま表示、長い URL も折り返す） |
| `.prose` | 長い文章（Markdown を変換した本文・規約・お知らせ）。中の `h2`〜`h4`・段落・箇条書き・引用・`code`・`pre`・`hr`・画像・表（`.table-wrap`）の余白と見た目を整える。`h2` は下線つき。カードにするときは `.card.prose`、幅は `.container.reading` |

### 3.8 補助クラス（`utilities.css`）

インライン style の代わりに使う。ここに無い調整が必要になったら、補助クラスを足すより先に部品として足せないか考える。

| クラス | 効果 |
|---|---|
| `.muted` | 補足の文字色 |
| `.error` / `.ok` / `.warn` | エラー・成功・注意の文字色（メッセージ、`<p className="ok">保存しました。</p>`） |
| `.small` | 小さい文字（`.muted.small` で注記） |
| `.pre` | 改行をそのまま表示 |
| `.mt-md` | 上に余白（`--space-md`）。`dl` の直後のボタン行など |
| `.grow` | `.row` の中で残りの幅を使う入力欄（最小 16em） |
| `.w-name` | `.row` の中の短い入力欄（12em。名前・ラベルの入力） |
| `.visually-hidden` | 画面には出さず読み上げにだけ伝える（件数の「件」、アイコンだけの列の見出し「操作」など） |
| `.nowrap` | 折り返さない。表の会員番号・氏名・期など、狭い画面で1文字ずつ折り返して縦に伸びるのを防ぐ（表は `.table-wrap` で横スクロール） |

### 3.9 ダイアログ

**ブラウザの `confirm()` / `prompt()` / `alert()` は使わない**（見た目がブラウザごとに違い、デザインシステムから外れるため）。確認や1項目の入力は、アプリ内のダイアログで聞く。

React では `confirmDialog()` / `inputDialog()` を `await` し、クラスを直接は書かない。`<DialogHost />` は `<AppShell>` が1つ置いている（`<AppShell>` を使わないときは、画面の枠に自分で1つ置く）。

| クラス | 使う場面 |
|---|---|
| `.dialog` | 画面の中央に出す箱（`<dialog>` を `showModal()`。角丸 24px・`--shadow-popup`、後ろは `--color-backdrop` で暗くする）。Esc・背景のクリック・「キャンセル」で閉じる |
| `.dialog-actions` | 下の右寄せのボタン（左に「キャンセル」＝ `.button.secondary`、右に決定＝ `.button.primary.inline`、取り消せない操作なら `.button.danger.inline`） |

```tsx
import { confirmDialog, inputDialog } from '@seeds-alumni/ui';

if (!(await confirmDialog('この会員を停止しますか？', { title: '会員の停止', okLabel: '停止', danger: true }))) return;

const ended = await inputDialog({ title: 'SA 登録の解除', label: '終了日', type: 'date', initial: today() });
if (ended === null) return; // キャンセル
```

- 入力ダイアログは既定で必須（空欄では決定できない）。空欄を許すときは `optional: true`
- 確認の文は「〜しますか？」で終え、決定ボタンには操作の名前（「削除」「承認」）を書く

### 3.10 公開サイトの見た目（`data-look="site"`、`site.css`）

同窓会のホームページのような**公開サイトだけ**で使う見た目（2026-11-11、ユーザーの依頼）。マイポータル・管理画面・ツールでは使わない。

**使い方**：`<html lang="ja" data-look="site">` にし、`<head>` で Noto Sans JP を読み込む（共通 UI は Web フォントを配らない）。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap">
```

**`data-look="site"` で変わるもの**（クラスは同じ）：

| もの | アプリ | 公開サイト |
|---|---|---|
| ページの地（`--color-bg`） | 淡い深緑 | 白（ダークは #151716） |
| 書体（`--font-family`） | システムフォント | `--font-family-site`（Noto Sans JP）、字間 0.02em |
| ヘッダー（`.app-header`） | 高さ 56px・影あり | 高さ 72px・影なし（下の線だけ）。ロゴの画像は高さ 40px（狭い画面は 34px） |
| 題名の帯（`.page-head`） | 白い地・影 | 淡い灰色の地（`--color-band`）・影なし。題名は `--font-size-2xl` |
| 文章（`.prose`） | カード（`.card.prose`）に入れる | **カードに入れず**白い地に直接置く。h2 は大きく黒い下線、h3 は左に深緑の線 |
| フッター（`.app-footer`） | 白い地・上に線 | 淡い灰色の地。段組み（`.app-footer-nav`）と黒い帯（`.app-footer-bar`）を使う |

**決めごと**：

- **カード（`.card`・`.tile`・`section`）と影を使わない**。区切りは白と淡い灰色の帯（`.band` / `.band.soft`）の切り替えと罫線
- **色面は深緑だけ**。画面の端から伸びて角を1つだけ大きく丸める（`--radius-block`）。1ページに使うのは写真の後ろ（`.photo-block`）と案内の帯（`.color-band`）の2か所まで
- **リンクの目印は丸い矢印（`.arrow-dot`）にそろえる**。「→」の文字や別のアイコンを混ぜない
- 欧文の見出し（`.heading-en`）はトップの区画の見出しだけに使う（News・About など、区画の名前そのもの）
- 写真は実際の活動の写真を使う。生成した画像・飾りのイラストは入れない

| クラス | 使う場面 |
|---|---|
| `.band` / `.band.soft` | トップなどの区画（上下に大きな余白）。`soft` は淡い灰色の地。中に `.container.wide` を置く。色面（`.photo-block`・`.color-band`）が画面の端からはみ出す分をここで切るので、色面は必ず `.band` の中に置く |
| `.split` | 左に見出し（17rem）、右に中身の2段組み。980px 以下は縦に並ぶ |
| `.heading-en` / `.heading-ja` | 区画の見出し。欧文の大きい文字（`<p class="heading-en">News</p>`）の下に、短い線つきの日本語の見出し（`<h2 class="heading-ja">お知らせ</h2>`） |
| `.text-link` | 文字と丸い矢印のリンク（「すべてのお知らせ」など。中に `.arrow-dot.sm`） |
| `.arrow-dot` | 丸い矢印（深緑の丸に白い ›）。リンクの中に `<span class="arrow-dot" aria-hidden="true"></span>`。リンクにマウスを載せると右に少し動く |
| `.arrow-dot.sm` / `.arrow-dot.ink` / `.arrow-dot.on-solid` | 小さい（24px）／濃い灰色（目立たせない行）／色面の上（白い丸に深緑の ›） |
| `.link-list` / `.link-list.cols2` | 罫線で区切ったリンクの一覧（`ul.link-list > li > a`）。下層ページへの入口に、カード（`.tiles`）の代わりに使う。`cols2` は広い画面で2列 |
| `.link-list-title` / `.link-list-desc` | 一覧の1行の題名（太字）／その下の短い説明（なくてもよい）。行の右に `.arrow-dot` |
| `.quick-links` | 大きなリンクボタンの並び（`div.quick-links > a`。濃い灰色の地、右に `.arrow-dot`）。3つまで |
| `.quick-links a.main` | いちばん大事な1つ（深緑の地。矢印は `.arrow-dot.on-solid`） |
| `.photo-block` | 写真の後ろに、画面の左端から伸びる深緑の色面（`figure.photo-block > img + figcaption`）。写真は 16:9（狭い画面は 3:2）に切り抜く。切り抜く位置は使う側の CSS の `object-position` で決める |
| `.color-band` | 画面の右端まで伸びる深緑の色面。案内を左右に並べる（狭い画面は縦）。`.band` の中の `.container` に置く |
| `.color-band-item` / `.color-band-label` / `.color-band-link` | 色面の中の1つの案内（`h2` と `p`）／その上の小さい欧文のラベル／下線つきのリンク（中に `.arrow-dot.sm.on-solid`） |
| `.app-footer-nav` / `.app-footer-heading` | フッターの段組みのサイトマップ（`nav.app-footer-nav > div > p.app-footer-heading + ul`） |
| `.app-footer-bar` | フッターのいちばん下の黒い帯（著作権の行。`.app-footer-copy` の代わり） |

```html
<div class="band soft">
  <div class="container wide split">
    <div>
      <p class="heading-en">About</p>
      <h2 class="heading-ja">同窓会について</h2>
    </div>
    <ul class="link-list cols2">
      <li><a href="/about/overview"><span class="link-list-title">団体概要</span><span class="link-list-desc">名称・所在地・目的など</span><span class="arrow-dot" aria-hidden="true"></span></a></li>
    </ul>
  </div>
</div>
```

見本はデモの `/demo/site`（素の HTML）と Storybook の「画面の型 → 公開サイトのページ」。

### 3.11 管理コンソール（`console.css`）

画面が多い管理画面の枠（2026-11-12）。上のヘッダー（サイト名・「管理コンソール」の札・全体の検索・ヘルプ・お知らせ・ログイン中の人）、左のメニュー（まとまりごとの小さい見出し、いまの画面は淡いブランド色の地）、本文（淡い深緑の地に白いカード）。**色は「アプリ」の見た目のまま**（ヘッダーと左のメニューは白い面）。

React は `<ConsoleShell>`（§4・§4.6）を使い、クラスを直接は書かない。素の HTML は `demo/console.html` のマークアップと `js/console.js`（CDN の `/v1/console.js`）。

| クラス | 使う場面 |
|---|---|
| `.console` | 枠の一番外側（ヘッダー・左のメニュー・本文の格子）。`body` の直下に置く |
| `.console-header` / `.console-header-inner` | 上に固定するヘッダー（白い地、下に区切り線）。中は左から `.nav-toggle`（980px 以下だけ出る）・`.brand`・`.tag.brand`（「管理コンソール」）・`.env-badge`・`.console-search`・`.header-actions` |
| `.console-search` | ヘッダーの中央の全体の検索（`div.console-search[role=search] > .search-field`）。⌘K / Ctrl+K で入力欄に移る（右端に `.kbd` で案内）。640px 以下では隠す |
| `.console-sidebar` / `.console-sidebar.open` | 左のメニュー（`nav.console-sidebar[aria-label="メニュー"]`。白い地、右に区切り線、本文と別にスクロール）。980px 以下では隠し、`.nav-toggle` で `.open` を付けて引き出す |
| `.side-nav-group` / `.side-nav-label` | メニューのまとまり（`div.side-nav-group > p.side-nav-label + ul > li > a`）。項目は `a` の中に `svg`（20px のアイコン）と文字、右に件数の `.count`。いまの画面は `aria-current="page"` |
| `.console-scrim` | 左のメニューを引き出したときの後ろの幕（押すと閉じる）。`hidden` で隠しておく |
| `.console-main` | 本文（`main.console-main`。最大 `--layout-console`、左のメニューに寄せる）。中は `.headline` → `.toolbar` → `.table-card` か カード |

決めごと：

- 左のメニューは**2段まで**（まとまりの見出し → 項目）。項目は1つのまとまりに2〜6個。下の段（3段目）は作らず、画面の中のタブ（`.tabs`）か一覧で分ける
- 項目の名前は画面の題名（`.headline-title`）と同じにする。アイコンは Lucide から各アプリに写したものを使う（§3.12。共通 UI はアイコンを配らない）。アイコンだけのメニューにはしない
- ヘッダーの右は、ヘルプ・お知らせ（`.icon-button`）・ログイン中の人（`details.dropdown > summary.person` ＋ `.dropdown-menu.end` にログアウトなど）・表示の切り替えの順
- 1画面の中の構成は §8.1。公開サイトの部品（§3.10）は使わない

### 3.12 アイコン

アイコンは **Lucide**（https://lucide.dev/ ）にそろえる（2026-11-12、ユーザーの決定）。線で描いた 24px の枠のアイコンで、色は文字の色（`currentColor`）に従うので、§3.2・§3.11 の CSS とそのまま合う。

**取り込み方：依存に入れず、使う SVG だけを各アプリに写す**

- 共通 UI（このリポジトリ）はアイコンを配らない。アプリも `lucide-react` などのパッケージを依存に入れない（依存を小さく保つ。§1）
- SVG は版を固定した `lucide-static` から取る（例：`https://unpkg.com/lucide-static@1.61.0/icons/users.svg`。サイトの一覧で名前を探す）。どの版から写したかを、アイコンのファイルの先頭に書く
- アプリの中では1か所にまとめる。React は1つのファイル（例：`web/src/design/icons.tsx`）に、名前を付けて並べる（見本は `demo/icons.tsx`）。素の HTML はマークアップの中に `<svg>` を直接書く（見本は `demo/console.html`）
- **ほかのアイコンのセットと混ぜない**。Lucide に合うものがないときは、似た意味の Lucide のアイコンで代える。どうしても要るときだけ、同じ線の太さ・角の丸めで描き、そのファイルに「独自に描いたもの」と書く

**写すときに変えるもの・変えないもの**

| | 中身 |
|---|---|
| 変えない | 形（`path`・`circle`・`rect` などの中身）、`viewBox="0 0 24 24"`、`fill="none"`、`stroke="currentColor"`、`stroke-width="2"`、`stroke-linecap="round"`、`stroke-linejoin="round"` |
| 外す | `width`・`height`（大きさは CSS の `--icon-size` / `--icon-size-sm` が決める）、`class="lucide …"`、先頭の `<!-- @license … -->`（ライセンスはファイルの先頭とライセンスの文書に書く） |
| 足す | `aria-hidden="true"`・`focusable="false"`（飾りとして扱い、意味は文字か `aria-label` で伝える） |

React（JSX）では属性を `strokeWidth={2}` のように書き換える。色を付けたいときも SVG に色を書かず、置いた場所の文字の色（CSS）で決める。

**ライセンス**：Lucide は ISC（© Lucide Icons and Contributors）。一部（`download`・`plus`・`search`・`x`・`chevron-down` など）は Feather 由来で MIT（© Cole Bemis）。どちらも MIT のこのリポジトリ・各アプリと両立する。写したリポジトリには次の2つを置く。

1. Lucide の `LICENSE` の全文（ISC と、Feather 由来のアイコンの MIT の両方）を `LICENSE-lucide.txt` などとして置く（見本は `demo/LICENSE-lucide.txt`）
2. アイコンのファイルの先頭に、出どころ（Lucide・`lucide-static` の版）・ライセンス・1 の文書の場所を書く

**使い分け**（同じ意味には同じアイコン。アプリをまたいでそろえる）

| 意味 | Lucide の名前 |
|---|---|
| ダッシュボード | `layout-grid` |
| 会員・人の一覧 | `users` |
| 申請・審査待ち | `inbox` |
| 役職・タグ | `tag` |
| お知らせ（会員へ出すもの） | `megaphone` |
| メール | `mail` |
| ログイン方法・鍵 | `key-round` |
| 記録・文書 | `file-text` |
| 設定 | `sliders-horizontal` |
| ヘルプ | `circle-help` |
| 通知（運営へ届くもの） | `bell` |
| ダウンロード | `download` |
| 追加・作成・招待 | `plus` |
| 取り込む・アップロード | `upload` |
| 名簿 | `book-user` |
| 会員証（QR）の読み取り・受付 | `scan-line`（受付の画面）／`scan-qr-code`（QR を読む操作のボタン） |
| 連携アプリ | `plug` |
| Discord（SEEDS-CIRCLE）などのチャット | `messages-square`（Lucide にブランドのアイコンはない） |
| イベント | `calendar-days` |
| 編集 | `pencil` |
| 質問・アンケート | `list-checks` |
| 集計 | `chart-column` |
| 履歴 | `history` |
| 印刷 | `printer` |
| 複製 | `copy` |

ここにない意味のアイコンを新しく使ったら、この表に足す。

- アイコンだけで意味を伝えない（左のメニュー・ボタンには文字を添える。`.icon-button` は `aria-label`）
- 1つのボタンにアイコンは1つまで、文字の左に置く。主要な操作のボタン以外には付けすぎない
- 検索欄の虫めがね（`--icon-search`）だけは共通 UI の CSS が持つ（マークアップにアイコンを書かずに済むように。Lucide を写したものではなく、独自に描いたもの）
- ライト・ダークの切り替え（`.theme-toggle`）・ハンバーガーメニュー（`.nav-toggle`）・公開サイトの丸い矢印（`.arrow-dot`）など、共通 UI が CSS や `theme.js` で描くものはそのまま使い、Lucide に置き換えない

## 4. React の部品と画面の型

`import { AppShell, Card, ListLayout, … } from '@seeds-alumni/ui'`。部品は**画面の骨組み**だけで、中身（`dl`・`table`・ボタン）は §3 のクラスで組む。Storybook に部品ごとの見本、デモに画面の型の見本がある。

| 部品 | 作るもの | 使う場面 |
|---|---|---|
| `<AppShell title href wide? envLabel? actions? tabs?>` | ヘッダー＋`main`＋`<DialogHost>` | 画面の一番外側。会員向けは幅 640px、`wide` で管理画面の 1200px。`tabs` で上にタブ |
| `<ConsoleShell title href nav label? envLabel? mark? logoSrc? search? actions? navFooter?>` | `.console`（ヘッダー＋左のメニュー＋`main.console-main`）＋`<DialogHost>`・`<ToastHost>` | 管理コンソールの一番外側（§3.11）。`nav` は `{ label?, items: { label, href, icon?, current?, count? }[] }[]`（まとまりの配列）。`search` はヘッダーの中央の `.search-field`、`actions` はヘッダーの右（`.icon-button`・ログイン中の人の `.dropdown`） |
| `<PageHeader breadcrumb? title count? description? actions?>` | `.headline` | 管理コンソールの各画面の一番上（パンくず → 題名＋件数・説明、右に画面全体の操作） |
| `<CollectionLayout views? filters? search? onSearch? applied? selection? summary? tools? notice? empty? pager?>` | `.toolbar`（`.segmented`・`form.toolbar-group`）＋`.filter-tags`＋`.table-card` | 管理コンソールの一覧（§4.6・§8.1）。`views` は `{ label, count?, href?, onSelect?, active? }[]`、`selection` は `{ count, actions?, onClear }`（選んでいるあいだ表の上の帯が一括操作に変わる）、`empty` を渡すと表の代わりに出す |
| `useSelection(keys)` | — | 一覧で行を選ぶ状態。`allProps`（見出しのチェックボックス。一部だけなら「−」）・`rowProps(key, label)`・`count`・`selected`・`clear()`。表示中の行が変わったら選択を外す（§8.1） |
| `rowClick(open)` | — | 行全体を押して詳細へ（`<tr className="clickable" onClick={rowClick(() => …)}>`）。行の中のリンク・ボタン・チェックボックスを押したとき、文字を選んでいるときは進まない |
| `toast(message, { kind? })` / `<ToastHost>` | `.toast-region` | 短い知らせ（§8.5）。`<AppShell>`・`<ConsoleShell>` が `<ToastHost>` を置く |
| `useDropdownDismiss()` | — | ドロップダウン（`details.dropdown`）を外を押す・Esc で閉じる。`<AppShell>`・`<ConsoleShell>` が呼ぶので、どちらも使わない画面の枠でだけ呼ぶ |
| `<AppHeader title href wide? envLabel? mark? logoSrc? nav? navFooter?>` | `.app-header`（`nav` があれば `.header-nav` とハンバーガーメニュー） | `<AppShell>` を使えないときだけ直接使う。`nav`（`{ label, href, active?, current?, children? }` の配列）を渡すと、広い画面では横に並べ、980px 以下ではハンバーガーメニューにする。`navFooter` はメニューの下の操作（ログインのボタンなど）。`<AppShell>` にも同じ props を渡せる |
| `<Tabs items>` | `nav.tabs` | 画面の切り替え（`{ href, label, active }`） |
| `<Card title? level? actions? tone?>` | `section` | 1つの目的ごとに1枚。見出しの右に `actions`（バッジ・リンク）。`tone="warn"` で注意のカード |
| `<ListLayout title filters onSearch summary tools notice pager>` | カード＋`form.filters`＋`.table-wrap`＋`<Pager>` | 一覧の画面（検索 → 件数と操作 → 表 → ページ送り）。タブの枠（`<AppShell wide tabs>`）の管理画面で使う。管理コンソールでは `<CollectionLayout>` |
| `<DetailLayout back title status summary>` | `.back-link`＋基本情報のカード＋続くカード | 詳細の画面。続く操作は `<Card level={3}>` を並べ、取り消せない操作は最後 |
| `<Tiles items>` | `.tiles` / `.tile` | ダッシュボードの数値（`href` があれば一覧へのリンク） |
| `<Field label optional? hint? error? as?>` | `.form-field` | フォームの1項目（`.form` の中に並べる） |
| `<Badge kind>` | `.badge` | 状態（`ok` / `warn` / `ng` / `none`）。必ず文字を入れる |
| `<Pager total page pageSize onPage>` | `.pager` | ページ送り（`<ListLayout pager>` が置く） |
| `confirmDialog()` / `inputDialog()` / `<DialogHost>` | `.dialog` | 確認と1項目の入力（§3.9） |
| `<ThemeToggle>` / `<EnvBadge label>` | `.theme-toggle` / `.env-badge` | `<AppHeader>` が置く |
| `currentTheme()` / `setTheme()` / `THEME_RESTORE_SCRIPT` | — | 表示の切り替えを自分で作るとき、`<head>` のちらつき防止 |

### 4.1 会員向けのページ

```tsx
<AppShell title="SEEDS-ID マイポータル" href="/" actions={<button className="link" onClick={logout}>ログアウト</button>}>
  <Card title="登録情報">
    <dl><dt>会員番号</dt><dd>15001</dd></dl>
    <div className="row mt-md"><button className="button secondary">登録情報を変更</button></div>
  </Card>
</AppShell>
```

- 1つの目的ごとにカードを1枚。サイト名はヘッダーにあるので、カードの見出しは h2（`level` の既定）
- 読み込み中は `<p className="muted">読み込み中…</p>`、エラーは `<p className="error">…</p>`

### 4.2 管理画面の一覧

```tsx
<ListLayout
  title="会員"
  filters={<><input aria-label="検索" placeholder="氏名・会員番号" value={q} onChange={(e) => setQ(e.target.value)} /><button className="button">検索</button></>}
  onSearch={search}
  summary={`${total}件`}
  tools={<button className="button small-btn">CSV で保存</button>}
  pager={{ total, page, pageSize, onPage: setPage }}
>
  <table>
    <thead><tr><th>会員番号</th><th>氏名</th><th>状態</th></tr></thead>
    <tbody>
      {rows.map((u) => (
        <tr key={u.id} className="clickable" onClick={() => (location.hash = `#/users/${u.id}`)}>
          <td className="nowrap">{u.number}</td><td className="nowrap"><a href={`#/users/${u.id}`}>{u.name}</a></td><td><Badge kind="ok">利用中</Badge></td>
        </tr>
      ))}
    </tbody>
  </table>
</ListLayout>
```

### 4.3 管理画面の詳細

```tsx
<DetailLayout back={{ href: '#/users', label: '会員一覧' }} title="15001：山田 太郎" status={<Badge kind="ok">利用中</Badge>} summary={<dl>…</dl>}>
  <Card title="所属・役割" level={3}>…</Card>
  <Card title="例外的な操作" level={3}>…<button className="button danger inline">停止</button></Card>
</DetailLayout>
```

### 4.4 ダッシュボード

```tsx
<Tiles items={[{ label: '審査待ちの申請', value: 3, href: '#/applications' }, { label: '送信に失敗したメール', value: 0 }]} />
```

### 4.5 フォーム

```tsx
<form className="form" onSubmit={submit}>
  <Field label="氏名"><input required value={name} onChange={(e) => setName(e.target.value)} /></Field>
  <Field label="現在の所属" optional hint="登録後もマイポータルで変更できます。" error={errors.affiliation}><input … /></Field>
  <button className="button primary">申請</button>
</form>
```

### 4.6 管理コンソール

```tsx
<ConsoleShell
  title="SEEDS-ID" label="会員管理システム" href="#/" envLabel={envLabel}
  nav={[
    { items: [{ label: 'ダッシュボード', href: '#/', icon: <DashboardIcon />, current: route === '' }] },
    { label: '会員管理', items: [
      { label: '会員', href: '#/members', icon: <UsersIcon />, current: route === 'members' },
      { label: '申請審査', href: '#/applications', icon: <InboxIcon />, count: 3 },
    ] },
  ]}
  search={<span className="search-field"><input type="search" aria-label="設定・会員を検索" placeholder="設定・会員を検索" /><kbd className="kbd">Ctrl K</kbd></span>}
  actions={<details className="dropdown"><summary className="person" aria-label="アカウントのメニュー">…</summary><div className="dropdown-menu end"><button type="button" onClick={logout}>ログアウト</button></div></details>}
>
  <PageHeader breadcrumb={[{ label: '会員管理', href: '#/members' }, { label: '会員' }]} title="会員" count={total}
    description="会員と、ログイン・利用の状態を管理します。"
    actions={<><button className="button secondary">CSV をダウンロード</button><button className="button primary inline">会員を招待</button></>} />
  <CollectionLayout
    views={[{ label: 'すべて', count: total, active: view === 'all', onSelect: () => setView('all') }, …]}
    filters={<details className="dropdown"><summary className="button ghost has-caret">期</summary><div className="dropdown-menu">…label.check…</div></details>}
    search={<span className="search-field"><input type="search" aria-label="会員を検索" value={q} onChange={…} /></span>}
    onSearch={search}
    applied={filtering && <>…<button className="filter-tag" …>期：1期</button><button className="link" onClick={clearAll}>すべて外す</button></>}
    selection={{ count: sel.count, onClear: sel.clear, actions: <button className="button small-btn" onClick={suspend}>停止</button> }}
    summary={`${rows.length} 件`}
    empty={rows.length === 0 ? <div className="empty-state">…</div> : undefined}
    pager={{ total, page, pageSize, onPage: setPage }}
  >
    <table>
      <thead><tr>
        <th className="check-cell"><input type="checkbox" {...sel.allProps} /></th>
        <th aria-sort={sortOf('name')}><button type="button" className="sort" onClick={…}>氏名</button></th>
        <th>状態</th>
      </tr></thead>
      <tbody>{rows.map((r) => (
        <tr key={r.id} className={sel.isSelected(r.id) ? 'clickable selected' : 'clickable'} onClick={rowClick(() => open(r.id))}>
          <td className="check-cell"><input type="checkbox" {...sel.rowProps(r.id, `${r.name}を選ぶ`)} /></td>
          <td><a className="person" href={`#/members/${r.id}`}><span className="avatar" aria-hidden="true">{r.name[0]}</span><span className="person-text"><span className="person-name">{r.name}</span><span className="person-sub">{r.email}</span></span></a></td>
          <td><span className={`status-dot ${r.status}`}>{label[r.status]}</span></td>
        </tr>
      ))}</tbody>
    </table>
  </CollectionLayout>
</ConsoleShell>
```

- 設定の画面は `<PageHeader>` の下に `<Card>` を並べ、中を `form.form.aligned` と `.form-actions` で組む（§8.3）
- 詳細の画面は `<PageHeader breadcrumb>` か `<DetailLayout back>` のどちらかにそろえる（アプリの中で混ぜない）
- 見本はデモの `/demo/react#console/members`（React）・`/demo/console`（素の HTML）と、Storybook の「画面の型 → 管理コンソールの一覧」など

## 5. アクセシビリティ

- 文字と背景のコントラストは WCAG AA（4.5:1）以上。トークンの色を変えるときはライト・ダークの両方で確かめる
- 入力欄の枠など、画面を読み取るのに必要な線は 3:1 以上（`--color-border`）。淡い線（`--color-border-soft`）は、文字だけで押せると分かるボタンなどに限る
- フォーカスは `--focus-ring`（白・緑・白の二重の輪。ボタン・リンクは `:focus-visible`、入力欄は `:focus` で枠も緑。`base.css`）。`outline` は消さず透明にする（Windows のハイコントラスト表示で見えるように）。ほかに `outline: none` を書かない
- 入力欄は `label` の中に入れるか、`aria-label` を付ける
- 状態は色だけで伝えない（バッジ・メッセージには必ず文字を入れる）
- 押せる要素は `button` か `a` にする（`div` に `onClick` を付けない。表の行 `tr.clickable` は例外。その行の中にも同じ行き先のリンクを置く）
- アイコンだけのボタン（`.icon-button`）・チェックボックスの列・検索欄には `aria-label` を付ける（「ヘルプ」「山田 太郎を選ぶ」「会員を検索」）。アイコンの `svg` は `aria-hidden="true"`
- 並べ替えられる列は `th[aria-sort]`、選んでいる表示の切り替えは `aria-current="page"` か `aria-pressed="true"`。どれも見た目は CSS が属性から付けるので、クラスで真似しない
- 誤りのある入力欄は `aria-invalid="true"`。送信の結果は `toast()`（読み上げの領域に入る）、入力の誤りのまとめは `.message-box.ng[role=alert]`

## 6. ルール（`seeds-ui-check` が確かめる）

使う側のアプリでも CI で実行する（`docs/usage.md`）。

- インライン `style={{ … }}` / `style="…"` を書かない
- 色の値（`#1a5fb4`、`rgb(…)`、`hsl(…)`）をトークンのファイル以外に書かない
- 定義されていないトークン（`var(--…)`）・CSS にないクラスを使わない
- CSS はアプリの CSS のフォルダにだけ置き、アプリの CSS のクラス・トークンはアプリのカタログに載せる
- ブラウザの `confirm()` / `prompt()` / `alert()` を使わない（§3.9）
- 文言に避ける言い方（「〜することができます」「〜が可能です」「〜を行う」「こちら」「正常に」「下さい」「いたします」など。`docs/writing.md` §4 の★）を使わない。確かめるフォルダは `--writing-src` で変えられる（既定は `--src`）。どうしても要る行には `writing-ok` と書く

**検出はしないが守ること**

- 余白・角丸・文字サイズに生の値（`13px`、`0.9rem`）を書かず、トークンを使う（例外：線の太さ `1px`・`2px`、`em` 単位の入力欄の幅）
- 状態の表示には `.badge` を使い、独自の色付きラベルを作らない
- 画面の文言は日本語で、`docs/writing.md`（UI の日本語の書き方）に従う。ボタンは短い漢語で終える（「承認」「変更を保存」）

**理解の確認（AI に聞く質問）**

1. 申請の状態「審査中」を表示するときのマークアップは？ → `<Badge kind="warn">審査中</Badge>`（アプリが `.badge.pending` を足していれば `kind="pending"`）
2. 取り消せない主要操作のボタンと、却下ボタンのクラスは？ → `button primary inline` と `button danger inline`
3. 管理画面の一覧の画面はどう組む？ → タブの枠なら `<ListLayout>` に `filters`・`summary`・`pager` を渡し、中に `table`（行は `tr.clickable`）。管理コンソールなら `<PageHeader>` ＋ `<CollectionLayout>`（§4.6）
4. 一覧の「ロール」の列の「メンバー」と、「状態」の列の「停止中」のマークアップは？ → `<span class="tag">メンバー</span>`（分類）と `<span class="status-dot ng">停止中</span>`（状態）
5. 検索して1件もないときは？ → 表の代わりに `.empty-state`（「条件に当てはまる会員はいません」＋「条件をすべて外す」）。まだ1件も作っていないときとは文言を分ける（§8.4）

## 7. 変更の手順

- **トークンを足す・変える**：`css/tokens.css`（色は `light-dark()` でダークも）→ §2 の表
- **クラスを足す**：`css/components.css`（公開サイトだけの部品は `css/site.css`）→ §3 に「クラス・使う場面・例」。似た部品が既にないか先に探す。1つのアプリだけで使うものは、そのアプリの CSS に置く
- **React の部品を足す**：`src/` → `src/index.ts` で書き出す → §4 の表 → `stories/` に見本。骨組みの部品だけを足し、細かい見た目の部品は作らない
- 最後に `npm run check`・`npm run typecheck`・`npm run build`（`dist/` も Git に入れる）。見た目は Storybook とデモで、ライト・ダーク・スマートフォンの幅を確かめる
- **版**：変更を main に入れたら `package.json` の `version` を上げ、`v1.2.3` のタグを付ける（`docs/deploy.md`）。使う側は版を指定して取り込むので、勝手には変わらない。表示が変わる変更（クラスの削除・トークンの意味の変更）は大きい版（v2）にする

## 8. 画面の組み方の決めごと

画面を新しく作るときは、まずここに当てはめる。部品の名前は §3・§4。

### 8.1 一覧（コレクション）の画面

ものの一覧を出し、探して、1件ずつの画面（詳細）へ進む画面。上から次の3つの場所に分ける。

1. **画面全体への操作**（`.headline-actions`）：新しく追加・招待・取り込み・ダウンロードなど、絞り込みに関係ない操作。主要な操作（`.button.primary`）は1つで、いちばん右
2. **探す場所**（`.toolbar`）：左に表示の切り替え（`.segmented`。状態ごとの件数つき）、右に絞り込み（`.dropdown`）と検索（`.search-field`）。適用中の条件は下に `.filter-tags`
3. **一覧**（`.table-card`）：上の帯（件数・選んでいる行への一括操作）→ 表 → ページ送り

表の決めごと：

- 1行目の列は、そのものを見分ける名前（氏名・題名）。`a.person` か `a` にして詳細へのリンクにする。行全体を押しても進めてよい（`tr.clickable` ＋ `rowClick()`）
- 並べ替えは、比べる意味のある列（名前・番号・日時・数値）に付ける。どの列で並べているかを必ず見せる（`aria-sort`）。既定の並びは、運営がいちばん使う順（新しい順など）
- 一括操作があるときだけ、左端にチェックボックスの列を置く。見出しのチェックボックスは**表示中の行だけ**を選ぶ。絞り込み・並べ替え・ページ送りをしたら選択を外す（`useSelection()` がする）。取り消せない一括操作（停止・削除）は `confirmDialog({ danger: true })` で件数を書いて確かめる
- 行の中の操作（`.actions-cell`）は1〜2個まで。同じことは詳細の画面でもできるようにする
- 状態は `.status-dot`、分類（ロール・区分）は `.tag`。数値は右にそろえ（`.num`）、日時は「2026/10/27 03:37」の形でそろえる。値がないところは「—」（`.muted`）
- 件数が多いときはページ送り（`<Pager>`。既定は20件）。下へ送ると読み込み続ける形（無限スクロール）にはしない（どこまで見たか分からなくなり、フッターにたどり着けない）
- 列が多くて入らないときは表を横にスクロールさせる（`.table-wrap`）。列を勝手に隠さない

### 8.2 検索と絞り込み

- **検索は1つの欄**（`.search-field`）で、何で探せるかを `placeholder` に書く（「氏名・会員番号・メールアドレス」）。欄の名前は `aria-label`（「会員を検索」）
- サーバーに問い合わせる検索は **Enter で実行**する（`<form role="search">`。`<CollectionLayout onSearch>`）。手元にあるデータを絞るだけなら、打つたびに絞ってよい
- **よく使う条件は表示の切り替え**（`.segmented`：すべて・利用中・停止中）にして、件数を添える。件数は、ほかの条件で絞ったうえでの数にする
- それ以外の条件は**ドロップダウン**（`details.dropdown`）にまとめ、選択肢はチェックボックス（`label.check`）。選んでいる間はボタンを `.applied` にして選んだ数を出す
- 適用中の条件は `.filter-tags` に並べ、1つずつ外せるようにし、「すべて外す」を置く。条件はできるだけ URL（`?status=ok&cohort=1`・`#/members?…`）に残し、再読み込み・戻る・共有で同じ一覧が出るようにする
- 条件を変えたら1ページ目に戻す。0件のときは §8.4
- ヘッダーの全体の検索（`.console-search`）は、画面・設定・会員を名前で探して移るためのもの。一覧の中を絞る検索は、その一覧の `.toolbar` に置く（2つを兼ねない）

### 8.3 フォーム

- **組み方は2つ**：縦（`.form`。会員向け・一度きりの申請、項目の説明を丁寧に書く）と横並び（`.form.aligned`。管理画面の設定など、何度も使い項目が多いもの）。1つのアプリの中で同じ種類の画面は同じ組み方にそろえる
- ラベルと入力欄は必ず結び付ける（`label` で包む・`<Field>`）。入力欄が複数あるときは `fieldset` ＋ `legend`、表の中で行ごとに入力するときは `aria-label`（「2行目の終了日」）
- 必須の項目を先に、任意の項目を後に並べる。任意の項目はラベルに「（任意）」
- **書き方は入力の前に分かるように**：ラベル・補足（`hint`）に形を書く（「ハイフンなしの7桁」）。`placeholder` は入力例・検索の対象だけに使い、必要な説明を `placeholder` に書かない（入力すると消え、文字も淡い）。全角・半角やハイフンの有無は、受け取る側で直す
- **自分の情報を入れるフォーム**（会員の申請・登録情報）は `autocomplete`（`name`・`email`・`tel` など）を付ける。**ほかの人の情報を入れるフォーム**（管理画面での会員の編集）は `autocomplete="off"`
- **送信中**は送信ボタンと、ほかの操作のボタンを `disabled` にし、ボタンの文字を「保存しています…」にする（二重に送らない）
- **送信の結果**：できたら `toast('設定を保存しました。')`（または詳細の画面へ移る）。できなかったら `toast('保存できませんでした。…', { kind: 'ng' })` で気付かせ、**誤りの内容は項目の直後**（`<Field error>`・`aria-invalid`）に書く。項目が多いフォームは、上に `.message-box.ng[role=alert]` で誤りの一覧も出す
- 入力の確かめは**送信したとき（または欄を離れたとき）**に出す。打っている途中に赤くしない。確かめはサーバーでも必ず行い、画面での確かめは入力の手助けと考える。送信ボタンを「誤りがあるあいだ押せない」にはしない（何が足りないか分からなくなる。するならボタンの近くに理由を書く）
- 長いフォームは `.form-actions.sticky` で送信ボタンを画面の下に貼りつける

### 8.4 空の状態

一覧に出すものがないときは、表を空のまま出さず、表の代わりに `.empty-state` を置く。理由で文言を分ける。

| 場合 | 題名（`.empty-state-title`） | 説明と操作 |
|---|---|---|
| まだ1件もない | 「お知らせはまだありません」 | 何ができるか・作るとどうなるか。操作は「お知らせを作成」（`.button.primary`。画面の見出しの主要な操作と同じ） |
| 検索・絞り込みに当てはまらない | 「条件に当てはまる会員はいません」 | 「検索の言葉を変えるか、絞り込みの条件を外してください。」。操作は「条件をすべて外す」（`.button.secondary`） |
| 権限がない・読み込めない | 「会員の一覧を表示できません」 | 理由と、次にすること（管理者に頼む・再読み込み）。エラーは `.message-box.ng` でもよい |

飾りの絵は入れない（§3.10 と同じく、生成した画像・イラストを使わない）。

### 8.5 知らせの使い分け

| 伝えること | 使うもの | 消え方 |
|---|---|---|
| 操作の結果（保存した・送った・失敗した） | `toast()`（`.toast`。失敗は `kind: 'ng'`） | 成功は5秒で消える。失敗は × で閉じるまで残る |
| 画面を見ている間ずっと知っておくこと（説明・注意・取り込みの結果・入力の誤りのまとめ） | `.message-box`（`.info` / `.ok` / `.warn` / `.ng`） | 消えない（状況が変わったら消す） |
| 1つの欄の誤り | 欄の直後の `.error.small`（`<Field error>`）＋ `aria-invalid` | 直したら消す |
| 続ける前に確かめること（取り消せない操作） | `confirmDialog()`（§3.9） | 答えるまで閉じない |
| 状態（ものがいまどうなっているか） | `.badge` / `.status-dot` | — |

- `toast()` に大事なこと・あとで読み返すことを書かない（消えてしまう）。リンクやボタンも入れない
- 文は「〜しました。」「〜できませんでした。〜してください。」。失敗の文には、次に何をすればよいかを書く

### 8.6 文言

言葉の決まり（文体・記号・ボタン・エラー・用語の統一）は **`docs/writing.md`** が正。ここには部品の組み方にかかわることだけを書く。

- ボタンは短い語にし、漢語で終える（「保存」「変更を保存」「会員を招待」「CSV をダウンロード」）。漢語のない操作は動詞のまま（「閉じる」「申し込む」）。「OK」「はい」だけにしない
- 件数は「63 件」「3 人」。選んでいる数は「2 件を選択中」
- 日時は「2026/10/27 03:37」、日付は「2026/10/27」。相対的な言い方（「3日前」）は補足にとどめる
- 同じものに同じ名前を使う（左のメニュー・画面の題名・パンくず・ボタン）。サービスをまたいだ用語は `docs/writing.md` §5・§6
