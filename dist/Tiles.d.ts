import type { ReactNode } from 'react';
export type TileItem = {
    label: ReactNode;
    value: ReactNode;
    /** あれば一覧へのリンクになる（右上に →） */
    href?: string;
};
/** ダッシュボードの数値のカード（.tiles / .tile）。幅に合わせて折り返す */
export declare function Tiles({ items }: {
    items: TileItem[];
}): import("react").JSX.Element;
