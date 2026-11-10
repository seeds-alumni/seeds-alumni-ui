import tokensCss from '../css/tokens.css?raw';

/** tokens.css を読んで、名前・見本・説明（行末のコメント）の表にする（Storybook の「トークン」ページ用） */
const rows = [...tokensCss.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/gm)].map((m) => ({
  name: m[1]!,
  value: m[2]!.trim(),
  note: m[3] ?? '',
}));

/** 見本の色・影・角丸を、トークンを参照する CSS 変数で当てる（インライン style は使わない決まりなので、DOM に直接設定する） */
function Swatch({ name }: { name: string }) {
  const kind = name.startsWith('--color') ? 'background' : name.startsWith('--shadow') ? 'box-shadow' : name.startsWith('--radius') ? 'border-radius' : null;
  if (!kind) return null;
  return (
    <span
      className="badge"
      aria-hidden="true"
      ref={(el) => {
        if (!el) return;
        el.style.setProperty(kind, `var(${name})`);
        if (kind !== 'background') el.style.setProperty('background', 'var(--color-surface)');
      }}
    >
      &nbsp;
    </span>
  );
}

export function TokenTable() {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>トークン</th><th>見本</th><th>値</th><th>使う場面</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="nowrap"><code>{r.name}</code></td>
              <td><Swatch name={r.name} /></td>
              <td className="small"><code>{r.value}</code></td>
              <td className="small">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
