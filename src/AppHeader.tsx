import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';

export type NavItem = {
  label: ReactNode;
  href: string;
  /** いまいるセクション（このページか、この下のページを開いている）。緑の下線。ハンバーガーメニューでは最初から開いておく */
  active?: boolean;
  /** このページそのものを開いている（aria-current="page"） */
  current?: boolean;
  /** 下のページ（2段目）。ハンバーガーメニューでは、さらに下の段（3段目）まで字下げして並べる */
  children?: NavItem[];
};

export type AppHeaderProps = {
  /** サイト名（例：「SEEDS-ID マイポータル」。サービスの名前は docs/writing.md §6.1） */
  title: string;
  /** サイト名を押したときの行き先（トップ） */
  href: string;
  /** 管理画面など、幅の広い画面（main.wide とそろえる） */
  wide?: boolean;
  /** 環境名（本番以外だけ渡す）。サイト名の右に出る */
  envLabel?: string | null;
  /** 左上の四角に入れる文字（既定は S）。logoSrc を渡したときは使わない */
  mark?: string;
  /**
   * 左上に出すロゴの画像（例：'/brand/seeds-logo.svg'）。渡すと「S」の四角の代わりに、高さ 32px・白い地で出す（幅は縦横比に任せる）。
   * ロゴはこのライブラリに入れない決まりなので、画像は各アプリに置く
   */
  logoSrc?: string;
  /**
   * サイトのメニュー（ページがいくつもあるサイト）。広い画面ではヘッダーに横に並べ（.header-nav）、
   * 980px 以下ではハンバーガーメニュー（.nav-toggle・.nav-screen）にする。表示の切り替えはメニューの中に移る
   */
  nav?: NavItem[];
  /** ハンバーガーメニューの下に出す操作（ログインのボタンなど） */
  navFooter?: ReactNode;
  /** 右側の操作（ログイン中の人は .header-user、ログアウトのリンクなど）。表示の切り替えは自動で右端に付く */
  children?: ReactNode;
};

/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export function AppHeader({ title, href, wide, envLabel, mark = 'S', logoSrc, nav, navFooter, children }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const screenId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hasNav = !!nav?.length;

  return (
    <>
      <header className={wide ? 'app-header wide' : 'app-header'}>
        <div className="app-header-inner">
          <a className="brand" href={href}>
            {logoSrc ? (
              <img className="brand-mark" src={logoSrc} alt="" height={32} />
            ) : (
              <span className="brand-mark" aria-hidden="true">{mark}</span>
            )}
            <span className="brand-name">{title}</span>
          </a>
          <EnvBadge label={envLabel} />
          {hasNav && <HeaderNav items={nav} />}
          <div className="header-actions">
            {children}
            <ThemeToggle />
            {hasNav && (
              <button
                ref={toggleRef}
                type="button"
                className="nav-toggle"
                aria-controls={screenId}
                aria-expanded={open}
                aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
                onClick={() => setOpen(!open)}
              >
                <span className="nav-toggle-bars" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>
      {hasNav && <NavScreen id={screenId} items={nav} footer={navFooter} open={open} onClose={(focusBack) => {
        setOpen(false);
        if (focusBack) toggleRef.current?.focus();
      }} />}
    </>
  );
}

const linkProps = (i: NavItem) => ({ href: i.href, 'aria-current': i.current ? ('page' as const) : undefined });

/** 広い画面のメニュー（.header-nav） */
function HeaderNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="header-nav" aria-label="メニュー">
      <ul>
        {items.map((i, n) => {
          const cls = ['header-nav-item', i.children?.length ? 'has-children' : '', i.active ? 'active' : ''].filter(Boolean).join(' ');
          return (
            <li key={n} className={cls}>
              <a {...linkProps(i)}>{i.label}</a>
              {!!i.children?.length && (
                <ul className="header-nav-sub">
                  {i.children.map((c, m) => <li key={m}><a {...linkProps(c)}>{c.label}</a></li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** 980px 以下のハンバーガーメニュー（.nav-screen）。js/nav.js と同じ動き（Esc・リンクで閉じる、後ろをスクロールさせない、ほかを inert に） */
function NavScreen({ id, items, footer, open, onClose }: { id: string; items: NavItem[]; footer?: ReactNode; open: boolean; onClose: (focusBack: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const screen = ref.current;
    if (!open || !screen) return;
    const header = screen.previousElementSibling;
    document.documentElement.classList.add('nav-open');
    // ヘッダーとメニュー以外（本文・フッター）を読み上げ・フォーカスの対象から外す。
    // React ではヘッダーとメニューがアプリの要素の中にあるので、メニューから body までの各段で、ヘッダーを含まない兄弟を inert にする
    const saved: HTMLElement[] = [];
    for (let el: Element = screen; el.parentElement && el !== document.body; el = el.parentElement) {
      for (const sib of el.parentElement.children) {
        if (sib !== el && sib instanceof HTMLElement && !(header && sib.contains(header)) && !sib.inert) {
          sib.inert = true;
          saved.push(sib);
        }
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close.current(true); };
    // 画面が広くなってボタンが隠れたら閉じる
    const onResize = () => { if (!header?.querySelector<HTMLElement>('.nav-toggle')?.offsetParent) close.current(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.documentElement.classList.remove('nav-open');
      saved.forEach((el) => { el.inert = false; });
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div ref={ref} className="nav-screen" id={id} hidden={!open} onClick={(e) => { if ((e.target as Element).closest('a[href]')) onClose(false); }}>
      <nav className="nav-screen-inner" aria-label="メニュー">
        <ul className="nav-screen-list">
          {items.map((i, n) => <NavScreenItem key={n} item={i} />)}
        </ul>
        <div className="nav-screen-footer">
          <div className="nav-screen-theme">表示（ライト・ダーク）<ThemeToggle /></div>
          {footer}
        </div>
      </nav>
    </div>
  );
}

function NavScreenItem({ item }: { item: NavItem }) {
  const [expanded, setExpanded] = useState(!!item.active);
  const subId = useId();
  if (!item.children?.length) return <li><a {...linkProps(item)}>{item.label}</a></li>;
  return (
    <li>
      <div className="nav-screen-row">
        <a {...linkProps(item)}>{item.label}</a>
        <button
          type="button"
          className="nav-screen-expand"
          aria-controls={subId}
          aria-expanded={expanded}
          aria-label={typeof item.label === 'string' ? `${item.label}の下のページ` : '下のページ'}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <ul id={subId} hidden={!expanded}>
        {item.children.map((c, m) => (
          <li key={m}>
            <a {...linkProps(c)}>{c.label}</a>
            {!!c.children?.length && <ul>{c.children.map((g, k) => <li key={k}><a {...linkProps(g)}>{g.label}</a></li>)}</ul>}
          </li>
        ))}
      </ul>
    </li>
  );
}
