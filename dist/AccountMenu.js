import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 「山田 太郎（15001）」。会員番号がないときは氏名だけ */
export function accountLabel(name, memberNumber) {
    return memberNumber == null || memberNumber === '' ? name : `${name}（${memberNumber}）`;
}
/**
 * ヘッダーの右に置くログイン中の人（docs/catalog.md §3.0）。アイコンの右の上の段に「氏名（会員番号）」、下の段にロール名。
 * 押すとメニュー（マイポータル・ログアウトなど）を開く。<AppShell actions>・<ConsoleShell actions> に渡す。
 * 狭い画面（640px 以下）ではアイコンだけにし、氏名とロール名はメニューの一番上に出す。素の HTML は docs/usage.md のマークアップ
 */
export function AccountMenu({ name, memberNumber, role, children }) {
    const label = accountLabel(name, memberNumber);
    const spoken = typeof role === 'string' && role ? `${label}、${role}` : label;
    return (_jsxs("details", { className: "dropdown account", children: [_jsxs("summary", { className: "person", "aria-label": `アカウントのメニュー（${spoken}）`, children: [_jsx("span", { className: "avatar", "aria-hidden": "true", children: name.slice(0, 1) }), _jsxs("span", { className: "person-text", children: [_jsx("span", { className: "person-name", children: label }), role != null && role !== '' && _jsx("span", { className: "person-sub", children: role })] })] }), _jsxs("div", { className: "dropdown-menu end", children: [_jsxs("div", { className: "account-who", "aria-hidden": "true", children: [_jsx("strong", { children: label }), role != null && role !== '' && _jsx("span", { children: role })] }), children] })] }));
}
