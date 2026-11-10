import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/** フォームの1項目：ラベル → 入力欄 → 補足・誤り（.form の中に縦に並べる） */
export function Field({ label, optional, hint, error, as = 'label', children }) {
    const Tag = as;
    return (_jsxs(Tag, { className: "form-field", children: [_jsxs("span", { children: [label, optional && '（任意）'] }), children, hint && _jsx("span", { className: "muted small", children: hint }), error && _jsx("span", { className: "error small", children: error })] }));
}
