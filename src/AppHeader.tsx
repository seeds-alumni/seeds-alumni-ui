import type { ReactNode } from 'react';
import { EnvBadge } from './EnvBadge';
import { ThemeToggle } from './ThemeToggle';

export type AppHeaderProps = {
  /** サイト名（例：「SEEDS同窓会 会員ポータル」。「SEEDS同窓会」の間に空白を入れない） */
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
   * 左上に出すロゴの画像（正方形。例：'/brand/seeds-icon.png'）。渡すと「S」の四角の代わりに出す。
   * ロゴはこのライブラリに入れない決まりなので、画像は各アプリに置く
   */
  logoSrc?: string;
  /** 右側の操作（ログイン中の人は .header-user、ログアウトのリンクなど）。表示の切り替えは自動で右端に付く */
  children?: ReactNode;
};

/** 画面上部に固定するヘッダー（.app-header）。素の HTML で同じものを作るときは docs/usage.md のマークアップを使う */
export function AppHeader({ title, href, wide, envLabel, mark = 'S', logoSrc, children }: AppHeaderProps) {
  return (
    <header className={wide ? 'app-header wide' : 'app-header'}>
      <div className="app-header-inner">
        <a className="brand" href={href}>
          {logoSrc ? (
            <img className="brand-mark" src={logoSrc} alt="" width={32} height={32} />
          ) : (
            <span className="brand-mark" aria-hidden="true">{mark}</span>
          )}
          <span className="brand-name">{title}</span>
        </a>
        <EnvBadge label={envLabel} />
        <div className="header-actions">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
