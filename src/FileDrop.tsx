import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react';

/** ファイルの種類の確かめ。ドラッグ中は名前が分からないので name は空（種類だけで判断し、分からなければ受け付ける） */
export type FileCheck = (f: { name: string; type: string }) => boolean;

/** ドラッグしているのがファイルか（文字・リンクのドラッグには反応しない） */
const isFileDrag = (e: DragEvent | globalThis.DragEvent) => [...(e.dataTransfer?.types ?? [])].includes('Files');

/**
 * ファイルのドラッグ＆ドロップ（表の行・カードなど、領域の形を問わない。<FileDrop> の中でも使う）。
 * - over：ファイルを上に重ねているあいだ true（行の色を変えるのに使う）
 * - invalid：重ねているファイルの種類が受け付けられないと分かるとき true（ドロップしても onFiles は呼ばない）
 * - props：ドロップを受け付ける要素に付ける
 */
export function useFileDrop({ accept, onFiles, disabled = false }: { accept: FileCheck; onFiles: (files: File[]) => void; disabled?: boolean }) {
  const [over, setOver] = useState(false);
  const [invalid, setInvalid] = useState(false);
  // 子の要素に入るたびに dragenter・dragleave が来るので、数えて外に出たときだけ消す
  const depth = useRef(0);

  function enter(e: DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    depth.current++;
    // ドラッグ中はファイルの種類（MIME）だけが分かる。種類が空のもの（Windows の CSV など）は受け付ける
    const items = [...e.dataTransfer.items].filter((i) => i.kind === 'file');
    setInvalid(!disabled && items.length > 0 && items.every((i) => i.type !== '' && !accept({ name: '', type: i.type })));
    setOver(true);
  }
  function overHandler(e: DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = disabled || invalid ? 'none' : 'copy';
  }
  function leave(e: DragEvent) {
    if (!isFileDrag(e)) return;
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) {
      setOver(false);
      setInvalid(false);
    }
  }
  function drop(e: DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    depth.current = 0;
    setOver(false);
    setInvalid(false);
    if (disabled) return;
    const files = [...e.dataTransfer.files];
    if (files.length) onFiles(files);
  }
  return { over, invalid, props: { onDragEnter: enter, onDragOver: overHandler, onDragLeave: leave, onDrop: drop } };
}

/**
 * 領域の外にファイルを落としたときに、ブラウザがファイルを開いて入力中の内容が消えないようにする。
 * ドロップを受け付ける画面で呼ぶ（<FileDrop> は呼ばないので、画面で1回呼ぶ）
 */
