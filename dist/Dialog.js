import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
let open = null;
function request(r) {
    if (!open)
        throw new Error('DialogHost が置かれていません');
    open(r);
}
/** 確認ダイアログ。決定なら true、キャンセル・Esc なら false */
export function confirmDialog(message, options = {}) {
    return new Promise((resolve) => request({ kind: 'confirm', message, ...options, resolve }));
}
/** 入力ダイアログ（1項目）。決定なら入力値（前後の空白を除く）、キャンセル・Esc なら null */
export function inputDialog(options) {
    const { title, message, okLabel, ...field } = options;
    return new Promise((resolve) => request({ kind: 'form', title, message, okLabel, fields: [{ ...field, name: 'value' }], resolve: (v) => resolve(v ? (v.value ?? '') : null) }));
}
/**
 * 入力ダイアログ（複数項目）。名前と説明など、1つのものの複数の値をまとめて変更するときに使う（1.9.0）。
 * 決定なら { name: 値 }（前後の空白を除く）、キャンセル・Esc なら null
 */
export function formDialog(options) {
    return new Promise((resolve) => request({ kind: 'form', ...options, resolve }));
}
export function DialogHost() {
    const [req, setReq] = useState(null);
    const [values, setValues] = useState({});
    const ref = useRef(null);
    const settled = useRef(false);
    useEffect(() => {
        open = (r) => {
            settled.current = false;
            setValues(r.kind === 'form' ? Object.fromEntries(r.fields.map((f) => [f.name, f.initial ?? ''])) : {});
            setReq(r);
        };
        return () => { open = null; };
    }, []);
    useEffect(() => {
        if (req && ref.current && !ref.current.open)
            ref.current.showModal();
    }, [req]);
    const missing = req?.kind === 'form' && req.fields.some((f) => !f.optional && !(values[f.name] ?? '').trim());
    const finish = (result) => {
        if (!req || settled.current)
            return;
        settled.current = true;
        if (req.kind === 'confirm')
            req.resolve(result === 'ok');
        else
            req.resolve(result === 'ok' ? Object.fromEntries(req.fields.map((f) => [f.name, (values[f.name] ?? '').trim()])) : null);
        ref.current?.close();
        setReq(null);
    };
    const submit = (e) => {
        e.preventDefault();
        if (missing)
            return;
        finish('ok');
    };
    // Esc・背景のクリックで閉じたときはキャンセル扱い
    const onClose = () => finish('cancel');
    if (!req)
        return _jsx("dialog", { ref: ref, className: "dialog", onClose: onClose });
    const title = req.title ?? '確認';
    const okClass = req.kind === 'confirm' && req.danger ? 'button danger inline' : 'button primary inline';
    return (_jsx("dialog", { ref: ref, className: "dialog", onClose: onClose, onClick: (e) => { if (e.target === ref.current)
            finish('cancel'); }, "aria-labelledby": "dialog-title", children: _jsxs("form", { className: "form", onSubmit: submit, children: [_jsx("h2", { id: "dialog-title", children: title }), req.message && _jsx("p", { className: "pre", children: req.message }), req.kind === 'form' && req.fields.map((f, i) => (_jsxs("label", { children: [f.label, f.optional && '（任意）', _jsx("input", { type: f.type ?? 'text', value: values[f.name] ?? '', placeholder: f.placeholder, autoFocus: i === 0, onChange: (e) => setValues((v) => ({ ...v, [f.name]: e.target.value })) }), f.hint && _jsx("span", { className: "muted small", children: f.hint })] }, f.name))), _jsxs("div", { className: "dialog-actions", children: [_jsx("button", { className: "button secondary", type: "button", onClick: () => finish('cancel'), children: "\u30AD\u30E3\u30F3\u30BB\u30EB" }), _jsx("button", { className: okClass, type: "submit", disabled: missing, autoFocus: req.kind === 'confirm', children: req.okLabel ?? (req.kind === 'confirm' ? '続ける' : '決定') })] })] }) }));
}
