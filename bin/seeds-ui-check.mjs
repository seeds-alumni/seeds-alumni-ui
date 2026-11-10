#!/usr/bin/env node
// @seeds-alumni/ui のデザインのルールを確かめる（CI で実行する）。仕様は docs/catalog.md の「ルール」
//
//   seeds-ui-check --src web/src --css web/src/design --tokens web/src/design/tokens.css --doc docs/design-system.md
//
//   --src <dir>     画面のコード（.tsx / .ts / .jsx / .js / .html）を探すフォルダ。複数指定できる
//   --css <dir>     アプリ固有の CSS を置くフォルダ（CSS はここにだけ置ける）。省略するとアプリ固有の CSS なし
//   --tokens <file> アプリ固有のトークンのファイル（色の値を書けるのは、ライブラリの tokens.css とこのファイルだけ）
//   --doc <file>    アプリ固有のクラス・トークンの一覧（カタログ）。アプリの CSS のクラスとトークンはすべてここに載せる
//
// 確かめること
//   1. インライン style（style={{…}} / style="…"）を書いていない
//   2. 色の値（#hex / rgb() / hsl()）はトークンのファイルにだけある
//   3. var(--…) で参照しているトークンは定義されている（ライブラリ＋アプリ）
//   4. 画面で使っているクラスは CSS（ライブラリ＋アプリ）に定義がある
//   5. アプリの CSS のクラスとトークンは、すべてカタログ（--doc）に載っている
//   6. ブラウザの confirm() / prompt() / alert() を使っていない（<DialogHost> の confirmDialog / inputDialog を使う）
//   7. CSS は --css のフォルダにだけ置いている
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB_CSS = resolve(fileURLToPath(new URL('../css', import.meta.url)));
const CWD = process.cwd();

const args = { src: [], css: null, tokens: null, doc: null };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const [k, v] = [argv[i], argv[i + 1]];
  if (k === '--src') args.src.push(v);
  else if (k === '--css') args.css = v;
  else if (k === '--tokens') args.tokens = v;
  else if (k === '--doc') args.doc = v;
  else if (k === '--help' || k === '-h') {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 20).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(0);
  } else {
    console.error(`不明な引数：${k}（--help で使い方）`);
    process.exit(2);
  }
  i++;
}
if (!args.src.length) {
  console.error('--src を1つ以上指定してください（--help で使い方）');
  process.exit(2);
}

const errors = [];
const rel = (p) => relative(CWD, p) || p;
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        if (f === 'node_modules' || f === 'dist' || f.startsWith('.')) return [];
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const appCssDir = args.css ? resolve(args.css) : null;
const isSelf = appCssDir === LIB_CSS; // ライブラリ自身を確かめるとき（ライブラリの CSS もカタログと照らす）
const libCss = walk(LIB_CSS).filter((f) => f.endsWith('.css'));
const appCss = appCssDir && !isSelf ? walk(appCssDir).filter((f) => f.endsWith('.css')) : [];
const tokenFiles = new Set([join(LIB_CSS, 'tokens.css'), ...(args.tokens ? [resolve(args.tokens)] : [])]);

const srcFiles = [...new Set(args.src.flatMap((d) => walk(resolve(d))))];
const codeFiles = srcFiles.filter((f) => /\.(tsx?|jsx?|mjs|html)$/.test(f) && !/\.d\.ts$/.test(f));

// CSS は --css のフォルダにだけ置く
for (const f of srcFiles.filter((f) => f.endsWith('.css'))) {
  if (!appCssDir || !f.startsWith(appCssDir + '/')) errors.push(`${rel(f)}：CSS は ${args.css ?? '（--css で指定したフォルダ）'} に置いてください`);
}

