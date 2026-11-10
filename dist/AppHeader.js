import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';
/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export function AppHeader({ title, href, wide, envLabel, mark = 'S', logoSrc, children }) {
    return (_jsx("header", { className: wide ? 'app-header wide' : 'app-header', children: _jsxs("div", { className: "app-header-inner", children: [_jsxs("a", { className: "brand", href: href, children: [logoSrc ? (_jsx("img", { className: "brand-mark", src: logoSrc, alt: "", width: 32, height: 32 })) : (_jsx("span", { className: "brand-mark", "aria-hidden": "true", children: mark })), _jsx("span", { className: "brand-name", children: title })] }), _jsx(EnvBadge, { label: envLabel }), _jsxs("div", { className: "header-actions", children: [children, _jsx(ThemeToggle, {})] })] }) }));
}
