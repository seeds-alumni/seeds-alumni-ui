import { useEffect } from 'react';

/**
 * 本番以外の環境で、ヘッダーのサイト名の右に環境名（「開発環境」など）を出す（.env-badge）。
 * label が空なら何も出さない。出しているあいだは、タブのタイトルの先頭にも [環境名] を付ける。
 * 環境名の取り方（API・環境変数など）はアプリが決め、<AppHeader envLabel> に渡す。
 */
export function EnvBadge({ label }: { label?: string | null }) {
  useEnvTitle(label);
  if (!label) return null;
  return (
    <div className="env-badge" role="note" aria-label={`この画面は${label}です`}>
      {label}
    </div>
  );
}

/** タブのタイトルの先頭に [環境名] を付ける（画面が title を変えても付け直す） */
export function useEnvTitle(label?: string | null) {
  useEffect(() => {
    if (!label) return;
    const prefix = `[${label}] `;
    const apply = () => {
      if (!document.title.startsWith(prefix)) document.title = prefix + document.title;
    };
    apply();
    const titleEl = document.querySelector('title');
    if (!titleEl) return;
    const observer = new MutationObserver(apply);
    observer.observe(titleEl, { childList: true });
    return () => observer.disconnect();
  }, [label]);
}
