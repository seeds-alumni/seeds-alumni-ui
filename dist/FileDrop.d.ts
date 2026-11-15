import { type DragEvent, type ReactNode } from 'react';
/** ファイルの種類の確かめ。ドラッグ中は名前が分からないので name は空（種類だけで判断し、分からなければ受け付ける） */
export type FileCheck = (f: {
    name: string;
    type: string;
}) => boolean;
/**
 * ファイルのドラッグ＆ドロップ（表の行・カードなど、領域の形を問わない。<FileDrop> の中でも使う）。
 * - over：ファイルを上に重ねているあいだ true（行の色を変えるのに使う）
 * - invalid：重ねているファイルの種類が受け付けられないと分かるとき true（ドロップしても onFiles は呼ばない）
 * - props：ドロップを受け付ける要素に付ける
 */
export declare function useFileDrop({ accept, onFiles, disabled }: {
    accept: FileCheck;
    onFiles: (files: File[]) => void;
    disabled?: boolean;
}): {
    over: boolean;
    invalid: boolean;
    props: {
        onDragEnter: (e: DragEvent) => void;
        onDragOver: (e: DragEvent) => void;
        onDragLeave: (e: DragEvent) => void;
        onDrop: (e: DragEvent) => void;
    };
};
/**
 * 領域の外にファイルを落としたときに、ブラウザがファイルを開いて入力中の内容が消えないようにする。
 * ドロップを受け付ける画面で呼ぶ（<FileDrop> は呼ばないので、画面で1回呼ぶ）
 */
export declare function usePreventFileNavigation(): void;
/** 受け付けるファイルと、受け付けないファイルに分ける */
export declare function splitFiles(files: File[], accept: FileCheck): {
    ok: File[];
    ng: File[];
};
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
export declare function FileDrop({ label, dropLabel, accept, inputAccept, multiple, camera, disabled, disabledMessage, busy, selected, hint, rejectHint, compact, icons, onFiles, }: FileDropProps): import("react").JSX.Element;
