import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
let push = null;
let nextId = 1;
export function toast(message, options = {}) {
    if (!push)
        throw new Error('ToastHost が置かれていません');
    push({ id: nextId++, message, kind: options.kind, duration: options.duration ?? (options.kind === 'ng' ? 0 : 5000) });
}
const MAX = 3;
export function ToastHost() {
    const [items, setItems] = useState([]);
    const timers = useRef(new Map());
    useEffect(() => {
        const mine = (item) => setItems((list) => [...list, item].slice(-MAX));
        push = mine;
        const t = timers.current;
        return () => {
            if (push === mine)
                push = null;
            t.forEach(clearTimeout);
            t.clear();
        };
    }, []);
    const close = (id) => {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setItems((list) => list.filter((i) => i.id !== id));
    };
    useEffect(() => {
        for (const i of items) {
            if (i.duration > 0 && !timers.current.has(i.id))
                timers.current.set(i.id, setTimeout(() => close(i.id), i.duration));
        }
    }, [items]);
    const render = (list) => list.map((i) => (_jsxs("div", { className: i.kind === 'ng' ? 'toast ng' : 'toast', children: [_jsx("span", { className: "toast-text", children: i.message }), _jsx("button", { type: "button", className: "toast-close", "aria-label": "\u77E5\u3089\u305B\u3092\u9589\u3058\u308B", onClick: () => close(i.id), children: "\u00D7" })] }, i.id)));
    // 読み上げ：失敗はすぐ（assertive）、ほかは区切りのよいところで（polite）。領域は先に置いておく（後から足した要素は読まれないことがある）
    return (_jsxs("div", { className: "toast-region", children: [_jsx("div", { className: "toast-list", "aria-live": "assertive", children: render(items.filter((i) => i.kind === 'ng')) }), _jsx("div", { className: "toast-list", "aria-live": "polite", children: render(items.filter((i) => i.kind !== 'ng')) })] }));
}
