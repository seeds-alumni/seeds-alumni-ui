import { jsx as _jsx } from "react/jsx-runtime";
/** 画面の上のタブ（nav.tabs。選択中は下線）。行き先はリンクで、ハッシュ（#/users）でもページでもよい */
export function Tabs({ items, label = '画面の切り替え' }) {
    return (_jsx("nav", { className: "tabs", "aria-label": label, children: items.map((t) => (_jsx("a", { href: t.href, className: t.active ? 'active' : undefined, "aria-current": t.active ? 'page' : undefined, children: t.label }, t.href))) }));
}
