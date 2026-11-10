import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** ページ送り（.pager）。「前へ」「n 件中 a〜b 件（p/全体）」「次へ」 */
export function Pager({ total, page, pageSize, onPage }) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    return (_jsxs("div", { className: "row pager", children: [_jsx("button", { type: "button", className: "button small-btn", disabled: page <= 1, onClick: () => onPage(page - 1), children: "\u524D\u3078" }), _jsxs("span", { className: "muted", children: [total, " \u4EF6\u4E2D ", Math.min(total, (page - 1) * pageSize + 1), "\u301C", Math.min(total, page * pageSize), " \u4EF6\uFF08", page, "/", pages, "\uFF09"] }), _jsx("button", { type: "button", className: "button small-btn", disabled: page >= pages, onClick: () => onPage(page + 1), children: "\u6B21\u3078" })] }));
}
