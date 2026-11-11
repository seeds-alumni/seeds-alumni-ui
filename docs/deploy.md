# 公開と版の出し方

## 1. 公開先（Cloudflare Pages）

Storybook・デモ・CDN の CSS と JS を、Cloudflare Pages の1つのプロジェクトで公開する（無料プラン）。

| パス | 中身 |
|---|---|
| `/` | Storybook（部品ごとの見本、カタログ） |
| `/demo/` | 素の HTML のデモ（`/demo/site` は公開サイト（ホームページ）の見本。`data-look="site"`） |
| `/demo/react` | 画面の型のデモ（React）。Pages は `.html` を外した URL に転送する |
| `/v1/seeds.css`・`/v1/theme.js`・`/v1/nav.js` | CDN として配る CSS と JS（`/v1/css/*.css` は分けたもの、`/v1/version.txt` は版） |

### 最初の設定（Cloudflare の画面）

1. Cloudflare ダッシュボード → アカウント「seeds-alumni」→ 左メニュー **Workers & Pages** → **Create** → **Pages** タブ → **Connect to Git**
2. GitHub の `seeds-alumni/seeds-alumni-ui` を選ぶ（Cloudflare の GitHub アプリに、このリポジトリへのアクセスを許可する）
3. **Set up builds and deployments**：
   - Production branch：`main`
   - Framework preset：`None`
   - Build command：`npm ci && npm run build:site`
   - Build output directory：`site`
   - Environment variables：`NODE_VERSION` = `22`
4. **Save and Deploy**。PR ごとにプレビューの URL も自動で作られる
5. 独自ドメイン：プロジェクト → **Custom domains** → **Set up a custom domain** → `ui.seeds-alumni.jp`（`seeds-alumni.jp` のゾーンが同じアカウントにあれば DNS も自動）

`/v1/*` には `Cache-Control: public, max-age=3600` と `Access-Control-Allow-Origin: *` を、ファイル名にハッシュが入る `/assets/*`・`/demo/assets/*` には1年の `immutable` を付けている（`site/_headers`）。`site/404.html` も作る（無いと Pages は存在しないパスすべてに Storybook のトップを返す）。どちらも `scripts/build-site.mjs` が作る。

Storybook の文書（MDX）からデモなど Storybook の外へリンクするときは、`<a href="/demo/react" target="_blank">` のように**絶対パス＋ target** にする。`./` で始まる相対リンクは Storybook が横取りし、URL 欄だけが変わって画面が移らない。

## 2. 版の出し方

1. 変更の PR で `package.json` の `version` を上げる（直しただけなら 1.0.1、クラス・部品を足したら 1.1.0、消したり意味を変えたりしたら 2.0.0）。`npm run build` で `dist/` も更新して一緒にコミットする
2. main にマージしたら、そのコミットにタグを付けて push する

   ```bash
   git tag v1.1.0 && git push origin v1.1.0
   ```

3. 使う側の `package.json` の `#v1.0.0` を新しいタグに変えて `npm install`。素の HTML のサイトは `/v1/` を読んでいるので、main へのマージ（Pages の再デプロイ）から最長1時間で反映される
4. 大きい版（v2）を出すときは `/v2/` に置かれる。`/v1/` を残したいときは、v1 の最後の `site/v1/` を `public/v1/` として残す仕組みを足す（必要になったら）

## 3. 大きい版（v2）の候補

クラスを消したり意味を変えたりする変更は、使っているサイト（`/v1/` を読む素の HTML のサイトは、main へのマージで勝手に変わる）を壊すので、v1 のあいだは**足すだけ**にする。次の変更は v2 を出すときにまとめて行う（2026-11-10、seeds-alumni/seeds-alumni-ui#12 で決めた）。

| 変更 | v1 のあいだの代わり |
|---|---|
| `main` の幅（640px）と余白を外し、幅は `.container` / `main.wide` などのクラスだけで決める | `main.full` で外し、中の `.container`（`.wide`・`.reading`）で幅を決める（v1.3.0） |
| `section` 要素にカードの見た目を付けず、カードは `.card`（React は `<Card>`）だけにする | `section` 以外をカードにするときは `.card`、カードにしない区切りは `div`（v1.3.0） |

v2 にするときは、idaas の `section` を使っている箇所（`<Card>` 以外）と、totp-site・ホームページの `section`・`main` を先に洗い出す。

