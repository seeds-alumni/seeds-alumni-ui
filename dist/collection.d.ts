import { type ChangeEvent, type MouseEvent } from 'react';
/**
 * 一覧で行を選ぶ（一括操作）ための状態（docs/catalog.md §8.1）。
 * 表示している行（keys）が変わったら（絞り込み・並べ替え・ページ送り）、選択を外す。見えていない行を操作しないように
 *
 *   const sel = useSelection(rows.map((r) => r.id));
 *   <th className="check-cell"><input type="checkbox" {...sel.allProps} /></th>
 *   <td className="check-cell"><input type="checkbox" {...sel.rowProps(r.id, `${r.name}を選ぶ`)} /></td>
 *   <CollectionLayout selection={{ count: sel.count, onClear: sel.clear, actions: … }}>
 */
export declare function useSelection<K extends string | number>(keys: K[]): {
    /** 選んでいる行のキー */
    selected: ReadonlySet<K>;
    count: number;
    isSelected: (k: K) => boolean;
    toggle: (k: K, on?: boolean) => void;
    toggleAll: (on?: boolean) => void;
    clear: () => void;
    /** 見出しの行のチェックボックス（一部だけ選んでいるときは「−」の表示） */
    allProps: {
        checked: boolean;
        ref: (el: HTMLInputElement | null) => void;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        'aria-label': string;
    };
    /** 各行のチェックボックス。label は「山田 太郎を選ぶ」のように、どの行かが分かる文 */
    rowProps: (k: K, label: string) => {
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        'aria-label': string;
    };
};
/**
 * 行全体を押して詳細へ進む（tr.clickable の onClick）。行の中のリンク・ボタン・入力欄・チェックボックスの列を押したとき、
 * 文字を選んでいるときは進まない。行の中には、同じ行き先のリンクを必ず1つ置く（キーボード・読み上げで進めるように）
 *
 *   <tr className="clickable" onClick={rowClick(() => (location.hash = `#/users/${r.id}`))}>
 */
export declare function rowClick(open: () => void): (e: MouseEvent<HTMLElement>) => void;
