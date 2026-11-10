## 導入のしかた

使う側は**版（タグ）を指定して**取り込みます。ライブラリを直しても、版を上げるまで使う側の見た目は変わりません。

### React のアプリ（seeds-alumni-idaas など。Vite）

1. `package.json` の `dependencies` に追加して `npm install`（npm の公開はしていないので、GitHub のタグを指定する）

   ```json
   "@seeds-alumni/ui": "github:seeds-alumni/seeds-alumni-ui#v1.0.0"
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

### 素の HTML のサイト（SEEDS TOTP・Wiki など）

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

- ルールの確認は、Node が使えるなら `npx -p github:seeds-alumni/seeds-alumni-ui#v1.0.0 seeds-ui-check --src . --css design --doc README.md` のように実行できます（`class="…"` と `style="…"` を確かめる）
