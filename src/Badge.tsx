import type { ReactNode } from 'react';

/**
 * 状態の小さなラベル（.badge）。色だけでなく必ず文字で状態を書く。
 * kind は ok（完了・一致）/ warn（要確認）/ ng（エラー・停止）/ none（該当なし）。
 * アプリの状態の名前（approved など）を kind にしたいときは、アプリの CSS で .badge.<名前> を足す
 */
export function Badge({ kind = 'none', children }: { kind?: string; children: ReactNode }) {
  return <span className={`badge ${kind}`}>{children}</span>;
}
