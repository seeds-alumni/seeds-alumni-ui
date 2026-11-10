import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * アプリ内のダイアログ（docs/catalog.md「ダイアログ」）。ブラウザの confirm() / prompt() の代わりに使う。
 * 画面の枠が <DialogHost /> を1つ置き（<AppShell> は自動で置く）、
 * 各画面は confirmDialog() / inputDialog() を await する。
 */

type ConfirmOptions = {
  title?: string;
  /** 決定ボタンの文字（既定は「OK」） */
  okLabel?: string;
  /** 取り消せない操作（削除・停止など）。決定ボタンを .button.danger にする */
  danger?: boolean;
};

type InputOptions = {
  title: string;
  /** 入力欄のラベル */
  label: string;
  type?: 'text' | 'date';
  initial?: string;
  /** 空欄を許すか（既定は必須） */
  optional?: boolean;
  /** 入力欄の下の補足 */
  hint?: string;
  placeholder?: string;
  okLabel?: string;
};

type Request =
  | ({ kind: 'confirm'; message: string; resolve: (ok: boolean) => void } & ConfirmOptions)
  | ({ kind: 'input'; message?: string; resolve: (value: string | null) => void } & InputOptions);

let open: ((r: Request) => void) | null = null;

/** 確認ダイアログ。OK なら true、キャンセル・Esc なら false */
export function confirmDialog(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!open) throw new Error('DialogHost が置かれていません');
    open({ kind: 'confirm', message, ...options, resolve });
  });
}

/** 入力ダイアログ。決定なら入力値（前後の空白を除く）、キャンセル・Esc なら null */
export function inputDialog(options: InputOptions & { message?: string }): Promise<string | null> {
  return new Promise((resolve) => {
    if (!open) throw new Error('DialogHost が置かれていません');
    open({ kind: 'input', ...options, resolve });
  });
}

export function DialogHost() {
  const [req, setReq] = useState<Request | null>(null);
  const [value, setValue] = useState('');
  const ref = useRef<HTMLDialogElement>(null);
  const settled = useRef(false);

  useEffect(() => {
    open = (r) => {
      settled.current = false;
      setValue(r.kind === 'input' ? (r.initial ?? '') : '');
      setReq(r);
    };
    return () => { open = null; };
  }, []);

  useEffect(() => {
    if (req && ref.current && !ref.current.open) ref.current.showModal();
  }, [req]);

  const finish = (result: 'ok' | 'cancel') => {
    if (!req || settled.current) return;
    settled.current = true;
    if (req.kind === 'confirm') req.resolve(result === 'ok');
    else req.resolve(result === 'ok' ? value.trim() : null);
    ref.current?.close();
    setReq(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (req?.kind === 'input' && !req.optional && !value.trim()) return;
    finish('ok');
  };

  // Esc・背景のクリックで閉じたときはキャンセル扱い
  const onClose = () => finish('cancel');

  if (!req) return <dialog ref={ref} className="dialog" onClose={onClose} />;
  const title = req.title ?? '確認';
  const okClass = req.kind === 'confirm' && req.danger ? 'button danger inline' : 'button primary inline';
  const disabled = req.kind === 'input' && !req.optional && !value.trim();
  return (
    <dialog ref={ref} className="dialog" onClose={onClose} onClick={(e) => { if (e.target === ref.current) finish('cancel'); }} aria-labelledby="dialog-title">
      <form className="form" onSubmit={submit}>
        <h2 id="dialog-title">{title}</h2>
        {req.message && <p className="pre">{req.message}</p>}
        {req.kind === 'input' && (
          <label>
            {req.label}{req.optional && '（任意）'}
            <input type={req.type ?? 'text'} value={value} placeholder={req.placeholder} autoFocus onChange={(e) => setValue(e.target.value)} />
            {req.hint && <span className="muted small">{req.hint}</span>}
          </label>
        )}
        <div className="dialog-actions">
          <button className="button secondary" type="button" onClick={() => finish('cancel')}>キャンセル</button>
          <button className={okClass} type="submit" disabled={disabled} autoFocus={req.kind === 'confirm'}>{req.okLabel ?? 'OK'}</button>
        </div>
      </form>
    </dialog>
  );
}
