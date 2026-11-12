/*
 * ハンバーガーメニューの開け閉め（素の HTML 向け）。@seeds-alumni/ui
 *
 * 使い方：<script src="https://ui.seeds-alumni.jp/v1/nav.js" defer></script>
 *   - <button class="nav-toggle" aria-controls="（.nav-screen の id）" aria-expanded="false"> を押すと、.nav-screen の hidden を外す
 *   - <button class="nav-screen-expand" aria-controls="（下のページの ul の id）" aria-expanded="…"> を押すと、下のページを開け閉めする
 * 開いているあいだは：html に .nav-open（後ろのページをスクロールさせない）、ヘッダーとメニュー以外を inert にする。
 * 閉じるとき：もう一度押す、Esc、メニューの中のリンクを押す、画面が広くなって .nav-toggle が隠れる
 * マークアップは docs/usage.md
 */
(() => {
  const setup = () => {
    for (const button of document.querySelectorAll('button.nav-toggle[aria-controls]')) {
      if (button.closest('.console-header')) continue; // 管理コンソールの左のメニューは js/console.js が開け閉めする
      const screen = document.getElementById(button.getAttribute('aria-controls'));
      if (!screen) continue;
      const header = button.closest('header');
      let saved = [];
      const isOpen = () => button.getAttribute('aria-expanded') === 'true';
      const set = (open, focusBack) => {
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        screen.hidden = !open;
        document.documentElement.classList.toggle('nav-open', open);
        if (open) {
          // ヘッダーとメニュー以外（本文・フッター）を読み上げ・フォーカスの対象から外す
          saved = [...document.body.children].filter((el) => el !== screen && el !== header && !el.contains(header) && !el.inert);
          saved.forEach((el) => { el.inert = true; });
        } else {
          saved.forEach((el) => { el.inert = false; });
          saved = [];
          if (focusBack) button.focus();
        }
      };
      set(isOpen(), false);
      button.addEventListener('click', () => set(!isOpen(), false));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) set(false, true);
      });
      // メニューの中のリンク（同じページの #見出し へのリンクでも）を押したら閉じる
      screen.addEventListener('click', (e) => {
        if (e.target.closest('a[href]')) set(false, false);
      });
      // 画面が広くなってボタンが隠れたら閉じる
      window.addEventListener('resize', () => {
        if (isOpen() && !button.offsetParent) set(false, false);
      });
      // 戻るボタンでページに戻ったとき（bfcache）に、開いたまま残さない
      window.addEventListener('pageshow', (e) => {
        if (e.persisted && isOpen()) set(false, false);
      });
    }

    for (const button of document.querySelectorAll('button.nav-screen-expand[aria-controls]')) {
      const list = document.getElementById(button.getAttribute('aria-controls'));
      if (!list) continue;
      list.hidden = button.getAttribute('aria-expanded') !== 'true';
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
