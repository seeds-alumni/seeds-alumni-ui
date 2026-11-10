import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from './Card';
/** 詳細の画面の型：戻るリンク → 基本情報のカード → 操作ごとのカード */
export function DetailLayout({ back, title, status, summary, children }) {
    return (_jsxs(_Fragment, { children: [back && _jsx("a", { className: "back-link", href: back.href, children: back.label }), _jsx(Card, { title: title, actions: status, children: summary }), children] }));
}
