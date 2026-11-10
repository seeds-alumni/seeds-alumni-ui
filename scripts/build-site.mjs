// 公開するサイト（Cloudflare Pages）を site/ に作る。docs/deploy.md
//   /            Storybook
//   /demo/       デモ（index.html は素の HTML、react.html は React。Pages は .html を外した URL（/demo/react）に転送する）
//   /404.html    見つからないページ（これが無いと、存在しないパスすべてに Storybook が返る）
//   /v<大きい版>/ CDN として配る CSS と JS（seeds.css は1ファイルにまとめたもの、css/ は分けたもの、theme.js、nav.js）
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit' });
const pkg = JSON.parse(readFileSync(`${root}package.json`, 'utf8'));
const major = `v${pkg.version.split('.')[0]}`;

rmSync(`${root}site`, { recursive: true, force: true });
run('npx', ['storybook', 'build', '-o', 'site', '--quiet']);
run('npx', ['vite', 'build', '--config', 'demo/vite.config.ts', '--logLevel', 'warn']);
cpSync(`${root}demo/index.html`, `${root}site/demo/index.html`);

// CDN の CSS と JS
const out = `${root}site/${major}`;
mkdirSync(`${out}/css`, { recursive: true });
const parts = ['tokens', 'base', 'components', 'utilities'];
const banner = `/* @seeds-alumni/ui ${pkg.version} — https://github.com/seeds-alumni/seeds-alumni-ui */\n`;
for (const p of parts) cpSync(`${root}css/${p}.css`, `${out}/css/${p}.css`);
cpSync(`${root}css/index.css`, `${out}/css/index.css`);
writeFileSync(`${out}/seeds.css`, banner + parts.map((p) => readFileSync(`${root}css/${p}.css`, 'utf8')).join('\n'));
cpSync(`${root}js/theme.js`, `${out}/theme.js`);
cpSync(`${root}js/nav.js`, `${out}/nav.js`);
writeFileSync(`${out}/version.txt`, `${pkg.version}\n`);

// キャッシュ（Cloudflare Pages の _headers）
//   - CDN の CSS・JS は1時間（同じ大きい版の中で直したときに、1時間で行き渡る）
//   - ファイル名にハッシュが入るもの（/assets/・/demo/assets/）は中身が変わると名前も変わるので、1年・immutable。
//     Pages の既定（max-age=0, must-revalidate）だと、開くたびに 20 個以上のファイルを問い合わせ直していた
writeFileSync(
  `${root}site/_headers`,
  [
    `/${major}/*`,
    '  Cache-Control: public, max-age=3600',
    '  Access-Control-Allow-Origin: *',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/demo/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ].join('\n'),
);

// 404 ページ。これが無いと Pages は「1ページのアプリ」とみなし、存在しないパスすべてに Storybook のトップ（約 2MB）を返す。
// 古いリンクや打ち間違いで Storybook が丸ごと読み込まれ、Storybook の中でさらに Storybook が開くこともあった（2026-11-10）
writeFileSync(
  `${root}site/404.html`,
  `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <script src="/${major}/theme.js"></script>
    <link rel="stylesheet" href="/${major}/seeds.css" />
    <title>ページが見つかりません | SEEDS同窓会の共通 UI</title>
  </head>
  <body>
    <main>
      <section>
        <h2>ページが見つかりません</h2>
        <p class="muted">URL が変わったか、打ち間違いかもしれません。</p>
        <ul class="doc-links">
          <li><a href="/">Storybook（部品ごとの見本）</a></li>
          <li><a href="/demo/react">画面の型のデモ（React）</a></li>
          <li><a href="/demo/">素の HTML のデモ</a></li>
        </ul>
      </section>
    </main>
  </body>
</html>
`,
);
console.log(`site/ を作りました（CDN：/${major}/seeds.css・/${major}/theme.js・/${major}/nav.js、版 ${pkg.version}）`);
