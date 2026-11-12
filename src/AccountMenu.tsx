import type { ReactNode } from 'react';

export type AccountMenuProps = {
  /** 氏名 */
  name: string;
  /** 会員番号（5桁）。氏名の後ろに括弧で数字だけを出す（「山田 太郎（15001）」）。審査中で番号がない人は null */
  memberNumber?: number | string | null;
  /** ロール名（下の段）。例：「管理者」「審査担当・閲覧者」「イベント管理者」「会員」。用語は docs/writing.md §6.2 */
  role?: ReactNode;
  /** メニューの中身（a・button・hr）。マイポータルへのリンク・ログアウトなど */
  children?: ReactNode;
};

/** 「山田 太郎（15001）」。会員番号がないときは氏名だけ */
export function accountLabel(name: string, memberNumber?: number | string | null) {
  return memberNumber == null || memberNumber === '' ? name : `${name}（${memberNumber}）`;
}

/**
 * ヘッダーの右に置くログイン中の人（docs/catalog.md §3.0）。アイコンの右の上の段に「氏名（会員番号）」、下の段にロール名。
 * 押すとメニュー（マイポータル・ログアウトなど）を開く。<AppShell actions>・<ConsoleShell actions> に渡す。
 * 狭い画面（640px 以下）ではアイコンだけにし、氏名とロール名はメニューの一番上に出す。素の HTML は docs/usage.md のマークアップ
 */
export function AccountMenu({ name, memberNumber, role, children }: AccountMenuProps) {
  const label = accountLabel(name, memberNumber);
  const spoken = typeof role === 'string' && role ? `${label}、${role}` : label;
  return (
    <details className="dropdown account">
      <summary className="person" aria-label={`アカウントのメニュー（${spoken}）`}>
        <span className="avatar" aria-hidden="true">{name.slice(0, 1)}</span>
        <span className="person-text">
          <span className="person-name">{label}</span>
          {role != null && role !== '' && <span className="person-sub">{role}</span>}
        </span>
      </summary>
      <div className="dropdown-menu end">
        <div className="account-who" aria-hidden="true">
          <strong>{label}</strong>
          {role != null && role !== '' && <span>{role}</span>}
        </div>
        {children}
      </div>
    </details>
  );
}
