import { type ReactNode } from 'react';
export type NavItem = {
    label: ReactNode;
    href: string;
    /** いまいるセクション（このページか、この下のページを開いている）。緑の下線。ハンバーガーメニューでは最初から開いておく */
    active?: boolean;
    /** このページそのものを開いている（aria-current="page"） */
    current?: boolean;
    /** 下のページ（2段目）。ハンバーガーメニューでは、さらに下の段（3段目）まで字下げして並べる */
    children?: NavItem[];
};
export type AppHeaderProps = {
    /** サイト名（例：「SEEDS-ID マイポータル」。サービスの名前は docs/writing.md §6.1） */
    title: string;
    /** サイト名を押したときの行き先（トップ） */
    href: string;
    /** 管理画面など、幅の広い画面（main.wide とそろえる） */
    wide?: boolean;
    /** 環境名（本番以外だけ渡す）。サイト名の右に出る */
    envLabel?: string | null;
    /** 左上の四角に入れる文字（既定は S）。logoSrc を渡したときは使わない */
    mark?: string;
    /**
     * 左上に出すロゴの画像（例：'/brand/seeds-logo.svg'）。渡すと「S」の四角の代わりに、高さ 32px・白い地で出す（幅は縦横比に任せる）。
     * ロゴはこのライブラリに入れない決まりなので、画像は各アプリに置く
     */
    logoSrc?: string;
    /**
     * サイトのメニュー（ページがいくつもあるサイト）。広い画面ではヘッダーに横に並べ（.header-nav）、
     * 980px 以下ではハンバーガーメニュー（.nav-toggle・.nav-screen）にする。表示の切り替えはメニューの中に移る
     */
    nav?: NavItem[];
    /** ハンバーガーメニューの下に出す操作（ログインのボタンなど） */
    navFooter?: ReactNode;
    /** 右側の操作（ログイン中の人は .header-user、ログアウトのリンクなど）。表示の切り替えは自動で右端に付く */
    children?: ReactNode;
};
/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export declare function AppHeader({ title, href, wide, envLabel, mark, logoSrc, nav, navFooter, children }: AppHeaderProps): import("react").JSX.Element;
