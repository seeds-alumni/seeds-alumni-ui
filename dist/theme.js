export const THEME_STORAGE_KEY = 'theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');
/** いま表示している方 */
export function currentTheme() {
    const t = document.documentElement.dataset.theme;
    if (t === 'light' || t === 'dark')
        return t;
    return media().matches ? 'dark' : 'light';
}
/** 表示を切り替えて残す（保存できない環境では、このページを開いているあいだだけ） */
export function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    catch {
        // プライベートブラウズなど
    }
}
/** OS の設定が変わったときに呼ぶ（選ぶ前は OS に追従するため）。戻り値で解除する */
export function onSystemThemeChange(listener) {
    const m = media();
    m.addEventListener('change', listener);
    return () => m.removeEventListener('change', listener);
}
/**
 * <head> に置くちらつき防止のスクリプト（描画の前に選んだ表示を戻す）。
 * React のアプリは index.html にこの文字列をそのまま書く（docs/usage.md）。素の HTML は js/theme.js がこれも行う
 */
export const THEME_RESTORE_SCRIPT = "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";
