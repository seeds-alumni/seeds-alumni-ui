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
/** 確認ダイアログ。決定なら true、キャンセル・Esc なら false */
export declare function confirmDialog(message: string, options?: ConfirmOptions): Promise<boolean>;
/** 入力ダイアログ（1項目）。決定なら入力値（前後の空白を除く）、キャンセル・Esc なら null */
export declare function inputDialog(options: InputOptions & {
    message?: string;
}): Promise<string | null>;
/**
 * 入力ダイアログ（複数項目）。名前と説明など、1つのものの複数の値をまとめて変更するときに使う（1.9.0）。
 * 決定なら { name: 値 }（前後の空白を除く）、キャンセル・Esc なら null
 */
export declare function formDialog(options: FormDialogOptions): Promise<Record<string, string> | null>;
export declare function DialogHost(): import("react").JSX.Element;
export {};
