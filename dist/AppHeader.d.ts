import type { ReactNode } from 'react';
export type AppHeaderProps = {
    /** サイト名（例：「SEEDS同窓会 会員ポータル」。「SEEDS同窓会」の間に空白を入れない） */
    title: string;
    /** サイト名を押したときの行き先（トップ） */
    href: string;
    /** 管理画面など、幅の広い画面（main.wide とそろえる） */
    wide?: boolean;
    /** 環境名（本番以外だけ渡す）。サイト名の右に出る */
    envLabel?: string | null;
    /** 左上の四角に入れる文字（既定は S） */
    mark?: string;
    /** 右側の操作（ログイン中の人は .header-user、ログアウトのリンクなど）。表示の切り替えは自動で右端に付く */
    children?: ReactNode;
};
/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export declare function AppHeader({ title, href, wide, envLabel, mark, children }: AppHeaderProps): import("react").JSX.Element;
