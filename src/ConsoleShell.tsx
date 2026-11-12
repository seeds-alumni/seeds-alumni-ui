import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { DialogHost } from './Dialog';
import { useDropdownDismiss } from './dropdown';
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';
import { ToastHost } from './Toast';

export type SideNavItem = {
  label: ReactNode;
  href: string;
  /** 左のアイコン（Lucide から写した SVG。stroke="currentColor"。docs/catalog.md §3.12）。アイコンは各アプリが持つ */
  icon?: ReactNode;
  /** いまの画面（淡いブランド色の地と緑の太字。aria-current="page"） */
  current?: boolean;
  /** 右の件数（審査待ちの数など。<span className="count"> になる） */
  count?: ReactNode;
};
export type SideNavGroup = {
  /** まとまりの小さい見出し（「会員管理」「セキュリティ」）。いちばん上のまとまりは無くてよい */
  label?: ReactNode;
  items: SideNavItem[];
};

export type ConsoleShellProps = {
  /** サイト名（例：「SEEDS同窓会」） */
  title: string;
  /** サイト名を押したときの行き先（ダッシュボード） */
  href: string;
  /** サイト名の右の札（既定は「管理コンソール」。null で出さない） */
  label?: ReactNode;
  /** 環境名（本番以外だけ渡す） */
  envLabel?: string | null;
  /** 左上の四角に入れる文字（既定は S）。logoSrc を渡したときは使わない */
  mark?: string;
  /** 左上のロゴの画像（各アプリに置く） */
  logoSrc?: string;
  /** ヘッダーの中央の全体の検索（<span className="search-field"><input type="search" aria-label=… /></span>）。⌘K / Ctrl+K で移る */
  search?: ReactNode;
  /** ヘッダーの右の操作（.icon-button のヘルプ・お知らせ、ログイン中の人の .dropdown）。表示の切り替えは自動で右端に付く */
  actions?: ReactNode;
  /** 左のメニュー */
  nav: SideNavGroup[];
  /** 左のメニューのいちばん下（版・会員ページへのリンクなど） */
  navFooter?: ReactNode;
  children: ReactNode;
};

/**
 * 管理コンソールの枠（docs/catalog.md §3.11・§4.6）：上のヘッダー（サイト名・全体の検索・操作）＋左のメニュー＋本文。
 * 980px 以下では左のメニューを隠し、ヘッダーの左の3本線で引き出す。<DialogHost>・<ToastHost> も置く。
 * 本文には <PageHeader> と <CollectionLayout>・<Card> を並べる
 */
export function ConsoleShell({ title, href, label = '管理コンソール', envLabel, mark = 'S', logoSrc, search, actions, nav, navFooter, children }: ConsoleShellProps) {
  const [open, setOpen] = useState(false);
  const sideId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sideRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  useDropdownDismiss();

  const close = (focusBack: boolean) => {
    setOpen(false);
    if (focusBack) toggleRef.current?.focus();
  };

  // ⌘K / Ctrl+K で全体の検索へ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const input = searchRef.current?.querySelector('input');
        if (input && input.offsetParent) {
          e.preventDefault();
          input.focus();
          input.select();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 狭い画面で引き出しているあいだ：本文を操作の対象から外す。Esc・画面が広くなったら閉じる
  useEffect(() => {
    if (!open) return;
    if (mainRef.current) mainRef.current.inert = true;
    sideRef.current?.querySelector<HTMLElement>('a[aria-current="page"], a')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(true); };
    const onResize = () => { if (!toggleRef.current?.offsetParent) close(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      if (mainRef.current) mainRef.current.inert = false;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div className="console">
      <header className="console-header">
        <div className="console-header-inner">
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-controls={sideId}
            aria-expanded={open}
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            onClick={() => setOpen(!open)}
          >
            <span className="nav-toggle-bars" aria-hidden="true" />
          </button>
          <a className="brand" href={href}>
            {logoSrc ? <img className="brand-mark" src={logoSrc} alt="" height={32} /> : <span className="brand-mark" aria-hidden="true">{mark}</span>}
            <span className="brand-name">{title}</span>
          </a>
          {label != null && <span className="tag brand">{label}</span>}
          <EnvBadge label={envLabel} />
          {search && <div ref={searchRef} className="console-search" role="search">{search}</div>}
          <div className="header-actions">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="console-scrim" hidden={!open} onClick={() => close(true)} />
      <nav
        ref={sideRef}
        id={sideId}
        className={open ? 'console-sidebar open' : 'console-sidebar'}
        aria-label="メニュー"
        onClick={(e) => { if (open && (e.target as Element).closest('a[href]')) close(false); }}
      >
        {nav.map((g, n) => (
          <div key={n} className="side-nav-group">
            {g.label != null && <p className="side-nav-label">{g.label}</p>}
            <ul>
              {g.items.map((i, m) => (
                <li key={m}>
                  <a href={i.href} aria-current={i.current ? 'page' : undefined}>
                    {i.icon}
                    <span>{i.label}</span>
                    {i.count != null && <span className="count">{i.count}<span className="visually-hidden">件</span></span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {navFooter}
      </nav>
      <main ref={mainRef} className="console-main">{children}</main>
      <DialogHost />
      <ToastHost />
    </div>
  );
}
