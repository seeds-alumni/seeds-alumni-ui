import type { ReactNode } from 'react';
export type BreadcrumbItem = {
    label: ReactNode;
    href?: string;
};
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
export declare function PageHeader({ breadcrumb, title, count, description, actions }: PageHeaderProps): import("react").JSX.Element;
