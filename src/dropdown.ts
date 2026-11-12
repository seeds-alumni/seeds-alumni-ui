import { useEffect } from 'react';

/**
 * ドロップダウン（details.dropdown）を閉じる動き。外を押す・Esc・メニューの中のリンクやボタンを押すと閉じる。
 * <AppShell>・<ConsoleShell> が使うので、画面では書かない（どちらも使わない画面の枠で1回呼ぶ）。素の HTML は js/console.js
 */
export function useDropdownDismiss() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      for (const d of document.querySelectorAll<HTMLDetailsElement>('details.dropdown[open]')) {
        if (!target || !d.contains(target) || target.closest('.dropdown-menu a[href], .dropdown-menu button')) d.open = false;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      for (const d of document.querySelectorAll<HTMLDetailsElement>('details.dropdown[open]')) {
        d.open = false;
        d.querySelector<HTMLElement>('summary')?.focus();
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
}
