import type { ReactNode } from 'react';

export type BreadcrumbItem = { label: ReactNode; href?: string };

export type PageHeaderProps = {
  /** パンくず（いまの画面は最後。href を付けない） */
  breadcrumb?: BreadcrumbItem[];
  /** 画面の名前（h1） */
  title: ReactNode;
  /** 題名の右の件数（一覧の全体の件数） */
  count?: ReactNode;
  /** 題名の下の1行の説明（何をする画面か。要らなければ書かない） */
  description?: ReactNode;
  /** 右の画面全体の操作（主要な操作 .button.primary は1つ。右端に置く） */
  actions?: ReactNode;
};

/** 画面の見出し（.headline）：パンくず → 題名＋件数・説明（左）と画面全体の操作（右）。管理コンソールの各画面の一番上 */
export function PageHeader({ breadcrumb, title, count, description, actions }: PageHeaderProps) {
  return (
    <div className="headline">
      {!!breadcrumb?.length && (
        <nav className="breadcrumb" aria-label="現在地">
          <ol>
            {breadcrumb.map((b, i) => (
              <li key={i}>{b.href && i < breadcrumb.length - 1 ? <a href={b.href}>{b.label}</a> : <span aria-current={i === breadcrumb.length - 1 ? 'page' : undefined}>{b.label}</span>}</li>
            ))}
          </ol>
        </nav>
      )}
      <div className="headline-main">
        <h1 className="headline-title">
          {title}
          {count != null && <span className="count">{count}<span className="visually-hidden">件</span></span>}
        </h1>
        {description && <p className="headline-desc">{description}</p>}
      </div>
      {actions && <div className="headline-actions">{actions}</div>}
    </div>
  );
}
