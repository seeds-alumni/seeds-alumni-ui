/**
 * 本番以外の環境で、ヘッダーのサイト名の右に環境名（「開発環境」など）を出す（.env-badge）。
 * label が空なら何も出さない。出しているあいだは、タブのタイトルの先頭にも [環境名] を付ける。
 * 環境名の取り方（API・環境変数など）はアプリが決め、<AppHeader envLabel> に渡す。
 */
export declare function EnvBadge({ label }: {
    label?: string | null;
}): import("react").JSX.Element | null;
/** タブのタイトルの先頭に [環境名] を付ける（画面が title を変えても付け直す） */
export declare function useEnvTitle(label?: string | null): void;
