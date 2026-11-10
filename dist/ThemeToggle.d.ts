import { type Theme } from './theme';
/** 太陽・月のアイコン（js/theme.js と同じ形） */
export declare function ThemeIcon({ theme }: {
    theme: Theme;
}): import("react").JSX.Element;
/**
 * ライト・ダークの切り替えボタン（.theme-toggle）。<AppHeader> が右端に置く。
 * 色は tokens.css の light-dark() で切り替わる。
 */
export declare function ThemeToggle(): import("react").JSX.Element;
