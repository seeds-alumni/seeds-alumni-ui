/*
 * ライト・ダークの切り替え（素の HTML 向け。React は <ThemeToggle> を使う）。@seeds-alumni/ui
 *
 * 使い方：<head> の中で、CSS より前に読み込む（defer を付けない）。
 *   <script src="https://ui.seeds-alumni.jp/v1/theme.js"></script>
 *   1. 読み込んだ時点で、選んだ表示（localStorage の theme）を <html data-theme> に戻す（ちらつき防止）
 *   2. 画面ができたら、<button class="theme-toggle"></button> にアイコンと切り替えの動きを付ける
 * 決まりは React 版（src/theme.ts）と同じ。localStorage の名前も同じなので、同じドメインの React の画面と表示がそろう
 */
(() => {
  const KEY = 'theme';
  const root = document.documentElement;
  try {
    const t = localStorage.getItem(KEY);
    if (t === 'light' || t === 'dark') root.dataset.theme = t;
  } catch (e) {
    // 保存できない環境では OS の設定に従う
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const current = () => {
    const t = root.dataset.theme;
    if (t === 'light' || t === 'dark') return t;
    return media.matches ? 'dark' : 'light';
  };
  const render = (button) => {
    const dark = current() === 'dark';
    const label = dark ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
    button.innerHTML = dark ? SUN : MOON;
    button.setAttribute('aria-label', label);
    button.title = label;
  };
  const setup = () => {
    const buttons = [...document.querySelectorAll('button.theme-toggle')];
    const renderAll = () => buttons.forEach(render);
    buttons.forEach((button) => {
      if (!button.type) button.type = 'button';
      button.addEventListener('click', () => {
        const next = current() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try {
          localStorage.setItem(KEY, next);
        } catch (e) {
          // このページを開いているあいだだけ切り替える
        }
        renderAll();
      });
    });
    media.addEventListener('change', renderAll);
    renderAll();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
