import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
let open = null;
/** 確認ダイアログ。決定なら true、キャンセル・Esc なら false */
export function confirmDialog(message, options = {}) {
    return new Promise((resolve) => {
        if (!open)
            throw new Error('DialogHost が置かれていません');
        open({ kind: 'confirm', message, ...options, resolve });
    });
}
/** 入力ダイアログ。決定なら入力値（前後の空白を除く）、キャンセル・Esc なら null */
export function inputDialog(options) {
    return new Promise((resolve) => {
        if (!open)
            throw new Error('DialogHost が置かれていません');
        open({ kind: 'input', ...options, resolve });
    });
}
export function DialogHost() {
    const [req, setReq] = useState(null);
    const [value, setValue] = useState('');
    const ref = useRef(null);
    const settled = useRef(false);
    useEffect(() => {
        open = (r) => {
            settled.current = false;
            setValue(r.kind === 'input' ? (r.initial ?? '') : '');
            setReq(r);
        };
        return () => { open = null; };
    }, []);
    useEffect(() => {
        if (req && ref.current && !ref.current.open)
            ref.current.showModal();
    }, [req]);
    const finish = (result) => {
        if (!req || settled.current)
            return;
        settled.current = true;
        if (req.kind === 'confirm')
            req.resolve(result === 'ok');
        else
            req.resolve(result === 'ok' ? value.trim() : null);
        ref.current?.close();
        setReq(null);
    };
    const submit = (e) => {
        e.preventDefault();
        if (req?.kind === 'input' && !req.optional && !value.trim())
            return;
        finish('ok');
    };
    // Esc・背景のクリックで閉じたときはキャンセル扱い
    const onClose = () => finish('cancel');
    if (!req)
        return _jsx("dialog", { ref: ref, className: "dialog", onClose: onClose });
    const title = req.title ?? '確認';
    const okClass = req.kind === 'confirm' && req.danger ? 'button danger inline' : 'button primary inline';
    const disabled = req.kind === 'input' && !req.optional && !value.trim();
    return (_jsx("dialog", { ref: ref, className: "dialog", onClose: onClose, onClick: (e) => { if (e.target === ref.current)
            finish('cancel'); }, "aria-labelledby": "dialog-title", children: _jsxs("form", { className: "form", onSubmit: submit, children: [_jsx("h2", { id: "dialog-title", children: title }), req.message && _jsx("p", { className: "pre", children: req.message }), req.kind === 'input' && (_jsxs("label", { children: [req.label, req.optional && '（任意）', _jsx("input", { type: req.type ?? 'text', value: value, placeholder: req.placeholder, autoFocus: true, onChange: (e) => setValue(e.target.value) }), req.hint && _jsx("span", { className: "muted small", children: req.hint })] })), _jsxs("div", { className: "dialog-actions", children: [_jsx("button", { className: "button secondary", type: "button", onClick: () => finish('cancel'), children: "\u30AD\u30E3\u30F3\u30BB\u30EB" }), _jsx("button", { className: okClass, type: "submit", disabled: disabled, autoFocus: req.kind === 'confirm', children: req.okLabel ?? (req.kind === 'confirm' ? '続ける' : '決定') })] })] }) }));
}
