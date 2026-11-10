export type TabItem = { href: string; label: string; active?: boolean };

/** 画面の上のタブ（nav.tabs。選択中は下線）。行き先はリンクで、ハッシュ（#/users）でもページでもよい */
export function Tabs({ items, label = '画面の切り替え' }: { items: TabItem[]; label?: string }) {
  return (
    <nav className="tabs" aria-label={label}>
      {items.map((t) => (
        <a key={t.href} href={t.href} className={t.active ? 'active' : undefined} aria-current={t.active ? 'page' : undefined}>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
