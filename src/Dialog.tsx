import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * アプリ内のダイアログ（docs/catalog.md §3.9）。ブラウザの confirm() / prompt() の代わりに使う。
 * 画面の枠が <DialogHost /> を1つ置き（<AppShell> は自動で置く）、
 * 各画面は confirmDialog() / inputDialog() / formDialog() を await する。
 */

type ConfirmOptions = {
  title?: string;
  /** 決定ボタンの文字。問いの動詞と同じにする（「削除」）。既定は「続ける」なので、必ず渡す */
  okLabel?: string;
  /** 取り消せない操作（削除・停止など）。決定ボタンを .button.danger にする */
  danger?: boolean;
};

/** 入力欄1つ分 */
export type DialogField = {
  /** 結果のキー（formDialog のみ） */
  name: string;
  /** 入力欄のラベル */
  label: string;
  type?: 'text' | 'date';
  initial?: string;
  /** 空欄を許すか（既定は必須） */
  optional?: boolean;
  /** 入力欄の下の補足 */
  hint?: string;
  placeholder?: string;
};

type InputOptions = Omit<DialogField, 'name'> & {
  title: string;
  /** 決定ボタンの文字（「保存」「終了」）。既定は「決定」 */
  okLabel?: string;
};

export type FormDialogOptions = {
  title: string;
  message?: string;
  fields: DialogField[];
  /** 決定ボタンの文字（「保存」）。既定は「決定」 */
  okLabel?: string;
};

type Request =
  | ({ kind: 'confirm'; message: string; resolve: (ok: boolean) => void } & ConfirmOptions)
  | { kind: 'form'; title: string; message?: string; fields: DialogField[]; okLabel?: string; resolve: (values: Record<string, string> | null) => void };

let open: ((r: Request) => void) | null = null;

function request(r: Request) {
  if (!open) throw new Error('DialogHost が置かれていません');
  open(r);
}

/** 確認ダイアログ。決定なら true、キャンセル・Esc なら false */
export function confirmDialog(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  return new Promise((resolve) => request({ kind: 'confirm', message, ...options, resolve }));
}

/** 入力ダイアログ（1項目）。決定なら入力値（前後の空白を除く）、キャンセル・Esc なら null */
export function inputDialog(options: InputOptions & { message?: string }): Promise<string | null> {
  const { title, message, okLabel, ...field } = options;
  return new Promise((resolve) =>
    request({ kind: 'form', title, message, okLabel, fields: [{ ...field, name: 'value' }], resolve: (v) => resolve(v ? (v.value ?? '') : null) }),
  );
}

/**
 * 入力ダイアログ（複数項目）。名前と説明など、1つのものの複数の値をまとめて変更するときに使う（1.9.0）。
 * 決定なら { name: 値 }（前後の空白を除く）、キャンセル・Esc なら null
 */
export function formDialog(options: FormDialogOptions): Promise<Record<string, string> | null> {
  return new Promise((resolve) => request({ kind: 'form', ...options, resolve }));
}

export function DialogHost() {
  const [req, setReq] = useState<Request | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDialogElement>(null);
  const settled = useRef(false);

  useEffect(() => {
    open = (r) => {
      settled.current = false;
      setValues(r.kind === 'form' ? Object.fromEntries(r.fields.map((f) => [f.name, f.initial ?? ''])) : {});
      setReq(r);
    };
    return () => { open = null; };
  }, []);

  useEffect(() => {
    if (req && ref.current && !ref.current.open) ref.current.showModal();
  }, [req]);

  const missing = req?.kind === 'form' && req.fields.some((f) => !f.optional && !(values[f.name] ?? '').trim());

  const finish = (result: 'ok' | 'cancel') => {
    if (!req || settled.current) return;
    settled.current = true;
    if (req.kind === 'confirm') req.resolve(result === 'ok');
    else req.resolve(result === 'ok' ? Object.fromEntries(req.fields.map((f) => [f.name, (values[f.name] ?? '').trim()])) : null);
    ref.current?.close();
    setReq(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (missing) return;
    finish('ok');
  };

  // Esc・背景のクリックで閉じたときはキャンセル扱い
  const onClose = () => finish('cancel');

  if (!req) return <dialog ref={ref} className="dialog" onClose={onClose} />;
  const title = req.title ?? '確認';
  const okClass = req.kind === 'confirm' && req.danger ? 'button danger inline' : 'button primary inline';
  return (
    <dialog ref={ref} className="dialog" onClose={onClose} onClick={(e) => { if (e.target === ref.current) finish('cancel'); }} aria-labelledby="dialog-title">
      <form className="form" onSubmit={submit}>
        <h2 id="dialog-title">{title}</h2>
        {req.message && <p className="pre">{req.message}</p>}
        {req.kind === 'form' && req.fields.map((f, i) => (
          <label key={f.name}>
            {f.label}{f.optional && '（任意）'}
            <input
              type={f.type ?? 'text'}
              value={values[f.name] ?? ''}
              placeholder={f.placeholder}
              autoFocus={i === 0}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
            {f.hint && <span className="muted small">{f.hint}</span>}
          </label>
        ))}
        <div className="dialog-actions">
          <button className="button secondary" type="button" onClick={() => finish('cancel')}>キャンセル</button>
          <button className={okClass} type="submit" disabled={missing} autoFocus={req.kind === 'confirm'}>{req.okLabel ?? (req.kind === 'confirm' ? '続ける' : '決定')}</button>
        </div>
      </form>
    </dialog>
  );
}
