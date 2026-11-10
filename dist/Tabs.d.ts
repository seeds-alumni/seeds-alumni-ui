export type TabItem = {
    href: string;
    label: string;
    active?: boolean;
};
/** 画面の上のタブ（nav.tabs。選択中は下線）。行き先はリンクで、ハッシュ（#/users）でもページでもよい */
export declare function Tabs({ items, label }: {
    items: TabItem[];
    label?: string;
}): import("react").JSX.Element;
