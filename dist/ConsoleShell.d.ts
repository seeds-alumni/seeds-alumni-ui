import { type ReactNode } from 'react';
export type SideNavItem = {
    label: ReactNode;
    href: string;
    /** 左のアイコン（20px の SVG。stroke="currentColor"）。アイコンは各アプリが持つ */
    icon?: ReactNode;
    /** いまの画面（淡いブランド色の地と緑の太字。aria-current="page"） */
    current?: boolean;
    /** 右の件数（審査待ちの数など。<span className="count"> になる） */
    count?: ReactNode;
};
export type SideNavGroup = {
    /** まとまりの小さい見出し（「会員管理」「セキュリティ」）。いちばん上のまとまりは無くてよい */
    label?: ReactNode;
    items: SideNavItem[];
};
export type ConsoleShellProps = {
    /** サイト名（例：「SEEDS同窓会」） */
    title: string;
    /** サイト名を押したときの行き先（ダッシュボード） */
    href: string;
    /** サイト名の右の札（既定は「管理コンソール」。null で出さない） */
    label?: ReactNode;
    /** 環境名（本番以外だけ渡す） */
    envLabel?: string | null;
    /** 左上の四角に入れる文字（既定は S）。logoSrc を渡したときは使わない */
    mark?: string;
    /** 左上のロゴの画像（各アプリに置く） */
    logoSrc?: string;
    /** ヘッダーの中央の全体の検索（<span className="search-field"><input type="search" aria-label=… /></span>）。⌘K / Ctrl+K で移る */
    search?: ReactNode;
    /** ヘッダーの右の操作（.icon-button のヘルプ・お知らせ、ログイン中の人の .dropdown）。表示の切り替えは自動で右端に付く */
    actions?: ReactNode;
    /** 左のメニュー */
    nav: SideNavGroup[];
    /** 左のメニューのいちばん下（版・会員ページへのリンクなど） */
    navFooter?: ReactNode;
    children: ReactNode;
};
/**
 * 管理コンソールの枠（docs/catalog.md §3.11・§4.6）：上のヘッダー（サイト名・全体の検索・操作）＋左のメニュー＋本文。
 * 980px 以下では左のメニューを隠し、ヘッダーの左の3本線で引き出す。<DialogHost>・<ToastHost> も置く。
 * 本文には <PageHeader> と <CollectionLayout>・<Card> を並べる
 */
export declare function ConsoleShell({ title, href, label, envLabel, mark, logoSrc, search, actions, nav, navFooter, children }: ConsoleShellProps): import("react").JSX.Element;
