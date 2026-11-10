export type PagerProps = { total: number; page: number; pageSize: number; onPage: (page: number) => void };

/** ページ送り（.pager）。「前へ」「n 件中 a〜b 件（p/全体）」「次へ」 */
export function Pager({ total, page, pageSize, onPage }: PagerProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="row pager">
      <button type="button" className="button small-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>前へ</button>
      <span className="muted">{total} 件中 {Math.min(total, (page - 1) * pageSize + 1)}〜{Math.min(total, page * pageSize)} 件（{page}/{pages}）</span>
      <button type="button" className="button small-btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>次へ</button>
    </div>
  );
}
