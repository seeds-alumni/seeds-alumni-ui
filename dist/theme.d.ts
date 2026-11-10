/**
 * ライト・ダークの表示の共通処理。React（ThemeToggle）と素の HTML（js/theme.js）で同じ決まりにする：
 * 選んだ表示は localStorage の theme に残し、<html data-theme="light|dark"> に入れる。選ぶまでは OS の設定に従う。
 */
export type Theme = 'light' | 'dark';
export declare const THEME_STORAGE_KEY = "theme";
/** いま表示している方 */
export declare function currentTheme(): Theme;
/** 表示を切り替えて残す（保存できない環境では、このページを開いているあいだだけ） */
export declare function setTheme(theme: Theme): void;
/** OS の設定が変わったときに呼ぶ（選ぶ前は OS に追従するため）。戻り値で解除する */
export declare function onSystemThemeChange(listener: () => void): () => void;
/**
 * <head> に置くちらつき防止のスクリプト（描画の前に選んだ表示を戻す）。
 * React のアプリは index.html にこの文字列をそのまま書く（docs/usage.md）。素の HTML は js/theme.js がこれも行う
 */
export declare const THEME_RESTORE_SCRIPT = "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";
