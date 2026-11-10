import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** ダッシュボードの数値のカード（.tiles / .tile）。幅に合わせて折り返す */
export function Tiles({ items }) {
    return (_jsx("div", { className: "tiles", children: items.map((t, i) => t.href ? (_jsxs("a", { className: "tile", href: t.href, children: [_jsx("span", { className: "tile-value", children: t.value }), _jsx("span", { className: "muted small", children: t.label })] }, i)) : (_jsxs("div", { className: "tile", children: [_jsx("span", { className: "tile-value", children: t.value }), _jsx("span", { className: "muted small", children: t.label })] }, i))) }));
}
