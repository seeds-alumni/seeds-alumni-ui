import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';

/**
 * 一覧で行を選ぶ（一括操作）ための状態（docs/catalog.md §8.1）。
 * 表示している行（keys）が変わったら（絞り込み・並べ替え・ページ送り）、選択を外す。見えていない行を操作しないように
 *
 *   const sel = useSelection(rows.map((r) => r.id));
 *   <th className="check-cell"><input type="checkbox" {...sel.allProps} /></th>
 *   <td className="check-cell"><input type="checkbox" {...sel.rowProps(r.id, `${r.name}を選ぶ`)} /></td>
 *   <CollectionLayout selection={{ count: sel.count, onClear: sel.clear, actions: … }}>
 */
export function useSelection<K extends string | number>(keys: K[]) {
  const [selected, setSelected] = useState<ReadonlySet<K>>(() => new Set());
  const signature = keys.join('\u0000');
  useEffect(() => {
    setSelected((s) => (s.size ? new Set() : s));
  }, [signature]);

  const all = keys.length > 0 && keys.every((k) => selected.has(k));
  const some = !all && keys.some((k) => selected.has(k));
  const toggle = (k: K, on = !selected.has(k)) =>
    setSelected((s) => {
      const n = new Set(s);
      if (on) n.add(k);
      else n.delete(k);
      return n;
    });
  const toggleAll = (on = !all) => setSelected(on ? new Set(keys) : new Set());
  const clear = () => setSelected(new Set());

  return {
    /** 選んでいる行のキー */
    selected,
    count: selected.size,
    isSelected: (k: K) => selected.has(k),
    toggle,
    toggleAll,
    clear,
    /** 見出しの行のチェックボックス（一部だけ選んでいるときは「−」の表示） */
    allProps: {
      checked: all,
      ref: (el: HTMLInputElement | null) => { if (el) el.indeterminate = some; },
      onChange: (e: ChangeEvent<HTMLInputElement>) => toggleAll(e.target.checked),
      'aria-label': '表示中の行をすべて選ぶ',
    },
    /** 各行のチェックボックス。label は「山田 太郎を選ぶ」のように、どの行かが分かる文 */
    rowProps: (k: K, label: string) => ({
      checked: selected.has(k),
      onChange: (e: ChangeEvent<HTMLInputElement>) => toggle(k, e.target.checked),
      'aria-label': label,
    }),
  };
}

/**
 * 行全体を押して詳細へ進む（tr.clickable の onClick）。行の中のリンク・ボタン・入力欄・チェックボックスの列を押したとき、
 * 文字を選んでいるときは進まない。行の中には、同じ行き先のリンクを必ず1つ置く（キーボード・読み上げで進めるように）
 *
 *   <tr className="clickable" onClick={rowClick(() => (location.hash = `#/users/${r.id}`))}>
 */
export function rowClick(open: () => void) {
  return (e: MouseEvent<HTMLElement>) => {
    const target = e.target as Element;
    if (target.closest('a, button, input, select, textarea, label, summary, .check-cell')) return;
    if (window.getSelection()?.toString()) return;
    open();
  };
}
