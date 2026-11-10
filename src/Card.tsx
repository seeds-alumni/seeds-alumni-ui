import type { ReactNode } from 'react';

export type CardProps = {
  /** カードの見出し */
  title?: ReactNode;
  /** 見出しの段（画面の一番上のカードは h2、詳細画面で続くカードは h3） */
  level?: 2 | 3;
  /** 見出しの右側（状態のバッジ・「一覧へ」のリンク・小さいボタン） */
  actions?: ReactNode;
  /** 注意を促すカード（淡い黄色の地と枠。.warnbox） */
  tone?: 'warn';
  className?: string;
  children?: ReactNode;
};

/**
 * カード（section）。画面は「1つの目的ごとにカードを1枚」で組む。
 * 見出しと右側の操作は .row.between で両端に寄せる。
 */
export function Card({ title, level = 2, actions, tone, className, children }: CardProps) {
  const H = level === 2 ? 'h2' : 'h3';
  const cls = [tone === 'warn' ? 'warnbox' : '', className ?? ''].filter(Boolean).join(' ') || undefined;
  return (
    <section className={cls}>
      {title !== undefined && (actions ? (
        <div className="row between">
          <H>{title}</H>
          <div className="row">{actions}</div>
        </div>
      ) : <H>{title}</H>)}
      {children}
    </section>
  );
}
