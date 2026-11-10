// 公開するサイト（Cloudflare Pages）を site/ に作る。docs/deploy.md
//   /            Storybook
//   /demo/       デモ（index.html は素の HTML、react.html は React）
//   /v<大きい版>/ CDN として配る CSS と JS（seeds.css は1ファイルにまとめたもの、css/ は分けたもの、theme.js）
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
writeFileSync(`${out}/version.txt`, `${pkg.version}\n`);

// キャッシュ：CDN の CSS・JS は1時間（同じ大きい版の中で直したときに、1時間で行き渡る）
writeFileSync(
  `${root}site/_headers`,
  `/${major}/*\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n`,
);
console.log(`site/ を作りました（CDN：/${major}/seeds.css・/${major}/theme.js、版 ${pkg.version}）`);
