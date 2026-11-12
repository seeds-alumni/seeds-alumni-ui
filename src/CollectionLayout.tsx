import type { FormEvent, ReactNode } from 'react';
import { Pager, type PagerProps } from './Pager';

export type CollectionView = {
  label: ReactNode;
  /** その表示の件数 */
  count?: ReactNode;
  /** 行き先（URL・ハッシュが変わるとき。aria-current）。onSelect と、どちらかを渡す */
  href?: string;
  /** 画面の中で切り替えるとき（aria-pressed） */
  onSelect?: () => void;
  active?: boolean;
};

export type CollectionLayoutProps = {
  /** 表示の切り替え（すべて・利用中・停止中）。左に .segmented で並べる */
  views?: CollectionView[];
  /** 表示の切り替えの名前（読み上げ用。既定は「状態で分ける」） */
  viewsLabel?: string;
  /** 絞り込み（details.dropdown の「期 ▾」「区分 ▾」など）。検索欄の左に並ぶ */
  filters?: ReactNode;
  /** 検索欄（<span className="search-field"><input type="search" aria-label=… /></span>） */
  search?: ReactNode;
  /** 検索欄で Enter を押したとき */
  onSearch?: () => void;
  /** 適用中の条件（.filter-tag を並べ、最後に「すべてクリア」）。条件があるときだけ渡す */
  applied?: ReactNode;
  /** 一括操作（行を選んでいるあいだ、表の上の帯が「n 件を選択中」と操作に変わる）。useSelection() と使う */
  selection?: { count: number; actions?: ReactNode; onClear: () => void };
  /** 表の上の帯の左（件数など） */
  summary?: ReactNode;
  /** 表の上の帯の右（表示件数・列の設定など、表示中の範囲に対する小さい操作） */
  tools?: ReactNode;
  /** 表の上に出す知らせ（.message-box） */
  notice?: ReactNode;
  /** 1件もないとき：表の代わりに出す空の状態（.empty-state） */
  empty?: ReactNode;
  /** ページ送り（なければ出さない） */
  pager?: PagerProps;
  /** 表（<table>）。.table-wrap は自動で付く */
  children?: ReactNode;
};

/**
 * 管理コンソールの一覧（コレクション）の画面の型（docs/catalog.md §4.6・§8.1）：
 * 表示の切り替えと絞り込み・検索 → 適用中の条件 → カードの中に「件数・一括操作の帯 → 表（または空の状態） → ページ送り」。
 * 見出しと画面全体の操作は、上に <PageHeader> を置く。会員向けの画面・タブの管理画面の一覧は <ListLayout>
 */
export function CollectionLayout({ views, viewsLabel = '状態で分ける', filters, search, onSearch, applied, selection, summary, tools, notice, empty, pager, children }: CollectionLayoutProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };
  const selecting = !!selection && selection.count > 0;
  const showBar = !!selection || summary != null || !!tools;
  const byLink = views?.some((v) => v.href);
  return (
    <>
      {(views || filters || search) && (
        <div className="toolbar">
          {views && (byLink ? (
            <nav className="segmented" aria-label={viewsLabel}>
              {views.map((v, i) => (
                <a key={i} href={v.href} aria-current={v.active ? 'page' : undefined} onClick={v.onSelect}>
                  {v.label}{v.count != null && <span className="count">{v.count}<span className="visually-hidden">件</span></span>}
                </a>
              ))}
            </nav>
          ) : (
            <div className="segmented" role="group" aria-label={viewsLabel}>
              {views.map((v, i) => (
                <button key={i} type="button" aria-pressed={!!v.active} onClick={v.onSelect}>
                  {v.label}{v.count != null && <span className="count">{v.count}<span className="visually-hidden">件</span></span>}
                </button>
              ))}
            </div>
          ))}
          {(filters || search) && (
            <form className="toolbar-group" role="search" onSubmit={submit}>
              {filters}
              {search}
            </form>
          )}
        </div>
      )}
      {applied && <div className="filter-tags">{applied}</div>}
      {notice}
      <div className="table-card">
        {showBar && (selecting ? (
          <div className="table-card-bar bulk" role="region" aria-label="選んだ行の操作">
            <span>{selection.count} 件を選択中</span>
            {selection.actions}
            <button type="button" className="link small" onClick={selection.onClear}>選択を解除</button>
          </div>
        ) : (
          <div className="table-card-bar">
            <span>{summary}</span>
            {tools && <div className="row">{tools}</div>}
          </div>
        ))}
        {empty ?? <div className="table-wrap">{children}</div>}
        {pager && !empty && <div className="table-card-foot"><Pager {...pager} /></div>}
      </div>
    </>
  );
}
