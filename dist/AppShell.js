import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AppHeader } from './AppHeader';
import { DialogHost } from './Dialog';
import { useDropdownDismiss } from './dropdown';
import { Tabs } from './Tabs';
import { ToastHost } from './Toast';
/**
 * 画面の枠（画面の型の一番外側）：ヘッダー＋本文（main）＋ダイアログ・短い知らせ（toast）。
 * 会員向けは幅 640px、wide を付けると管理画面向けの 1200px。各画面は children に Card などを並べるだけにする。
 */
export function AppShell({ actions, tabs, children, ...header }) {
    useDropdownDismiss();
    return (_jsxs(_Fragment, { children: [_jsx(AppHeader, { ...header, children: actions }), _jsxs("main", { className: header.wide ? 'wide' : undefined, children: [tabs && _jsx(Tabs, { items: tabs }), children] }), _jsx(DialogHost, {}), _jsx(ToastHost, {})] }));
}