export function usePreventFileNavigation() {
  useEffect(() => {
    const stop = (e: globalThis.DragEvent) => {
      if (!isFileDrag(e)) return;
      e.preventDefault();
      if (e.type === 'dragover' && e.dataTransfer) e.dataTransfer.dropEffect = 'none';
    };
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);
}

/** 受け付けるファイルと、受け付けないファイルに分ける */
export function splitFiles(files: File[], accept: FileCheck) {
  const ok: File[] = [];
  const ng: File[] = [];
  for (const f of files) (accept(f) ? ok : ng).push(f);
  return { ok, ng };
}

/**
 * ドロップ領域のアイコン。共通 UI はアイコンを配らないので、各アプリが Lucide の SVG を渡す（docs/catalog.md §3.12）。
 * 渡さなければ丸いアイコンを出さない
 */
export type FileDropIcons = {
  /** いつもの形（例：cloud-upload） */
  drop?: ReactNode;
  /** 受け付けないファイルを重ねている（例：ban） */
  invalid?: ReactNode;
  /** ファイルを選んだあと（例：file-check） */
  selected?: ReactNode;
  /** 「ファイルを選ぶ」のボタン（例：paperclip。証憑など） */
  choose?: ReactNode;
  /** 「写真を撮影」のボタン（例：camera） */
  camera?: ReactNode;
};

export type FileDropProps = {
  /** 何をドロップするか（「証憑のファイル」「CSV ファイル」）。「〇〇をここにドラッグ＆ドロップ」になる */
  label: string;
  /** ドロップしたときにすること（「アップロード」「読み込む」）。重ねているあいだ「ドロップして〇〇」と出す */
  dropLabel: string;
  /** 受け付けるファイルか（ドロップ・選んだとき。ドラッグ中は name が空で type だけ） */
  accept: FileCheck;
  /** ファイルを選ぶ画面の accept（「.csv,text/csv」） */
  inputAccept: string;
  multiple?: boolean;
  /** 指で操作する端末で「写真を撮影」も出す */
  camera?: boolean;
  disabled?: boolean;
  /** disabled のときに出す理由 */
  disabledMessage?: string;
  /** アップロード中などの知らせ（出しているあいだは選べない） */
  busy?: string;
  /** 選んだファイルの名前（1つだけ選ぶとき。出すと実線の枠になり、ボタンは「別のファイルを選ぶ」） */
  selected?: string;
  /** 枠の下の補足（受け付けるファイルの種類・大きさ） */
  hint?: ReactNode;
  /** 受け付けないファイルを落としたときに添える説明（「JPEG・PNG・WebP の画像か PDF だけです。」） */
  rejectHint: string;
  /** 低い形（フォームの1項目の中） */
  compact?: boolean;
  icons?: FileDropIcons;
  /** 受け付けるファイルだけを渡す */
  onFiles: (files: File[]) => void;
};

/**
 * ファイルのドロップ領域（freee のデザインシステム vibes の FileUploader を参考にした形。コードは写していない）。
 * 点線の枠の中に「〇〇をここにドラッグ＆ドロップ」と「ファイルを選ぶ」のボタン。指で操作する端末ではドラッグの案内を出さず、
 * 「写真を撮影」（camera のとき）と「ファイルを選ぶ」を出す。
 * ファイルを重ねると枠と地の色が変わり「ドロップして〇〇」に、種類が合わなければ「このファイルの種類は受け付けられません」に変わる。
 * 受け付けないファイルを落としたときは、枠の下に理由を出す（onFiles には受け付けるファイルだけを渡す）
 */
export function FileDrop({
  label,
  dropLabel,
  accept,
  inputAccept,
  multiple = false,
  camera = false,
  disabled = false,
  disabledMessage,
  busy,
  selected,
  hint,
  rejectHint,
  compact = false,
  icons = {},
  onFiles,
}: FileDropProps) {
  const [rejected, setRejected] = useState('');
  const off = disabled || !!busy;

  function take(files: File[]) {
    if (off) return;
    const list = multiple ? files : files.slice(0, 1);
    const { ok, ng } = splitFiles(list, accept);
    const notes: string[] = [];
    if (ng.length) notes.push(`${ng.map((f) => f.name).join('・')} は受け付けられません。${rejectHint}`);
    if (!multiple && files.length > 1) notes.push('ファイルは1つだけ選んでください。');
    setRejected(notes.join(''));
    if (ok.length) onFiles(ok);
  }
  const { over, invalid, props } = useFileDrop({ accept, onFiles: take, disabled: off });

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    // 同じファイルをもう一度選んでも change が来るように空にする
    e.target.value = '';
    if (files.length) take(files);
  }

  const cls = ['file-drop', compact && 'compact', over && !off && !invalid && 'is-over', over && (invalid || off) && 'is-invalid', selected && 'is-selected', off && 'is-disabled'].filter(Boolean).join(' ');
  const title = over
    ? off
      ? (busy ?? disabledMessage ?? 'いまはドロップできません')
      : invalid
        ? 'このファイルの種類は受け付けられません'
        : `ドロップして${dropLabel}`
    : (selected ?? null);

  const stateIcon = over && (invalid || off) ? (icons.invalid ?? icons.drop) : selected && !over ? (icons.selected ?? icons.drop) : icons.drop;

  return (
    <div className="file-drop-wrap">
      <div className={cls} {...props}>
        {stateIcon && <span className="file-drop-icon">{stateIcon}</span>}
        <div className="file-drop-body">
          <p className="file-drop-title">
            {title ?? (
              <>
                <span className="no-touch">{label}をここにドラッグ＆ドロップ</span>
                <span className="only-touch">{camera ? `${label}を選ぶか、写真を撮影してください` : `${label}を選んでください`}</span>
              </>
            )}
          </p>
          <div className="row file-drop-actions">
            {!selected && <span className="no-touch muted small">または</span>}
            {camera && (
              <label className="button secondary file-button only-touch">
                {icons.camera}写真を撮影
                <input type="file" className="visually-hidden" accept="image/*" capture="environment" disabled={off} onChange={onInput} />
              </label>
            )}
            <label className={`button ${selected ? 'small-btn' : 'secondary'} file-button`}>
              {selected ? '別のファイルを選ぶ' : <>{icons.choose}ファイルを選ぶ</>}
              <input type="file" className="visually-hidden" accept={inputAccept} multiple={multiple} disabled={off} onChange={onInput} />
            </label>
          </div>
          {busy && <p className="muted small" role="status">{busy}</p>}
          {disabled && disabledMessage && !busy && <p className="muted small">{disabledMessage}</p>}
        </div>
      </div>
      {hint && <p className="muted small file-drop-hint">{hint}</p>}
      {rejected && (
        <p className="file-drop-error small" role="alert">
          {rejected}
        </p>
      )}
    </div>
  );
}
