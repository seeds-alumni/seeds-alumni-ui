import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { DialogHost } from './Dialog';
import { useDropdownDismiss } from './dropdown';
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';
import { ToastHost } from './Toast';
/**
 * 管理コンソールの枠（docs/catalog.md §3.11・§4.6）：上のヘッダー（サイト名・全体の検索・操作）＋左のメニュー＋本文。
 * 980px 以下では左のメニューを隠し、ヘッダーの左の3本線で引き出す。<DialogHost>・<ToastHost> も置く。
 * 本文には <PageHeader> と <CollectionLayout>・<Card> を並べる
 */
export function ConsoleShell({ title, href, label = '管理コンソール', envLabel, mark = 'S', logoSrc, search, actions, nav, navFooter, children }) {
    const [open, setOpen] = useState(false);
    const sideId = useId();
    const toggleRef = useRef(null);
    const mainRef = useRef(null);
    const sideRef = useRef(null);
    const searchRef = useRef(null);
    useDropdownDismiss();
    const close = (focusBack) => {
        setOpen(false);
        if (focusBack)
            toggleRef.current?.focus();
    };
    // ⌘K / Ctrl+K で全体の検索へ
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                const input = searchRef.current?.querySelector('input');
                if (input && input.offsetParent) {
                    e.preventDefault();
                    input.focus();
                    input.select();
                }
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);
    // 狭い画面で引き出しているあいだ：本文を操作の対象から外す。Esc・画面が広くなったら閉じる
    useEffect(() => {
        if (!open)
            return;
        if (mainRef.current)
            mainRef.current.inert = true;
        sideRef.current?.querySelector('a[aria-current="page"], a')?.focus();
        const onKey = (e) => { if (e.key === 'Escape')
            close(true); };
        const onResize = () => { if (!toggleRef.current?.offsetParent)
            close(false); };
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            if (mainRef.current)
                mainRef.current.inert = false;
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);
    return (_jsxs("div", { className: "console", children: [_jsx("header", { className: "console-header", children: _jsxs("div", { className: "console-header-inner", children: [_jsx("button", { ref: toggleRef, type: "button", className: "nav-toggle", "aria-controls": sideId, "aria-expanded": open, "aria-label": open ? 'メニューを閉じる' : 'メニューを開く', onClick: () => setOpen(!open), children: _jsx("span", { className: "nav-toggle-bars", "aria-hidden": "true" }) }), _jsxs("a", { className: "brand", href: href, children: [logoSrc ? _jsx("img", { className: "brand-mark", src: logoSrc, alt: "", height: 32 }) : _jsx("span", { className: "brand-mark", "aria-hidden": "true", children: mark }), _jsx("span", { className: "brand-name", children: title })] }), label != null && _jsx("span", { className: "tag brand", children: label }), _jsx(EnvBadge, { label: envLabel }), search && _jsx("div", { ref: searchRef, className: "console-search", role: "search", children: search }), _jsxs("div", { className: "header-actions", children: [actions, _jsx(ThemeToggle, {})] })] }) }), _jsx("div", { className: "console-scrim", hidden: !open, onClick: () => close(true) }), _jsxs("nav", { ref: sideRef, id: sideId, className: open ? 'console-sidebar open' : 'console-sidebar', "aria-label": "\u30E1\u30CB\u30E5\u30FC", onClick: (e) => { if (open && e.target.closest('a[href]'))
                    close(false); }, children: [nav.map((g, n) => (_jsxs("div", { className: "side-nav-group", children: [g.label != null && _jsx("p", { className: "side-nav-label", children: g.label }), _jsx("ul", { children: g.items.map((i, m) => (_jsx("li", { children: _jsxs("a", { href: i.href, "aria-current": i.current ? 'page' : undefined, children: [i.icon, _jsx("span", { children: i.label }), i.count != null && _jsxs("span", { className: "count", children: [i.count, _jsx("span", { className: "visually-hidden", children: "\u4EF6" })] })] }) }, m))) })] }, n))), navFooter] }), _jsx("main", { ref: mainRef, className: "console-main", children: children }), _jsx(DialogHost, {}), _jsx(ToastHost, {})] }));
}
