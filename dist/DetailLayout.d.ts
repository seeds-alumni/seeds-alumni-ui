import type { ReactNode } from 'react';
export type DetailLayoutProps = {
    /** 一覧へ戻るリンク */
    back?: {
        href: string;
        label: string;
    };
    /** 詳細の名前（最初のカードの見出し。例：「15001：山田 太郎」） */
    title: ReactNode;
    /** 見出しの右側（状態のバッジなど） */
    status?: ReactNode;
    /** 最初のカードの中身（基本情報の dl と編集ボタンなど） */
    summary?: ReactNode;
    /** 続くカード（<Card level={3}> を操作ごとに1枚）。取り消せない操作のカードは最後に置く */
    children?: ReactNode;
};
/** 詳細の画面の型：戻るリンク → 基本情報のカード → 操作ごとのカード */
export declare function DetailLayout({ back, title, status, summary, children }: DetailLayoutProps): import("react").JSX.Element;
