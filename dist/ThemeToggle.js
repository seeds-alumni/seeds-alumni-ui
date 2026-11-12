import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { currentTheme, onSystemThemeChange, setTheme } from './theme';
/** 太陽・月のアイコン（js/theme.js と同じ形） */
export function ThemeIcon({ theme }) {
    return theme === 'dark' ? (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })] })) : (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }));
}
/**
 * ライト・ダークの切り替えボタン（.theme-toggle）。<AppHeader> が右端に置く。
 * 色は tokens.css の light-dark() で切り替わる。
 */
export function ThemeToggle() {
    const [theme, set] = useState(currentTheme);
    useEffect(() => onSystemThemeChange(() => set(currentTheme())), []);
    function toggle() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        set(next);
    }
    const label = theme === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
    return (_jsx("button", { type: "button", className: "theme-toggle", onClick: toggle, "aria-label": label, title: label, children: _jsx(ThemeIcon, { theme: theme }) }));
}
