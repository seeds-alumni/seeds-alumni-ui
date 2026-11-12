/*
 * 管理コンソールの枠とドロップダウンの動き（素の HTML 向け）。@seeds-alumni/ui。React では <ConsoleShell>・<AppShell> が同じことをする
 *
 * 使い方：<script src="https://ui.seeds-alumni.jp/v1/console.js" defer></script>（マークアップは demo/console.html）
 *   - 左のメニュー：.console-header の <button class="nav-toggle" aria-controls="（.console-sidebar の id）"> を押すと、
 *     狭い画面（980px 以下）で .console-sidebar に .open を付けて引き出す。Esc・幕（.console-scrim）・メニューの中のリンクで閉じる
 *   - 全体の検索：⌘K / Ctrl+K で .console-search の入力欄へ移る
 *   - ドロップダウン（details.dropdown）：外を押す・Esc・メニューの中のリンクやボタンを押すと閉じる。1つ開くと、ほかは閉じる
 */
(() => {
  const setupDropdowns = () => {
    document.addEventListener('click', (e) => {
      for (const d of document.querySelectorAll('details.dropdown[open]')) {
        const inside = d.contains(e.target);
        // 外を押した、またはメニューの中のリンク・ボタンを押した（チェックボックスの label は開いたまま）
        if (!inside || e.target.closest('.dropdown-menu a[href], .dropdown-menu button')) d.open = false;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      for (const d of document.querySelectorAll('details.dropdown[open]')) {
        d.open = false;
        d.querySelector('summary')?.focus();
      }
    });
  };

  const setupConsole = () => {
    const button = document.querySelector('.console-header button.nav-toggle[aria-controls]');
    const sidebar = button && document.getElementById(button.getAttribute('aria-controls'));
    const scrim = document.querySelector('.console-scrim');
    const main = document.querySelector('.console-main');
    if (button && sidebar) {
      const isOpen = () => button.getAttribute('aria-expanded') === 'true';
      const set = (open, focusBack) => {
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        sidebar.classList.toggle('open', open);
        if (scrim) scrim.hidden = !open;
        if (main) main.inert = open;
        if (open) sidebar.querySelector('a[aria-current="page"], a')?.focus();
        else if (focusBack) button.focus();
      };
      set(false, false);
      button.addEventListener('click', () => set(!isOpen(), false));
      scrim?.addEventListener('click', () => set(false, true));
      sidebar.addEventListener('click', (e) => { if (isOpen() && e.target.closest('a[href]')) set(false, false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) set(false, true); });
      window.addEventListener('resize', () => { if (isOpen() && !button.offsetParent) set(false, false); });
      window.addEventListener('pageshow', (e) => { if (e.persisted && isOpen()) set(false, false); });
    }
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const input = document.querySelector('.console-search input');
        if (input && input.offsetParent) { e.preventDefault(); input.focus(); input.select(); }
      }
    });
  };

  const setup = () => { setupDropdowns(); setupConsole(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
