# カタログ（@seeds-alumni/ui）

SEEDS同窓会のサービス（会員ポータル・会員管理システム・SEEDS TOTP など）で共通に使う見た目のルール。**人と AI（Claude Code など）の両方が読む前提**で書いている。
画面を作る・直すときは、この文書の「React の部品と画面の型」（§4）と「クラス」（§3）から選び、新しい見た目を作らない。

- 実装：`css/`（`tokens.css` → `base.css` → `components.css` → `utilities.css` の順に `index.css` で読み込む）、`src/`（React の部品）、`js/theme.js`（素の HTML 向けの表示の切り替え）
- 導入のしかた：`docs/usage.md`（React のアプリ・素の HTML・CDN）
- 見本：Storybook（部品ごと）とデモ（画面の型）。公開先は `docs/deploy.md`
- 検査：`seeds-ui-check`（§6。このリポジトリでは `npm run check`）。カタログと CSS が食い違うと失敗する

## 1. 原則

**作り込みすぎない**：細かい部品をたくさん持つデザインシステムは、作るのも保守するのも手間がかかる。少人数の運営で続けられるよう、共通にするのは次の3つに絞る（大阪公立大学の共通フロントエンドライブラリの考え方を参考にした。[記事](https://zenn.dev/omu_tryangle/articles/29115afcef04eb)）。

1. **トークンと CSS**：色・余白・角丸などの値と、素の HTML でも使えるクラス（§2・§3）
2. **画面の骨組みの React の部品**：画面の枠・カード・一覧・詳細・ダッシュボード・フォームの1項目（§4）。細かい見た目はクラスで組む
3. **小さな共通処理**：表示の切り替え、アプリ内のダイアログ

**値の決め方は freee の [vibes](https://github.com/freee/vibes)（Apache-2.0）にならう**。パッケージは入れず、考え方と値の決め方だけを取り込み、ブランド色の深緑を当てはめている：

- **地と面**：ページの地は淡い深緑（vibes の P01 に当たる）、その上に白いカードを影で浮かせる。カードの中で文を載せる淡い地（コラム）は温かみのある灰色（S01）
- **色の段階と意味**：深緑を淡い（01）〜濃い（10）の段階で考え、役割ごとに使う段階を決める（§2.1）。リンク・ボタンは G07、現在地（選択中のタブ）・フォーカスは G05、マウスを載せたときの地は G02
- **コントラスト**：文字は 4.5:1 以上、入力欄の枠など画面を読み取るのに必要な線は 3:1 以上
- **影は3段階**：カード（`--shadow-card`）→ 浮かせる要素（`--shadow-float`）→ ダイアログ（`--shadow-popup`）
- **角丸は役割で決める**：小さい部品 4px、ボタン・入力欄 8px、カード 12px、ダイアログ 24px
- **フォーカスは二重の輪**：内側から白・ブランド色・白（どの地の上でも見える）
- **部品の見た目**：ボタンは太字、マウスを載せると淡いブランド色の地。タブは下線で現在地を示す。状態のバッジは枠つき（vibes の StatusIcon）。注意の箱は色の枠と淡い地（MessageBlock）

そのうえで守ること：

1. **読みやすさ・押しやすさ優先**：利用者は同窓生（スマートフォンが多い）と少人数の運営。装飾より、文字の大きさ・余白・押せる場所の分かりやすさを優先する。入力欄とボタンは同じ高さ（40px）にそろえる
2. **深緑がブランド色**：リンク・主要なボタン・選択中のタブ・フォーカスは深緑（`--color-brand*`）。成功（`--color-success`）は少し明るい緑で区別する。それ以外の色は「注意・危険」などの意味だけに使う。色だけで状態を伝えず、必ず文字を添える
3. **線より面と影で区切る**：カードは枠線ではなく白い面と影で地から浮かせる。線は区切り線（`--color-divider`）と入力欄・ボタンの枠（`--color-border` / `--color-border-soft`）、状態を示す枠（`--color-*-line`）だけ
4. **ライト・ダークの両対応**：色はトークン経由でだけ使う。初めは OS の設定に従い、ヘッダーのボタンで切り替えられる（`localStorage` の `theme`。同じドメインのサービスで表示がそろう）
5. **部品を増やす前に組み合わせる**：既存の部品と補助クラスで足りないときだけ部品を追加する（§7）。1つのアプリだけで使う見た目は、そのアプリの CSS に置く
6. **依存を小さく**：UI ライブラリ・CSS-in-JS・Tailwind は使わない。外部ライブラリは保守が止まると危険になり、画面を重くし、中のバグに手が出せないため。React の部品の実行時の依存は React だけ。Storybook などは開発のときだけ使う

## 2. デザイントークン

すべて `css/tokens.css` に定義する（アプリ固有のトークンはアプリのトークンのファイルに）。色は `light-dark(ライト, ダーク)` で1行に書く。どちらの値が使われるかは `color-scheme` で決まり、既定は OS の設定、`<html data-theme="light|dark">` で固定する（React は `<ThemeToggle>`、素の HTML は `js/theme.js` が切り替え、`localStorage` の `theme` に残す。描画の前に戻すスクリプトを `<head>` に置くので、ちらつかない。`docs/usage.md`）。vibes にはダークがないので、ダークの値は同じ考え方で独自に決めた。

### 2.1 色

| トークン | ライト | ダーク | 使う場面 |
|---|---|---|---|
| `--color-bg` | #f1f6f3 | #121413 | ページの地（淡い深緑。vibes の P01 に当たる） |
| `--color-surface` | #ffffff | #1d201e | カード（`section`、`.tile`）・ダイアログ・候補リスト。`--shadow-card` で浮かせる |
| `--color-field` | #ffffff | #161817 | 入力欄・標準ボタン・`.choice`・カードの中の箱（`.box`） |
| `--color-column` | #f7f5f5 | #252826 | カードの中で文を載せる淡い地（vibes の S01）。表の見出しの行、`.notice` |
| `--color-hover` | #ecf4ef | #26302a | 表の行・タブ・タイルにマウスを載せたとき（ブランド色 6%） |
| `--color-header` | 白 92% | カードの色 92% | 上部のヘッダー（半透明＋ぼかし） |
| `--color-backdrop` | 黒 50% | 黒 65% | ダイアログの後ろを暗くする（`.dialog::backdrop`。vibes の scrim） |
| `--color-text` | #323232 | #e3e5e3 | 本文（vibes の GY7） |
| `--color-text-strong` | #1e1e1e | #f5f6f5 | 見出し・ラベル・数値 |
| `--color-text-muted` | #6e6b6b | #a3a7a4 | 補足・表の見出し・`dt`（`.muted`。vibes の S9） |
| `--color-divider` | #e9e7e7 | #2f3431 | 区切り線（表の行、ヘッダーの下、タブの下。vibes の S3） |
| `--color-border` | #8c8989 | #6b716d | 入力欄の枠（白に対して 3:1 以上。vibes の S8） |
| `--color-border-soft` | #dcdcdc | #3d433f | 標準ボタン・`.choice` の枠（文字が太字なので淡い線でよい。vibes の GY02） |
| `--color-brand` / `--color-brand-hover` | #1d5c3f / #163d2b | #8cc7a8 / #b4dcc6 | リンク・選択中の文字（G07）／マウスを載せたとき（G09） |
| `--color-brand-solid` / `--color-brand-solid-hover` | #1d5c3f / #163d2b | #2f6a4e / #3a7d5d | 主要ボタン（`.button.primary`）の地、ロゴ |
| `--color-brand-current` | #2b7553 | #8cc7a8 | 現在地（選択中のタブの下線）・フォーカスの輪（G05。vibes の P5 の役割） |
| `--color-brand-tint` | #dcebe2 | #24382c | 標準ボタン・`.choice`・表示切り替えにマウスを載せたときの地（G02） |
| `--color-on-solid` | #ffffff | #ffffff | brand-solid・danger-solid・env の上の文字 |
| `--color-logo-bg` | #ffffff | #ffffff | ロゴの地（`img.brand-mark`）。ロゴは白い地に置く決まりなので、ダークでも白 |
| `--color-success` / `--color-success-line` / `--color-success-soft` | #18794e / #2b7553 / #e3f2e9 | #5fd59a / #3d9b6c / #1d3527 | 完了・一致・承認済み・利用中（文字／枠／地） |
| `--color-warning` / `--color-warning-line` / `--color-warning-soft` | #825a0f / #be8c14 / #fff0d2 | #f2c66d / #a87c1c / #3a2f17 | 要確認・部分一致・審査中・仮番号（vibes の YE10 / YE7 / YE02） |
| `--color-danger` / `--color-danger-line` / `--color-danger-soft` | #a51428 / #dc1e32 / #fad2d7 | #ff8a96 / #e0505e / #45202a | エラー・不一致・却下・停止（vibes の RE7 / RE5 / RE02） |
| `--color-danger-solid` / `--color-danger-solid-hover` | #dc1e32 / #a51428 | #c13a44 / #d14b55 | 取り消せない操作のボタン（`.button.danger`）の地（RE5 → RE7） |
| `--color-neutral-line` | #8c8989 | #6b716d | 既定のバッジ（`.badge.none` など）の枠 |
| `--color-env` | #d9480f | （同じ） | 環境バッジ専用（本番以外であることを示す） |

### 2.2 文字

| トークン | 値 | 使う場面 |
|---|---|---|
| `--font-family` | -apple-system、Helvetica Neue、ヒラギノ角ゴ、游ゴシック、メイリオ、Noto Sans JP ほか（vibes の順） | すべて（Web フォントは読み込まない） |
| `--font-size-xs` | 0.75rem | バッジ・表の見出し・環境バッジ |
| `--font-size-sm` | 0.875rem | 補足（`.small`）、表、`dt`、タブ、小さいボタン |
| `--font-size-base` | 1rem | 本文・h3（vibes の本文は 14px だが、スマートフォンで読む会員が多いので一回り大きく） |
| `--font-size-lg` | 1.125rem | カードの見出し（h2）、ヘッダーの名前 |
| `--font-size-xl` | 1.5rem | ページの見出し（h1、`.page-title`） |
| `--font-size-display` | 2rem | ダッシュボードの数値（`.tile-value`） |
| `--font-weight-medium` | 500 | 表の中のリンク |
| `--font-weight-bold` | 700 | 見出し・ラベル・バッジ・ボタン・タブ（vibes は bold） |
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
| `--radius-sm` | 4px | バッジ・小さいボタン・候補（vibes の「余白の小さい部品」） |
| `--radius-md` | 8px | 入力欄・ボタン・タブ（上だけ）・`.box`・`fieldset`・ヘッダーのロゴ |
| `--radius-lg` | 12px | カード（`section`、`.tile`、`.choice`） |
| `--radius-xl` | 24px | ダイアログ（`.dialog`） |
| `--radius-full` | 999px | 丸いボタン（表示の切り替え） |
| `--border-width` / `--border` | 1px / 1px solid border 色 | 入力欄・ボタンの枠（`border: var(--border)`） |
| `--divider` | 1px solid divider 色 | 区切り線（`border-bottom: var(--divider)`） |
| `--focus-ring` | 内側から 白 1px・`--color-brand-current` 2px・白 1px（`box-shadow`） | ボタン・リンクのキーボードフォーカス（`:focus-visible`）と入力欄のフォーカス。`outline` は Windows のハイコントラスト表示のために透明で残す |
| `--shadow-card` | 広くぼかした薄い影＋近くの影 | カード（`section`、`.tile`）・ヘッダー |
| `--shadow-float` | カードより一段強い影 | 画面に浮かせる要素（候補リスト） |
| `--shadow-popup` | いちばん強い影 | ダイアログ |
| `--z-header` | 100 | 上部のヘッダー |
| `--transition` | 0.2s ease | マウスを載せたときの色の変化 |
| `--layout-narrow` | 640px | 会員向け画面の幅（`main`） |
| `--layout-wide` | 1200px | 管理画面の幅（`main.wide`） |
| `--layout-dialog` | 440px | ダイアログの幅（狭い画面では左右に `--space-lg` を残して縮む） |
| `--tile-min` | 200px | `.tiles` の1枚の最小幅 |
| `--column-min` | 300px | `.grid2` の1列の最小幅 |

狭い画面のブレークポイントは **640px**（`@media (max-width: 640px)`。media query では `var()` を使えないので値を直接書く）。カードとページの余白を詰め、ヘッダーのログイン中の名前を隠す。

## 3. クラス（部品カタログ）

クラスのない要素（`h1`〜`h3`、`section`、`dl`、`fieldset`、`input`、`table` など）は `base.css` で整えてあるので、そのまま使う。`section` は**カード**（白い地・角丸 12px・`--shadow-card`、枠線なし）として使う。React では `<Card>` が `section` を作る。

### 3.0 アプリの枠（ヘッダー）

React では `<AppShell>`（ヘッダー＋本文＋ダイアログ）か `<AppHeader>` を使い、クラスを直接は書かない（§4）。素の HTML では `docs/usage.md` のマークアップをそのまま使う。

| クラス | 使う場面 |
|---|---|
| `.app-header` / `.app-header.wide` | 上部に固定するヘッダー（半透明＋ぼかし、下に区切り線）。管理画面は `wide` |
| `.app-header-inner` | ヘッダーの中身の幅をページ（`main`）とそろえる |
| `.brand` / `.brand-mark` / `.brand-name` | 左上のロゴ（深緑の四角に S。`<img class="brand-mark">` にすると各アプリのロゴの画像を高さ 32px・白い地で出す。幅は縦横比に任せる）とサイト名（例：「SEEDS同窓会 会員ポータル」。「SEEDS同窓会」の間に空白を入れない）。押すとトップへ。狭い画面ではサイト名を2行に折り返す |
| `.header-actions` | 右側の操作（ログイン中の人、ログアウト、会員ページへ、表示の切り替え） |
| `.header-user` | ログイン中の人の名前。狭い画面では隠す |
| `.theme-toggle` | ライト・ダークの切り替えボタン（React は `<ThemeToggle>`。素の HTML は `<button class="theme-toggle"></button>` を置いて `js/theme.js` を読み込む） |

```tsx
<AppShell title="SEEDS同窓会 会員管理システム" href="/admin" wide envLabel={envLabel}
  actions={<><span className="header-user">管理 者（admin）</span><a href="/">会員ページ</a></>}>
  …
</AppShell>
```

### 3.1 レイアウト

| クラス | 使う場面 |
|---|---|
| `main` / `main.wide` | ページの本文の枠。会員向けは `main`（640px）、管理画面は `main.wide`（1200px） |
| `.page-title` | カードの外に置くページの見出し（h1 と同じ大きさ。h1 はヘッダーの名前と重ならないよう、必要なときだけ） |
| `.back-link` | 一覧へ戻るリンク（先頭に ←）。詳細の画面の一番上（`<DetailLayout back>`） |
| `.stack` | ボタンや `.choice` を縦に並べる（ログイン方法の選択など） |
| `.row` | 横に並べて折り返す（ボタンの組、入力欄＋ボタン）。`.row.between` は両端に寄せる（見出し＋操作） |
| `.grid2` | 2列（狭い画面では1列）。審査画面の「申請」と「名簿」の比較など |
| `.box` | カードの中の白い箱。フォームの中の小さなまとまり（追加フォーム、確認コードの入力） |
| `.warnbox` | `.box` と組み合わせて注意を促す（`.box.warnbox`、注意の色の枠と淡い黄色の地。vibes の MessageBlock）。中の `ul` は箇条書き |

```tsx
<div className="row between">
  <h2>申請の詳細</h2>
  <a href="#/applications">一覧へ</a>
</div>
```

### 3.2 ボタン・リンク

`.button` は単独で**幅いっぱいのブロック**になる（スマートフォンで押しやすい）。管理画面や横並びでは `inline` などを付ける。高さは入力欄と同じ 40px、文字は太字。マウスを載せると淡い緑の地に、枠と文字が濃い緑になる（vibes のボタン）。

| クラス | 使う場面 |
|---|---|
| `.button` | 幅いっぱいの標準ボタン（`a` でも `button` でも） |
| `.button.primary` | 画面の主要な操作（送信・承認・保存）。1つの画面・フォームに1つまで |
| `.button.danger` | 取り消せない・失う操作（却下・停止・削除）。押す前に確認を入れる |
| `.button.secondary` | 補助的な操作（変更画面を開く・キャンセル）。横幅は中身に合わせる |
| `.button.inline` | 幅を中身に合わせる（`primary` / `danger` と組み合わせる） |
| `.button.small-btn` | 表の中・行の中の小さな操作（削除・前へ・次へ） |
| `.link` | 見た目をリンクにした `button`（ログアウト、画面内の切り替えなど） |
| `.choice` | 選択肢の大きなカード（右端に緑の →。マウスを載せると淡い緑の地になり、→ が少し右へ動く）。行き先を選ばせるリンク（ログイン方法、旧ログインでの引き継ぎ）。`.stack` の中に縦に並べる |

```tsx
<div className="stack">
  <a className="choice" href="/auth/login?method=google">Google でログイン</a>
  <a className="choice" href="/auth/login?method=email">メールアドレスでログイン（確認コード）</a>
</div>
```

```tsx
<div className="row">
  <button className="button primary inline" onClick={approve}>承認する</button>
  <button className="button danger inline" onClick={reject}>却下する</button>
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
  <button className="button primary">申請する</button>
</form>
```

### 3.4 ナビゲーション

| クラス | 使う場面 |
|---|---|
| `.tabs` | 管理画面の上のタブ（`nav.tabs` の中に `a`。vibes の Tab：選択中は `a.active` で緑の文字と太い下線、マウスを載せると淡い地と細い下線。狭い画面では横にスクロール） |
| `.pager` | ページ送りの行。React は `<Pager>`（`<ListLayout pager>`）が付けるので直接は書かない |
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

### 3.6 状態の表示

| クラス | 使う場面 |
|---|---|
| `.badge` | 状態の小さなラベル（vibes の StatusIcon：角丸 4px、状態の色の枠と文字、淡い地）。React では `<Badge kind="…">` |
| `.badge.ok` | 完了・一致・利用中（緑） |
| `.badge.warn` | 要確認・審査中・仮の状態（黄） |
| `.badge.ng` | エラー・不一致・却下・停止（赤） |
| `.badge.none` | 該当なし・未登録・取り下げ（灰色の枠） |
| `.tiles` / `.tile` / `.tile-value` | ダッシュボードの数値のカード（`a.tile` に `href` を付けると一覧へのリンクになり、右上に →。マウスを載せると淡い緑の地と緑の枠） |
| `.env-badge` | 環境バッジ（`<AppHeader envLabel>` がサイト名の右横に置く。本番では出さない） |

アプリの状態の名前（`approved` など）をそのままバッジの種類にしたいときは、アプリの CSS で `.badge.approved` などに ok / warn / ng と同じ色を当て、アプリのカタログに載せる（seeds-alumni-idaas の `web/src/design/app.css` が例）。

### 3.7 文書（規約へのリンク・お知らせ）

| クラス | 使う場面 |
|---|---|
| `.doc-links` | 規約・プライバシーポリシーなど文書へのリンクの箇条書き |
| `.notice` | お知らせ・改訂の通知の本文（淡い地。改行をそのまま表示、長い URL も折り返す） |

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

if (!(await confirmDialog('この会員を停止しますか？', { title: '会員の停止', okLabel: '停止する', danger: true }))) return;

const ended = await inputDialog({ title: 'SA 登録の解除', label: '終了日', type: 'date', initial: today() });
if (ended === null) return; // キャンセル
```

- 入力ダイアログは既定で必須（空欄では決定できない）。空欄を許すときは `optional: true`
- 確認の文は「〜しますか？」で終え、決定ボタンには操作の名前（「削除する」「承認する」）を書く

## 4. React の部品と画面の型

`import { AppShell, Card, ListLayout, … } from '@seeds-alumni/ui'`。部品は**画面の骨組み**だけで、中身（`dl`・`table`・ボタン）は §3 のクラスで組む。Storybook に部品ごとの見本、デモに画面の型の見本がある。

| 部品 | 作るもの | 使う場面 |
|---|---|---|
| `<AppShell title href wide? envLabel? actions? tabs?>` | ヘッダー＋`main`＋`<DialogHost>` | 画面の一番外側。会員向けは幅 640px、`wide` で管理画面の 1200px。`tabs` で上にタブ |
| `<AppHeader title href wide? envLabel? mark? logoSrc?>` | `.app-header` | `<AppShell>` を使えないときだけ直接使う |
| `<Tabs items>` | `nav.tabs` | 画面の切り替え（`{ href, label, active }`） |
| `<Card title? level? actions? tone?>` | `section` | 1つの目的ごとに1枚。見出しの右に `actions`（バッジ・リンク）。`tone="warn"` で注意のカード |
| `<ListLayout title filters onSearch summary tools notice pager>` | カード＋`form.filters`＋`.table-wrap`＋`<Pager>` | 一覧の画面（検索 → 件数と操作 → 表 → ページ送り） |
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
<AppShell title="SEEDS同窓会 会員ポータル" href="/" actions={<button className="link" onClick={logout}>ログアウト</button>}>
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
  <Card title="例外的な操作" level={3}>…<button className="button danger inline">停止する</button></Card>
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
  <Field label="現在の所属" optional hint="登録後もマイページで変更できます。" error={errors.affiliation}><input … /></Field>
  <button className="button primary">申請する</button>
</form>
```

## 5. アクセシビリティ

- 文字と背景のコントラストは WCAG AA（4.5:1）以上。トークンの色を変えるときはライト・ダークの両方で確かめる
- 入力欄の枠など、画面を読み取るのに必要な線は 3:1 以上（`--color-border`）。淡い線（`--color-border-soft`）は、文字だけで押せると分かるボタンなどに限る
- フォーカスは `--focus-ring`（白・緑・白の二重の輪。ボタン・リンクは `:focus-visible`、入力欄は `:focus` で枠も緑。`base.css`）。`outline` は消さず透明にする（Windows のハイコントラスト表示で見えるように）。ほかに `outline: none` を書かない
- 入力欄は `label` の中に入れるか、`aria-label` を付ける
- 状態は色だけで伝えない（バッジ・メッセージには必ず文字を入れる）
- 押せる要素は `button` か `a` にする（`div` に `onClick` を付けない。表の行 `tr.clickable` は例外）

## 6. ルール（`seeds-ui-check` が確かめる）

使う側のアプリでも CI で実行する（`docs/usage.md`）。

- インライン `style={{ … }}` / `style="…"` を書かない
- 色の値（`#1a5fb4`、`rgb(…)`、`hsl(…)`）をトークンのファイル以外に書かない
- 定義されていないトークン（`var(--…)`）・CSS にないクラスを使わない
- CSS はアプリの CSS のフォルダにだけ置き、アプリの CSS のクラス・トークンはアプリのカタログに載せる
- ブラウザの `confirm()` / `prompt()` / `alert()` を使わない（§3.9）

**検出はしないが守ること**

- 余白・角丸・文字サイズに生の値（`13px`、`0.9rem`）を書かず、トークンを使う（例外：線の太さ `1px`・`2px`、`em` 単位の入力欄の幅）
- 状態の表示には `.badge` を使い、独自の色付きラベルを作らない
- 画面の文言は日本語。ボタンは動詞で終える（「承認する」「変更を保存」）

**理解の確認（AI に聞く質問）**

1. 申請の状態「審査中」を表示するときのマークアップは？ → `<Badge kind="warn">審査中</Badge>`（アプリが `.badge.pending` を足していれば `kind="pending"`）
2. 取り消せない主要操作のボタンと、却下ボタンのクラスは？ → `button primary inline` と `button danger inline`
3. 管理画面の一覧の画面はどう組む？ → `<ListLayout>` に `filters`・`summary`・`pager` を渡し、中に `table`（行は `tr.clickable`）

## 7. 変更の手順

- **トークンを足す・変える**：`css/tokens.css`（色は `light-dark()` でダークも）→ §2 の表
- **クラスを足す**：`css/components.css` → §3 に「クラス・使う場面・例」。似た部品が既にないか先に探す。1つのアプリだけで使うものは、そのアプリの CSS に置く
- **React の部品を足す**：`src/` → `src/index.ts` で書き出す → §4 の表 → `stories/` に見本。骨組みの部品だけを足し、細かい見た目の部品は作らない
- 最後に `npm run check`・`npm run typecheck`・`npm run build`（`dist/` も Git に入れる）。見た目は Storybook とデモで、ライト・ダーク・スマートフォンの幅を確かめる
- **版**：変更を main に入れたら `package.json` の `version` を上げ、`v1.2.3` のタグを付ける（`docs/deploy.md`）。使う側は版を指定して取り込むので、勝手には変わらない。表示が変わる変更（クラスの削除・トークンの意味の変更）は大きい版（v2）にする
