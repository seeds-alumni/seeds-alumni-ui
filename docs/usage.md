## 導入のしかた

使う側は**版（タグ）を指定して**取り込みます。ライブラリを直しても、版を上げるまで使う側の見た目は変わりません。

### React のアプリ（seeds-alumni-idaas など。Vite）

1. `package.json` の `dependencies` に追加して `npm install`（npm の公開はしていないので、GitHub のタグを指定する）

   ```json
   "@seeds-alumni/ui": "github:seeds-alumni/seeds-alumni-ui#v1.5.1"
   ```

2. 入口で CSS を読み込み、部品を使う

   ```tsx
   import '@seeds-alumni/ui/css';
   import { AppShell, Card } from '@seeds-alumni/ui';
   ```

3. `index.html` の `<head>` に、表示（ライト・ダーク）を描画の前に戻すスクリプトを置く（ちらつき防止）

   ```html
   <meta name="color-scheme" content="light dark" />
   <script>
     try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}
   </script>
   ```

4. アプリだけの見た目は、アプリの CSS のフォルダ（例：`web/src/design/`）に置く。値はトークンから組み立て、色の値はアプリのトークンのファイルにだけ書く
5. CI でルールを確かめる（`seeds-ui-check` はこのパッケージに入っている）

   ```json
   "check:design": "seeds-ui-check --src web/src --css web/src/design --tokens web/src/design/tokens.css --doc docs/design-system.md"
   ```

### 素の HTML のサイト（SEEDS TOTP・同窓会のホームページなど）

公開先（CDN）から読み込みます。`<head>` に、CSS より前に `theme.js` を置きます（`defer` を付けない）。

```html
<meta name="color-scheme" content="light dark" />
<script src="https://ui.seeds-alumni.jp/v1/theme.js"></script>
<link rel="stylesheet" href="https://ui.seeds-alumni.jp/v1/seeds.css" />
```

- `/v1/` は大きい版が 1 のあいだの最新です（同じ大きい版の中では、クラスを消したり意味を変えたりしない）。版を固定したいときは、`npm pack` などで取り出した `css/` をサイトに置いてもよい
- ヘッダーは次のマークアップをそのまま使います（React の `<AppHeader>` と同じ）。表示の切り替えは `theme.js` が `button.theme-toggle` に付けます

```html
<header class="app-header">
  <div class="app-header-inner">
    <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">S</span><span class="brand-name">SEEDS TOTP</span></a>
    <!-- ロゴの画像を出すとき：<a class="brand" href="/"><img class="brand-mark" src="/brand/seeds-logo.svg" alt="" height="32"><span class="brand-name">SEEDS TOTP</span></a>（画像は各サイトに置く） -->
    <!-- 本番以外だけ：<div class="env-badge" role="note" aria-label="この画面は開発環境です">開発環境</div> -->
    <div class="header-actions">
      <span class="header-user">山田 太郎</span>
      <a href="/auth/logout">ログアウト</a>
      <button class="theme-toggle"></button>
    </div>
  </div>
</header>
<main>
  <section><h2>カードの見出し</h2>…</section>
</main>
```

### ヘッダーのメニューとハンバーガーメニュー（ページがいくつもあるサイト）

広い画面ではヘッダーにメニューを横に並べ（`.header-nav`）、980px 以下では右端の3本線のボタンでヘッダーの下にメニューを画面いっぱいに開きます（クラスは `docs/catalog.md` §3.4）。React では `<AppHeader nav={…} navFooter={…}>` が同じものを作ります。`<head>` に `nav.js` を足します（`defer` を付ける）。

```html
<script src="https://ui.seeds-alumni.jp/v1/nav.js" defer></script>
```

```html
<header class="app-header wide">
  <div class="app-header-inner">
    <a class="brand" href="/">…</a>
    <!-- 広い画面のメニュー（980px 以下では隠れる）。いまいるセクションは .active、下にページがある項目は .has-children -->
    <nav class="header-nav" aria-label="メニュー">
      <ul>
        <li class="header-nav-item"><a href="/news/">お知らせ</a></li>
        <li class="header-nav-item has-children active">
          <a href="/about/">同窓会について</a>
          <ul class="header-nav-sub">
            <li><a href="/about/overview" aria-current="page">団体概要</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="header-actions">
      <a class="button primary small-btn" href="https://id.example.jp/">会員ログイン</a>
      <button type="button" class="theme-toggle"></button>
      <button type="button" class="nav-toggle" aria-controls="nav-screen" aria-expanded="false" aria-label="メニューを開く"><span class="nav-toggle-bars" aria-hidden="true"></span></button>
    </div>
  </div>
</header>
<!-- ヘッダーの外の直後に置く -->
<div class="nav-screen" id="nav-screen" hidden>
  <nav class="nav-screen-inner" aria-label="メニュー">
    <ul class="nav-screen-list">
      <li><a href="/">ホーム</a></li>
      <li>
        <div class="nav-screen-row">
          <a href="/about/">同窓会について</a>
          <!-- いまのページがこの下にあるときは aria-expanded="true" にして開いておく -->
          <button type="button" class="nav-screen-expand" aria-controls="nav-about" aria-expanded="false" aria-label="同窓会についての下のページ"></button>
        </div>
        <ul id="nav-about" hidden>
          <li><a href="/about/overview" aria-current="page">団体概要</a></li>
        </ul>
      </li>
    </ul>
    <div class="nav-screen-footer">
      <div class="nav-screen-theme">表示（ライト・ダーク）<button class="theme-toggle"></button></div>
      <a class="button primary" href="https://id.example.jp/">会員ログイン</a>
    </div>
  </nav>
</div>
```

