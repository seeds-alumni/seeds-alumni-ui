import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * カード（section）。画面は「1つの目的ごとにカードを1枚」で組む。
 * 見出しと右側の操作は .row.between で両端に寄せる。
 */
export function Card({ title, level = 2, actions, tone, className, children }) {
    const H = level === 2 ? 'h2' : 'h3';
    const cls = [tone === 'warn' ? 'warnbox' : '', className ?? ''].filter(Boolean).join(' ') || undefined;
    return (_jsxs("section", { className: cls, children: [title !== undefined && (actions ? (_jsxs("div", { className: "row between", children: [_jsx(H, { children: title }), _jsx("div", { className: "row", children: actions })] })) : _jsx(H, { children: title })), children] }));
}
