# 依存ライブラリの更新（Dependabot）の対応

設定は `.github/dependabot.yml`。seeds-alumni-idaas の `docs/dependencies.md` と同じ方針で、このリポジトリだけの違いを「このリポジトリでは」に書く。

## 1. 来る PR

| PR | いつ | 中身 |
|---|---|---|
| Storybook | 月1回 | `storybook` と `@storybook/*`（必ず一緒に上げる） |
| マイナー・パッチ | 月1回 | それ以外の npm のマイナー・パッチをまとめたもの |
| GitHub Actions | 月1回 | `actions/*` など（メジャーも来る） |
| 脆弱性の修正 | すぐ | 設定と関係なく来る |

npm のメジャーアップデートは来ない。必要になったら手作業で上げる（§3）。

## 2. 対応のしかた

1. **CI が成功していれば、マージする**（マージするのはユーザー。Claude に「Dependabot の PR を見て」と頼めば、確認と下の 3・4 をする）
   - 見た目に関わるもの（Vite・React・Storybook）は、Cloudflare Pages のプレビュー（PR に出る URL）で Storybook を一度開いて崩れていないか見る
   - GitHub Actions のメジャーは、リリースノートで「動かす Node の版が変わる」程度か確かめる
2. **脆弱性の修正は、1週間以内にマージする**
3. **CI が失敗したら**、Dependabot の PR に手でコミットしない（Dependabot が作り直せなくなる）
   - 一緒に上げるべきものが別の PR に分かれた（`ERESOLVE`・`peer` のエラー）→ `dependabot.yml` のグループを直す PR を出し、マージ後に古い PR を閉じる。GitHub → **Insights** → **Dependency graph** → **Dependabot** → 対象の行の **Last checked** → **Check for updates** で出し直させる
   - コードの直しが要る → 更新とその直しを1つの PR にして Claude が出し、Dependabot の PR は理由を書いて閉じる
4. **ロックファイルが衝突した**（先に別の PR をマージした）→ PR に `@dependabot rebase` とコメントする
5. マージの順番は GitHub Actions → npm（CI の土台を先に新しくする）

## 3. メジャーアップデート（手作業）

半年に1回くらい、または困ったときに、Claude に「〇〇をメジャーアップデートして」と頼む。1つのライブラリ（と一緒に上げるもの）ごとに1つの PR にして、リリースノートの破壊的変更を確かめ、チェック・ビルド・見た目を確かめる。

## 4. このリポジトリでは

- 依存はすべて開発用（devDependencies）で、使う側（idaas など）には入らない。**依存の更新だけなら版を上げず、タグも付けない**。`dist/` が変わったとき（TypeScript の更新で出力が変わったなど）と、`peerDependencies`（React）を変えたときだけ版を上げる
- CI は「ルール・型・`dist/` が古くないか」を見る。Storybook とデモのビルドは Cloudflare Pages が PR ごとに行うので、Pages のチェックも成功していることを確かめる
