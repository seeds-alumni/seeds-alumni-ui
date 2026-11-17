import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
/** ドラッグしているのがファイルか（文字・リンクのドラッグには反応しない） */
const isFileDrag = (e) => [...(e.dataTransfer?.types ?? [])].includes('Files');
/**
 * ファイルのドラッグ＆ドロップ（表の行・カードなど、領域の形を問わない。<FileDrop> の中でも使う）。
 * - over：ファイルを上に重ねているあいだ true（行の色を変えるのに使う）
 * - invalid：重ねているファイルの種類が受け付けられないと分かるとき true（ドロップしても onFiles は呼ばない）
 * - props：ドロップを受け付ける要素に付ける
 */
export function useFileDrop({ accept, onFiles, disabled = false }) {
    const [over, setOver] = useState(false);
    const [invalid, setInvalid] = useState(false);
    // 子の要素に入るたびに dragenter・dragleave が来るので、数えて外に出たときだけ消す
    const depth = useRef(0);
    function enter(e) {
        if (!isFileDrag(e))
            return;
        e.preventDefault();
        depth.current++;
        // ドラッグ中はファイルの種類（MIME）だけが分かる。種類が空のもの（Windows の CSV など）は受け付ける
        const items = [...e.dataTransfer.items].filter((i) => i.kind === 'file');
        setInvalid(!disabled && items.length > 0 && items.every((i) => i.type !== '' && !accept({ name: '', type: i.type })));
        setOver(true);
    }
    function overHandler(e) {
        if (!isFileDrag(e))
            return;
        e.preventDefault();
        e.dataTransfer.dropEffect = disabled || invalid ? 'none' : 'copy';
    }
    function leave(e) {
        if (!isFileDrag(e))
            return;
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) {
            setOver(false);
            setInvalid(false);
        }
    }
    function drop(e) {
        if (!isFileDrag(e))
            return;
        e.preventDefault();
        e.stopPropagation();
        depth.current = 0;
        setOver(false);
        setInvalid(false);
        if (disabled)
            return;
        const files = [...e.dataTransfer.files];
        if (files.length)
            onFiles(files);
    }
    return { over, invalid, props: { onDragEnter: enter, onDragOver: overHandler, onDragLeave: leave, onDrop: drop } };
}
/**
 * 領域の外にファイルを落としたときに、ブラウザがファイルを開いて入力中の内容が消えないようにする。
 * ドロップを受け付ける画面で呼ぶ（<FileDrop> は呼ばないので、画面で1回呼ぶ）
 */
export function usePreventFileNavigation() {
    useEffect(() => {
        const stop = (e) => {
            // ドロップ領域（useFileDrop）が受け付けたものは触らない。window には領域の後に届くので、
            // ここで dropEffect を 'none' にすると領域の 'copy' を上書きし、ドロップできなくなる（1.8.0 の不具合）
            if (!isFileDrag(e) || e.defaultPrevented)
                return;
            e.preventDefault();
            if (e.type === 'dragover' && e.dataTransfer)
                e.dataTransfer.dropEffect = 'none';
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
export function splitFiles(files, accept) {
    const ok = [];
    const ng = [];
    for (const f of files)
        (accept(f) ? ok : ng).push(f);
    return { ok, ng };
}
/**
 * ファイルのドロップ領域（freee のデザインシステム vibes の FileUploader を参考にした形。コードは写していない）。
 * 点線の枠の中に「〇〇をここにドラッグ＆ドロップ」と「ファイルを選ぶ」のボタン。指で操作する端末ではドラッグの案内を出さず、
 * 「写真を撮影」（camera のとき）と「ファイルを選ぶ」を出す。
 * ファイルを重ねると枠と地の色が変わり「ドロップして〇〇」に、種類が合わなければ「このファイルの種類は受け付けられません」に変わる。
 * 受け付けないファイルを落としたときは、枠の下に理由を出す（onFiles には受け付けるファイルだけを渡す）
 */
export function FileDrop({ label, dropLabel, accept, inputAccept, multiple = false, camera = false, disabled = false, disabledMessage, busy, selected, hint, rejectHint, compact = false, icons = {}, onFiles, }) {
    const [rejected, setRejected] = useState('');
    const off = disabled || !!busy;
    function take(files) {
        if (off)
            return;
        const list = multiple ? files : files.slice(0, 1);
        const { ok, ng } = splitFiles(list, accept);
        const notes = [];
        if (ng.length)
            notes.push(`${ng.map((f) => f.name).join('・')} は受け付けられません。${rejectHint}`);
        if (!multiple && files.length > 1)
            notes.push('ファイルは1つだけ選んでください。');
        setRejected(notes.join(''));
        if (ok.length)
            onFiles(ok);
    }
    const { over, invalid, props } = useFileDrop({ accept, onFiles: take, disabled: off });
    function onInput(e) {
        const files = [...(e.target.files ?? [])];
        // 同じファイルをもう一度選んでも change が来るように空にする
        e.target.value = '';
        if (files.length)
            take(files);
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
    return (_jsxs("div", { className: "file-drop-wrap", children: [_jsxs("div", { className: cls, ...props, children: [stateIcon && _jsx("span", { className: "file-drop-icon", children: stateIcon }), _jsxs("div", { className: "file-drop-body", children: [_jsx("p", { className: "file-drop-title", children: title ?? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "no-touch", children: [label, "\u3092\u3053\u3053\u306B\u30C9\u30E9\u30C3\u30B0\uFF06\u30C9\u30ED\u30C3\u30D7"] }), _jsx("span", { className: "only-touch", children: camera ? `${label}を選ぶか、写真を撮影してください` : `${label}を選んでください` })] })) }), _jsxs("div", { className: "row file-drop-actions", children: [!selected && _jsx("span", { className: "no-touch muted small", children: "\u307E\u305F\u306F" }), camera && (_jsxs("label", { className: "button secondary file-button only-touch", children: [icons.camera, "\u5199\u771F\u3092\u64AE\u5F71", _jsx("input", { type: "file", className: "visually-hidden", accept: "image/*", capture: "environment", disabled: off, onChange: onInput })] })), _jsxs("label", { className: `button ${selected ? 'small-btn' : 'secondary'} file-button`, children: [selected ? '別のファイルを選ぶ' : _jsxs(_Fragment, { children: [icons.choose, "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u3076"] }), _jsx("input", { type: "file", className: "visually-hidden", accept: inputAccept, multiple: multiple, disabled: off, onChange: onInput })] })] }), busy && _jsx("p", { className: "muted small", role: "status", children: busy }), disabled && disabledMessage && !busy && _jsx("p", { className: "muted small", children: disabledMessage })] })] }), hint && _jsx("p", { className: "muted small file-drop-hint", children: hint }), rejected && (_jsx("p", { className: "file-drop-error small", role: "alert", children: rejected }))] }));
}
