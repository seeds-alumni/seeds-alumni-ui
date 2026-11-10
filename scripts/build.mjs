// React の部品を dist/ に書き出す（tsc。JS と型定義）。dist/ は Git に入れる：
// ほかのリポジトリが Git の依存（github:seeds-alumni/seeds-alumni-ui#v1.0.0）として入れたとき、ビルドせずに使えるようにするため。
// CI で「ビルドし直しても dist/ が変わらない」ことを確かめる
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
rmSync(new URL('../dist', import.meta.url), { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { cwd: root, stdio: 'inherit' });
console.log('dist/ を書き出しました');