- ヘッダーに `.header-nav` があると、981px 以上では `.nav-toggle` と `.nav-screen` が、980px 以下では `.header-nav` とヘッダーの `.theme-toggle` が自動で隠れます（表示の切り替えはメニューの中の `.nav-screen-theme` で。`theme.js` はどちらのボタンも動かす）。画面が広くなってボタンが隠れると `nav.js` がメニューを閉じます
- `.header-nav` を置かないときは、`.nav-toggle` はいつも出ます（出す画面の幅を使う側の CSS で決める）

### 公開サイトのページ（パンくず・題名の帯・文章・フッター）

ホームページのような公開サイトは、`main.full` で本文の幅の決まりを外し、帯ごとに `.container` で幅を決めます。`<html data-look="site">` を付けると公開サイトの見た目（白い地・Noto Sans JP・色面）になります。その場合は文章をカードに入れず（`<article class="prose">`）、区画・色面・丸い矢印などの部品を使います（カタログ §3.10。Noto Sans JP の読み込み方もそこに。見本は `/demo/site`）。下は `data-look` を付けないときの形です。フッターは `body` の直下に置くと、短いページでも画面の下端に寄ります。

```html
<body>
  <header class="app-header wide">…</header>
  <div class="nav-screen" id="nav-screen" hidden>…</div>
  <main class="full">
    <div class="page-head">
      <div class="container reading">
        <nav class="breadcrumb" aria-label="現在地">
          <ol>
            <li><a href="/">ホーム</a></li>
            <li><a href="/about/">同窓会について</a></li>
            <li><span aria-current="page">設立経緯</span></li>
          </ol>
        </nav>
        <h1>設立経緯</h1>
        <!-- 記事なら：<p class="page-meta"><time datetime="2026-11-10">2026年11月10日</time><span class="badge none">お知らせ</span></p> -->
      </div>
    </div>
    <div class="container reading">
      <article class="card prose">
        <h2>見出し</h2>
        <p>Markdown を変換した本文…</p>
      </article>
      <div class="tiles">
        <a class="tile" href="/about/overview"><strong class="tile-title">団体概要</strong><span class="muted small">名称・所在地・目的</span></a>
      </div>
    </div>
  </main>
  <footer class="app-footer wide">
    <div class="app-footer-inner">
      <div>
        <p class="app-footer-name">大阪大学SEEDSプログラム同窓会</p>
        <p class="muted small">所在地</p>
      </div>
      <nav aria-label="サイトの案内">
        <ul><li><a href="/about/">同窓会について</a></li><li><a href="/contact">お問い合わせ</a></li></ul>
      </nav>
    </div>
    <p class="app-footer-copy">© 大阪大学SEEDSプログラム同窓会</p>
  </footer>
</body>
```

- ルールの確認は、Node が使えるなら `npx -p github:seeds-alumni/seeds-alumni-ui#v1.5.1 seeds-ui-check --src . --css design --doc README.md` のように実行できます（`class="…"` と `style="…"` を確かめる）

### 管理コンソール（左のメニューのある管理画面）

React では `<ConsoleShell>` が枠を作ります（`docs/catalog.md` §3.11・§4.6）。素の HTML では `demo/console.html` のマークアップをもとにし、`<head>` に `console.js` を足します（`defer` を付ける）。`console.js` は、狭い画面での左のメニューの開け閉め、⌘K / Ctrl+K での全体の検索への移動、ドロップダウン（`details.dropdown`）を外を押す・Esc で閉じる動きをします。ドロップダウンだけを使うページでも読み込みます。

```html
<script src="https://ui.seeds-alumni.jp/v1/console.js" defer></script>
```

```html
<div class="console">
  <header class="console-header">
    <div class="console-header-inner">
      <button type="button" class="nav-toggle" aria-controls="console-sidebar" aria-expanded="false" aria-label="メニューを開く"><span class="nav-toggle-bars" aria-hidden="true"></span></button>
      <a class="brand" href="/admin"><span class="brand-mark" aria-hidden="true">S</span><span class="brand-name">SEEDS同窓会</span></a>
      <span class="tag brand">管理コンソール</span>
      <div class="console-search" role="search"><span class="search-field"><input type="search" aria-label="設定・会員を検索" placeholder="設定・会員を検索" /><kbd class="kbd">Ctrl K</kbd></span></div>
      <div class="header-actions">
        <a class="icon-button" href="/help" aria-label="ヘルプ"><svg …></svg></a>
        <button class="theme-toggle"></button>
      </div>
    </div>
  </header>
  <div class="console-scrim" hidden></div>
  <nav class="console-sidebar" id="console-sidebar" aria-label="メニュー">
    <div class="side-nav-group">
      <p class="side-nav-label">会員管理</p>
      <ul><li><a href="/admin/members" aria-current="page"><svg …></svg><span>会員</span></a></li></ul>
    </div>
  </nav>
  <main class="console-main">
    <div class="headline">…</div>
    <div class="toolbar">…</div>
    <div class="table-card">…</div>
  </main>
</div>
```

