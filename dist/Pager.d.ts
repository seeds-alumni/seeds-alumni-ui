export type PagerProps = {
    total: number;
    page: number;
    pageSize: number;
    onPage: (page: number) => void;
};
/** ページ送り（.pager）。「前へ」「n 件中 a〜b 件（p/全体）」「次へ」 */
export declare function Pager({ total, page, pageSize, onPage }: PagerProps): import("react").JSX.Element;
