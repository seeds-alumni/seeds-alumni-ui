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
export declare function accountLabel(name: string, memberNumber?: number | string | null): string;
/**
 * ヘッダーの右に置くログイン中の人（docs/catalog.md §3.0）。アイコンの右の上の段に「氏名（会員番号）」、下の段にロール名。
 * 押すとメニュー（マイポータル・ログアウトなど）を開く。<AppShell actions>・<ConsoleShell actions> に渡す。
 * 狭い画面（640px 以下）ではアイコンだけにし、氏名とロール名はメニューの一番上に出す。素の HTML は docs/usage.md のマークアップ
 */
export declare function AccountMenu({ name, memberNumber, role, children }: AccountMenuProps): import("react").JSX.Element;
