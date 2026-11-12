import { useEffect, useRef, useState } from 'react';

/**
 * 画面の下に一時的に出す短い知らせ（docs/catalog.md §8.5）。保存・送信などの結果を伝える。
 * 画面の枠が <ToastHost /> を1つ置き（<AppShell>・<ConsoleShell> は自動で置く）、各画面は toast() を呼ぶ。
 *   toast('保存しました。');
 *   toast('保存できませんでした。時間をおいてもう一度お試しください。', { kind: 'ng' });
 * 成功・お知らせ（kind なし・'ok'）は5秒で消える。失敗（'ng'）は読み終えるまで残し、× で閉じる。
 * 入力の誤りの詳しい内容は toast ではなく、項目の直後（<Field error>）や .message-box に書く
 */
export type ToastOptions = { kind?: 'ok' | 'ng'; /** 消えるまでの時間（ミリ秒）。失敗は既定で消えない */ duration?: number };
type Item = { id: number; message: string; kind?: 'ok' | 'ng'; duration: number };

let push: ((item: Item) => void) | null = null;
let nextId = 1;

export function toast(message: string, options: ToastOptions = {}) {
  if (!push) throw new Error('ToastHost が置かれていません');
  push({ id: nextId++, message, kind: options.kind, duration: options.duration ?? (options.kind === 'ng' ? 0 : 5000) });
}

const MAX = 3;

export function ToastHost() {
  const [items, setItems] = useState<Item[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const mine = (item: Item) => setItems((list) => [...list, item].slice(-MAX));
    push = mine;
    const t = timers.current;
    return () => {
      if (push === mine) push = null;
      t.forEach(clearTimeout);
      t.clear();
    };
  }, []);

  const close = (id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setItems((list) => list.filter((i) => i.id !== id));
  };

  useEffect(() => {
    for (const i of items) {
      if (i.duration > 0 && !timers.current.has(i.id)) timers.current.set(i.id, setTimeout(() => close(i.id), i.duration));
    }
  }, [items]);

  const render = (list: Item[]) => list.map((i) => (
    <div key={i.id} className={i.kind === 'ng' ? 'toast ng' : 'toast'}>
      <span className="toast-text">{i.message}</span>
      <button type="button" className="toast-close" aria-label="知らせを閉じる" onClick={() => close(i.id)}>×</button>
    </div>
  ));

  // 読み上げ：失敗はすぐ（assertive）、ほかは区切りのよいところで（polite）。領域は先に置いておく（後から足した要素は読まれないことがある）
  return (
    <div className="toast-region">
      <div className="toast-list" aria-live="assertive">{render(items.filter((i) => i.kind === 'ng'))}</div>
      <div className="toast-list" aria-live="polite">{render(items.filter((i) => i.kind !== 'ng'))}</div>
    </div>
  );
}
