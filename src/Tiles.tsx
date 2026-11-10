import type { ReactNode } from 'react';

export type TileItem = {
  label: ReactNode;
  value: ReactNode;
  /** あれば一覧へのリンクになる（右上に →） */
  href?: string;
};

/** ダッシュボードの数値のカード（.tiles / .tile）。幅に合わせて折り返す */
export function Tiles({ items }: { items: TileItem[] }) {
  return (
    <div className="tiles">
      {items.map((t, i) =>
        t.href ? (
          <a key={i} className="tile" href={t.href}>
            <span className="tile-value">{t.value}</span>
            <span className="muted small">{t.label}</span>
          </a>
        ) : (
          <div key={i} className="tile">
            <span className="tile-value">{t.value}</span>
            <span className="muted small">{t.label}</span>
          </div>
        ),
      )}
    </div>
  );
}
