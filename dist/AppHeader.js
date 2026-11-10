import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';
/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export function AppHeader({ title, href, wide, envLabel, mark = 'S', logoSrc, nav, navFooter, children }) {
    const [open, setOpen] = useState(false);
    const screenId = useId();
    const toggleRef = useRef(null);
    const hasNav = !!nav?.length;
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: wide ? 'app-header wide' : 'app-header', children: _jsxs("div", { className: "app-header-inner", children: [_jsxs("a", { className: "brand", href: href, children: [logoSrc ? (_jsx("img", { className: "brand-mark", src: logoSrc, alt: "", height: 32 })) : (_jsx("span", { className: "brand-mark", "aria-hidden": "true", children: mark })), _jsx("span", { className: "brand-name", children: title })] }), _jsx(EnvBadge, { label: envLabel }), hasNav && _jsx(HeaderNav, { items: nav }), _jsxs("div", { className: "header-actions", children: [children, _jsx(ThemeToggle, {}), hasNav && (_jsx("button", { ref: toggleRef, type: "button", className: "nav-toggle", "aria-controls": screenId, "aria-expanded": open, "aria-label": open ? 'メニューを閉じる' : 'メニューを開く', onClick: () => setOpen(!open), children: _jsx("span", { className: "nav-toggle-bars", "aria-hidden": "true" }) }))] })] }) }), hasNav && _jsx(NavScreen, { id: screenId, items: nav, footer: navFooter, open: open, onClose: (focusBack) => {
                    setOpen(false);
                    if (focusBack)
                        toggleRef.current?.focus();
                } })] }));
}
const linkProps = (i) => ({ href: i.href, 'aria-current': i.current ? 'page' : undefined });
/** 広い画面のメニュー（.header-nav） */
function HeaderNav({ items }) {
    return (_jsx("nav", { className: "header-nav", "aria-label": "\u30E1\u30CB\u30E5\u30FC", children: _jsx("ul", { children: items.map((i, n) => {
                const cls = ['header-nav-item', i.children?.length ? 'has-children' : '', i.active ? 'active' : ''].filter(Boolean).join(' ');
                return (_jsxs("li", { className: cls, children: [_jsx("a", { ...linkProps(i), children: i.label }), !!i.children?.length && (_jsx("ul", { className: "header-nav-sub", children: i.children.map((c, m) => _jsx("li", { children: _jsx("a", { ...linkProps(c), children: c.label }) }, m)) }))] }, n));
            }) }) }));
}
/** 980px 以下のハンバーガーメニュー（.nav-screen）。js/nav.js と同じ動き（Esc・リンクで閉じる、後ろをスクロールさせない、ほかを inert に） */
function NavScreen({ id, items, footer, open, onClose }) {
    const ref = useRef(null);
    const close = useRef(onClose);
    close.current = onClose;
    useEffect(() => {
        const screen = ref.current;
        if (!open || !screen)
            return;
        const header = screen.previousElementSibling;
        document.documentElement.classList.add('nav-open');
        // ヘッダーとメニュー以外（本文・フッター）を読み上げ・フォーカスの対象から外す。
        // React ではヘッダーとメニューがアプリの要素の中にあるので、メニューから body までの各段で、ヘッダーを含まない兄弟を inert にする
        const saved = [];
        for (let el = screen; el.parentElement && el !== document.body; el = el.parentElement) {
            for (const sib of el.parentElement.children) {
                if (sib !== el && sib instanceof HTMLElement && !(header && sib.contains(header)) && !sib.inert) {
                    sib.inert = true;
                    saved.push(sib);
                }
            }
        }
        const onKey = (e) => { if (e.key === 'Escape')
            close.current(true); };
        // 画面が広くなってボタンが隠れたら閉じる
        const onResize = () => { if (!header?.querySelector('.nav-toggle')?.offsetParent)
            close.current(false); };
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            document.documentElement.classList.remove('nav-open');
            saved.forEach((el) => { el.inert = false; });
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);
    return (_jsx("div", { ref: ref, className: "nav-screen", id: id, hidden: !open, onClick: (e) => { if (e.target.closest('a[href]'))
            onClose(false); }, children: _jsxs("nav", { className: "nav-screen-inner", "aria-label": "\u30E1\u30CB\u30E5\u30FC", children: [_jsx("ul", { className: "nav-screen-list", children: items.map((i, n) => _jsx(NavScreenItem, { item: i }, n)) }), _jsxs("div", { className: "nav-screen-footer", children: [_jsxs("div", { className: "nav-screen-theme", children: ["\u8868\u793A\uFF08\u30E9\u30A4\u30C8\u30FB\u30C0\u30FC\u30AF\uFF09", _jsx(ThemeToggle, {})] }), footer] })] }) }));
}
function NavScreenItem({ item }) {
    const [expanded, setExpanded] = useState(!!item.active);
    const subId = useId();
    if (!item.children?.length)
        return _jsx("li", { children: _jsx("a", { ...linkProps(item), children: item.label }) });
    return (_jsxs("li", { children: [_jsxs("div", { className: "nav-screen-row", children: [_jsx("a", { ...linkProps(item), children: item.label }), _jsx("button", { type: "button", className: "nav-screen-expand", "aria-controls": subId, "aria-expanded": expanded, "aria-label": typeof item.label === 'string' ? `${item.label}の下のページ` : '下のページ', onClick: () => setExpanded(!expanded) })] }), _jsx("ul", { id: subId, hidden: !expanded, children: item.children.map((c, m) => (_jsxs("li", { children: [_jsx("a", { ...linkProps(c), children: c.label }), !!c.children?.length && _jsx("ul", { children: c.children.map((g, k) => _jsx("li", { children: _jsx("a", { ...linkProps(g), children: g.label }) }, k)) })] }, m))) })] }));
}
