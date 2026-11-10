import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from './Card';
import { Pager } from './Pager';
/**
 * 一覧の画面の型：カードの中に「検索・絞り込み → 件数と操作 → 表 → ページ送り」を縦に並べる。
 * 表の行を押して詳細へ進むときは <tr className="clickable">。
 */
export function ListLayout({ title, actions, filters, onSearch, summary, tools, notice, pager, children }) {
    const submit = (e) => {
        e.preventDefault();
        onSearch?.();
    };
    return (_jsxs(Card, { title: title, actions: actions, children: [filters && (_jsx("form", { className: "filters", role: "search", onSubmit: submit, children: filters })), notice, (summary || tools) && (_jsxs("div", { className: "row between", children: [_jsx("span", { className: "muted small", children: summary }), tools && _jsx("div", { className: "row", children: tools })] })), _jsx("div", { className: "table-wrap", children: children }), pager && _jsx(Pager, { ...pager })] }));
}