// トークンとクラスを集める
const tokens = new Set();
const appTokens = new Set();
for (const f of tokenFiles) {
  if (!existsSync(f)) {
    errors.push(`${rel(f)}：トークンのファイルがありません`);
    continue;
  }
  const css = stripComments(readFileSync(f, 'utf8'));
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) {
    tokens.add(m[1]);
    if (isSelf || f !== join(LIB_CSS, 'tokens.css')) appTokens.add(m[1]);
  }
}
const classes = new Set();
const appClasses = new Set();
for (const f of [...libCss, ...appCss]) {
  const isApp = isSelf || appCss.includes(f);
  const css = stripComments(readFileSync(f, 'utf8'));
  if (!tokenFiles.has(f)) {
    for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g)) {
      errors.push(`${rel(f)}:${lineOf(css, m.index)}：色の値「${m[0]}」はトークンにしてください`);
    }
    for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) {
      errors.push(`${rel(f)}:${lineOf(css, m.index)}：トークン ${m[1]} はトークンのファイルで定義してください`);
    }
  }
  for (const block of css.matchAll(/([^{}]+)\{/g)) {
    if (block[1].trim().startsWith('@')) continue;
    for (const m of block[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      classes.add(m[1]);
      if (isApp) appClasses.add(m[1]);
    }
  }
  if (isApp || !isSelf) {
    for (const m of css.matchAll(/var\((--[a-z0-9-]+)/g)) {
      if (!tokens.has(m[1])) errors.push(`${rel(f)}:${lineOf(css, m.index)}：未定義のトークン ${m[1]}`);
    }
  }
}

// 画面のコード
for (const f of codeFiles) {
  const src = readFileSync(f, 'utf8');
  const html = f.endsWith('.html');
  for (const m of src.matchAll(html ? /\sstyle="/g : /\bstyle=\{/g)) {
    errors.push(`${rel(f)}:${lineOf(src, m.index)}：インライン style は使わず、部品・補助クラスを使ってください`);
  }
  for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) {
    if (!tokens.has(m[1])) errors.push(`${rel(f)}:${lineOf(src, m.index)}：未定義のトークン ${m[1]}`);
  }
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`])\/\/[^\n]*/g, (c) => c.replace(/[^\n]/g, ' '));
  for (const m of code.matchAll(/(?<![\w.])(?:window\.)?(confirm|prompt|alert)\s*\(/g)) {
    errors.push(`${rel(f)}:${lineOf(src, m.index)}：ブラウザの ${m[1]}() は使わず、confirmDialog / inputDialog を使ってください`);
  }
  const used = [];
  for (const m of src.matchAll(html ? /\sclass="([^"]*)"/g : /className="([^"]*)"/g)) used.push([m.index, m[1]]);
  if (!html) {
    for (const m of src.matchAll(/className=\{([^}]*(?:\$\{[^}]*\}[^}]*)*)\}/g)) {
      for (const s of m[1].matchAll(/'([^']*)'|`([^`]*)`/g)) used.push([m.index, (s[1] ?? s[2]).replace(/\$\{[^}]*\}/g, ' ')]);
    }
    for (const m of src.matchAll(/<Badge kind="([^"]+)"/g)) used.push([m.index, m[1]]);
  }
  for (const [index, list] of used) {
    for (const c of list.split(/\s+/).filter(Boolean)) {
      if (!classes.has(c)) errors.push(`${rel(f)}:${lineOf(src, index)}：クラス「${c}」は CSS にありません`);
    }
  }
}

// カタログとの対応
if (args.doc) {
  const doc = readFileSync(resolve(args.doc), 'utf8');
  for (const c of appClasses) if (!doc.includes(`.${c}`)) errors.push(`${args.doc}：クラス .${c} がカタログに載っていません`);
  for (const t of appTokens) if (!doc.includes(t)) errors.push(`${args.doc}：トークン ${t} が一覧に載っていません`);
} else if (appClasses.size || appTokens.size) {
  errors.push('アプリ固有のクラス・トークンがあります。--doc でカタログを指定してください');
}

if (errors.length) {
  console.error(`デザインのルール違反が ${errors.length} 件あります：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`デザインのルール：OK（トークン ${tokens.size} 個、クラス ${classes.size} 個、画面のファイル ${codeFiles.length} 個）`);
