import type { FormEvent, ReactNode } from 'react';
import { Card } from './Card';
import { Pager, type PagerProps } from './Pager';

export type ListLayoutProps = {
  /** 一覧の名前（カードの見出し） */
  title: ReactNode;
  /** 見出しの右側の操作（「新しく追加」など） */
  actions?: ReactNode;
  /** 検索・絞り込みの入力欄とボタン（form.filters の中身）。onSearch と一緒に使う */
  filters?: ReactNode;
  onSearch?: () => void;
  /** 件数などの補足（表の左上） */
  summary?: ReactNode;
  /** 表の右上の小さい操作（「CSV で保存」など） */
  tools?: ReactNode;
  /** エラーなど、表の上に出すもの */
  notice?: ReactNode;
  /** ページ送り（なければ出さない） */
  pager?: PagerProps;
  /** 表の中身（<table>）。.table-wrap は自動で付く */
  children: ReactNode;
};

/**
 * 一覧の画面の型：カードの中に「検索・絞り込み → 件数と操作 → 表 → ページ送り」を縦に並べる。
 * 表の行を押して詳細へ進むときは <tr className="clickable">。
 */
export function ListLayout({ title, actions, filters, onSearch, summary, tools, notice, pager, children }: ListLayoutProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };
  return (
    <Card title={title} actions={actions}>
      {filters && (
        <form className="filters" role="search" onSubmit={submit}>
          {filters}
        </form>
      )}
      {notice}
      {(summary || tools) && (
        <div className="row between">
          <span className="muted small">{summary}</span>
          {tools && <div className="row">{tools}</div>}
        </div>
      )}
      <div className="table-wrap">{children}</div>
      {pager && <Pager {...pager} />}
    </Card>
  );
}
