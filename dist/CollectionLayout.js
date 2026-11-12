import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Pager } from './Pager';
/**
 * 管理コンソールの一覧（コレクション）の画面の型（docs/catalog.md §4.6・§8.1）：
 * 表示の切り替えと絞り込み・検索 → 適用中の条件 → カードの中に「件数・一括操作の帯 → 表（または空の状態） → ページ送り」。
 * 見出しと画面全体の操作は、上に <PageHeader> を置く。会員向けの画面・タブの管理画面の一覧は <ListLayout>
 */
export function CollectionLayout({ views, viewsLabel = '状態で分ける', filters, search, onSearch, applied, selection, summary, tools, notice, empty, pager, children }) {
    const submit = (e) => {
        e.preventDefault();
        onSearch?.();
    };
    const selecting = !!selection && selection.count > 0;
    const showBar = !!selection || summary != null || !!tools;
    const byLink = views?.some((v) => v.href);
    return (_jsxs(_Fragment, { children: [(views || filters || search) && (_jsxs("div", { className: "toolbar", children: [views && (byLink ? (_jsx("nav", { className: "segmented", "aria-label": viewsLabel, children: views.map((v, i) => (_jsxs("a", { href: v.href, "aria-current": v.active ? 'page' : undefined, onClick: v.onSelect, children: [v.label, v.count != null && _jsxs("span", { className: "count", children: [v.count, _jsx("span", { className: "visually-hidden", children: "\u4EF6" })] })] }, i))) })) : (_jsx("div", { className: "segmented", role: "group", "aria-label": viewsLabel, children: views.map((v, i) => (_jsxs("button", { type: "button", "aria-pressed": !!v.active, onClick: v.onSelect, children: [v.label, v.count != null && _jsxs("span", { className: "count", children: [v.count, _jsx("span", { className: "visually-hidden", children: "\u4EF6" })] })] }, i))) }))), (filters || search) && (_jsxs("form", { className: "toolbar-group", role: "search", onSubmit: submit, children: [filters, search] }))] })), applied && _jsx("div", { className: "filter-tags", children: applied }), notice, _jsxs("div", { className: "table-card", children: [showBar && (selecting ? (_jsxs("div", { className: "table-card-bar bulk", role: "region", "aria-label": "\u9078\u3093\u3060\u884C\u306E\u64CD\u4F5C", children: [_jsxs("span", { children: [selection.count, " \u4EF6\u3092\u9078\u629E\u4E2D"] }), selection.actions, _jsx("button", { type: "button", className: "link small", onClick: selection.onClear, children: "\u9078\u629E\u3092\u89E3\u9664" })] })) : (_jsxs("div", { className: "table-card-bar", children: [_jsx("span", { children: summary }), tools && _jsx("div", { className: "row", children: tools })] }))), empty ?? _jsx("div", { className: "table-wrap", children: children }), pager && !empty && _jsx("div", { className: "table-card-foot", children: _jsx(Pager, { ...pager }) })] })] }));
}
