import type { ReactNode } from 'react';
import { type AppHeaderProps } from './AppHeader';
import { type TabItem } from './Tabs';
export type AppShellProps = Omit<AppHeaderProps, 'children'> & {
    /** ヘッダーの右側の操作 */
    actions?: ReactNode;
    /** 1つのことだけをするページ（ログイン・申請のフォーム）。本文を 640px にとどめる（main.narrow）。ヘッダーの幅は変えない */
    narrow?: boolean;
    /** 管理画面の上のタブ（あれば main の先頭に出す） */
    tabs?: TabItem[];
    children: ReactNode;
};
/**
 * 画面の枠（画面の型の一番外側）：ヘッダー＋本文（main）＋ダイアログ・短い知らせ（toast）。
 * 会員向けは幅 1040px（narrow で 640px）、wide を付けると管理画面向けの 1200px。各画面は children に Card などを並べるだけにする。
 */
export declare function AppShell({ actions, narrow, tabs, children, ...header }: AppShellProps): import("react").JSX.Element;
