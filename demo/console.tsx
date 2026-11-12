/**
 * 管理コンソールの見本（デモと Storybook で共通に使う）。データはすべて架空のもの。
 * 部品の組み合わせ方の手本：<ConsoleShell> → <PageHeader> → <CollectionLayout>（一覧）・<Card> と .form.aligned（設定）
 */
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  AccountMenu,
  Card,
  CollectionLayout,
  ConsoleShell,
  Field,
  PageHeader,
  Tiles,
  confirmDialog,
  inputDialog,
  rowClick,
  toast,
  useSelection,
  type SideNavGroup,
} from '../src';
import { icons } from './icons';
import { MemberDetailContent } from './samples';

type Status = 'ok' | 'warn' | 'ng';
type Row = { id: number; number: number; name: string; email: string; cohort: number; type: string; role?: string; status: Status; lastLogin: string };

const STATUS_LABEL: Record<Status, string> = { ok: '利用中', warn: '審査中', ng: '停止中' };
const TYPES = ['受講生・卒業生', 'SA', 'その他の関係者'];

/** 架空の会員（63人）。名前は見本用 */
const FAMILY = ['山田', '佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '中村', '小林', '加藤', '吉田', '松本'];
const GIVEN = ['太郎', '花子', '次郎', '陽菜', '蓮', '結衣', '湊', '葵', '悠真', '美咲', '大翔', '凛'];
const ROWS: Row[] = Array.from({ length: 63 }, (_, i) => {
  const cohort = (i % 11) + 1;
  const status: Status = i % 17 === 5 ? 'ng' : i % 13 === 3 ? 'warn' : 'ok';
  const day = ((i * 7) % 28) + 1;
  const month = 10 - (i % 3);
  return {
    id: i + 1,
    number: 14000 + cohort * 1000 + i,
    name: `${FAMILY[i % FAMILY.length]} ${GIVEN[(i * 5) % GIVEN.length]}`,
    email: `member${String(i + 1).padStart(2, '0')}@example.com`,
    cohort,
    type: TYPES[i % 7 === 0 ? 1 : i % 11 === 4 ? 2 : 0]!,
    role: i === 2 ? '理事' : i === 9 ? '監査' : undefined,
    status,
    lastLogin: status === 'warn' ? '' : `2026/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String((i * 3) % 24).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
  };
});

const navFor = (route: string): SideNavGroup[] => {
  const at = (key: string) => route.split('/')[0] === key;
  return [
    { items: [{ label: 'ダッシュボード', href: '#console', icon: icons.dashboard, current: route === '' }] },
    {
      label: '会員管理',
      items: [
        { label: '会員', href: '#console/members', icon: icons.users, current: at('members') },
        { label: '申請審査', href: '#console/applications', icon: icons.inbox, current: at('applications'), count: 3 },
        { label: '役職・タグ', href: '#console/roles', icon: icons.tag, current: at('roles') },
      ],
    },
    {
      label: '運営',
      items: [
        { label: 'お知らせ', href: '#console/notices', icon: icons.megaphone, current: at('notices') },
        { label: 'メールの送信記録', href: '#console/mails', icon: icons.mail, current: at('mails') },
      ],
    },
    {
      label: 'セキュリティ',
      items: [
        { label: 'ログイン方法', href: '#console/login', icon: icons.key, current: at('login') },
        { label: '操作の記録', href: '#console/audit', icon: icons.file, current: at('audit') },
      ],
    },
    { label: '設定', items: [{ label: '同窓会の設定', href: '#console/settings', icon: icons.sliders, current: at('settings') }] },
  ];
};

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** 管理コンソールの枠。route は #console/ 以降 */
export function ConsoleFrame({ route, envLabel, children }: { route: string; envLabel?: string | null; children: ReactNode }) {
  return (
    <ConsoleShell
      title="SEEDS-ID"
      label="会員管理システム"
      href="#console"
      envLabel={envLabel}
      nav={navFor(route)}
      search={
        <span className="search-field">
          <input type="search" aria-label="設定・会員を検索" placeholder="設定・会員を検索" />
          <kbd className="kbd">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </span>
      }
      actions={
        <>
          <a className="icon-button" href="#console" aria-label="ヘルプ">{icons.help}</a>
          <button type="button" className="icon-button has-dot" aria-label="お知らせ（未読あり）">{icons.bell}</button>
          <AccountMenu name="管理 太郎" memberNumber={15100} role="管理者">
            <a href="#member">マイポータル</a>
            <a href="#console/settings">同窓会の設定</a>
            <hr />
            <button type="button" onClick={() => toast('ログアウトしました（見本）。')}>ログアウト</button>
          </AccountMenu>
        </>
      }
    >
      {children}
    </ConsoleShell>
  );
}

type SortKey = 'name' | 'number' | 'lastLogin';
type Sort = { key: SortKey; dir: 'ascending' | 'descending' };
const PAGE_SIZE = 20;

/** 絞り込みのドロップダウン（チェックボックスの一覧）。選んだ数を「期 2」のように出し、選んでいれば .applied */
function FilterMenu<T extends string | number>({ label, options, value, onChange, format = String }: {
  label: string; options: T[]; value: T[]; onChange: (v: T[]) => void; format?: (v: T) => string;
}) {
  return (
    <details className="dropdown">
      <summary className={value.length ? 'button ghost has-caret applied' : 'button ghost has-caret'}>
        {label}{value.length > 0 && <span className="count">{value.length}<span className="visually-hidden">件を選択中</span></span>}
      </summary>
      <div className="dropdown-menu">
        <span className="dropdown-label">{label}で絞り込む</span>
        {options.map((o) => (
          <label key={o} className="check">
            <input type="checkbox" checked={value.includes(o)} onChange={(e) => onChange(e.target.checked ? [...value, o] : value.filter((x) => x !== o))} />
            {format(o)}
          </label>
        ))}
      </div>
    </details>
  );
}

/** 会員の一覧（コレクション画面） */
export function ConsoleMembersPage({ initialQuery = '' }: { initialQuery?: string }) {
  const [view, setView] = useState<'all' | Status>('all');
  const [cohorts, setCohorts] = useState<number[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [q, setQ] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>({ key: 'number', dir: 'ascending' });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(ROWS);

  // 状態の数は、ほかの条件（期・区分・検索）で絞ったうえでの数
  const base = useMemo(() => rows.filter((r) =>
    (!cohorts.length || cohorts.includes(r.cohort)) &&
    (!types.length || types.includes(r.type)) &&
    (!query || `${r.number} ${r.name} ${r.email}`.includes(query)),
  ), [rows, cohorts, types, query]);
  const filtered = useMemo(() => {
    const list = base.filter((r) => view === 'all' || r.status === view);
    const sign = sort.dir === 'ascending' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.key === 'number') return (a.number - b.number) * sign;
      if (sort.key === 'lastLogin') return (a.lastLogin || '0').localeCompare(b.lastLogin || '0') * sign;
      return a.name.localeCompare(b.name, 'ja') * sign;
    });
  }, [base, view, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const sel = useSelection(shown.map((r) => r.id));

  // 条件を変えたら1ページ目に戻す
  const change = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };
  const count = (s: Status) => base.filter((r) => r.status === s).length;
  const sortBy = (key: SortKey) => () => setSort((s) => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));
  const ariaSort = (key: SortKey) => (sort.key === key ? sort.dir : 'none');
  const filtering = cohorts.length > 0 || types.length > 0 || !!query;
  const clearAll = () => { setCohorts([]); setTypes([]); setQ(''); setQuery(''); setView('all'); setPage(1); };
  const open = (id: number) => (location.hash = `#console/members/${id}`);

  async function addTag() {
    const tag = await inputDialog({ title: 'タグを付ける', label: 'タグの名前', message: `${sel.count} 人の会員にタグを付けます。`, okLabel: 'タグを付ける' });
    if (tag === null) return;
    toast(`${sel.count} 人に「${tag}」のタグを付けました。`);
    sel.clear();
  }
  async function suspend() {
    if (!(await confirmDialog(`${sel.count} 人の会員を停止しますか？すぐにログアウトされ、ログインしても利用できなくなります。`, { title: '会員の停止', okLabel: '停止', danger: true }))) return;
    const ids = sel.selected;
    setRows((list) => list.map((r) => (ids.has(r.id) ? { ...r, status: 'ng' } : r)));
    toast(`${ids.size} 人の会員を停止しました。`);
  }
  async function invite() {
    const email = await inputDialog({ title: '会員の招待', label: 'メールアドレス', hint: '本登録の申請の案内を送ります。', okLabel: '招待を送信' });
    if (email === null) return;
    toast(`${email} に招待を送りました。`);
  }

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: '会員管理', href: '#console/members' }, { label: '会員' }]}
        title="会員"
        count={rows.length}
        description="SEEDS同窓会の会員と、ログイン・利用の状態を管理します。"
        actions={
          <>
            <button type="button" className="button secondary" onClick={() => toast(`${filtered.length} 件の CSV をダウンロードしました（見本）。`)}>{icons.download}CSV をダウンロード</button>
            <button type="button" className="button primary inline" onClick={invite}>{icons.plus}会員を招待</button>
          </>
        }
      />
      <CollectionLayout
        views={[
          { label: 'すべて', count: base.length, active: view === 'all', onSelect: () => change(setView)('all') },
          { label: '利用中', count: count('ok'), active: view === 'ok', onSelect: () => change(setView)('ok') },
          { label: '審査中', count: count('warn'), active: view === 'warn', onSelect: () => change(setView)('warn') },
          { label: '停止中', count: count('ng'), active: view === 'ng', onSelect: () => change(setView)('ng') },
        ]}
        filters={
          <>
            <FilterMenu label="期" options={Array.from({ length: 11 }, (_, i) => i + 1)} value={cohorts} onChange={change(setCohorts)} format={(c) => `${c}期`} />
            <FilterMenu label="区分" options={TYPES} value={types} onChange={change(setTypes)} />
          </>
        }
        search={
          <span className="search-field">
            <input type="search" aria-label="会員を検索" placeholder="氏名・会員番号・メールアドレス" value={q} onChange={(e) => setQ(e.target.value)} />
          </span>
        }
        onSearch={() => { setQuery(q.trim()); setPage(1); }}
        applied={filtering && (
          <>
            <span className="muted">絞り込み：</span>
            {cohorts.map((c) => <button key={c} type="button" className="filter-tag" aria-label={`期：${c}期 の条件を外す`} onClick={() => change(setCohorts)(cohorts.filter((x) => x !== c))}>期：{c}期</button>)}
            {types.map((t) => <button key={t} type="button" className="filter-tag" aria-label={`区分：${t} の条件を外す`} onClick={() => change(setTypes)(types.filter((x) => x !== t))}>区分：{t}</button>)}
            {query && <button type="button" className="filter-tag" aria-label={`検索「${query}」を外す`} onClick={() => { setQ(''); change(setQuery)(''); }}>検索：{query}</button>}
            <button type="button" className="link" onClick={clearAll}>すべて外す</button>
          </>
        )}
        selection={{
          count: sel.count,
          onClear: sel.clear,
          actions: (
            <>
              <button type="button" className="button small-btn" onClick={addTag}>タグを付ける</button>
              <button type="button" className="button small-btn" onClick={suspend}>停止</button>
            </>
          ),
        }}
        summary={`${filtered.length} 件`}
        empty={filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">条件に当てはまる会員はいません</p>
            <p>検索の言葉を変えるか、絞り込みの条件を外してください。</p>
            <div className="row"><button type="button" className="button secondary" onClick={clearAll}>条件をすべて外す</button></div>
          </div>
        ) : undefined}
        pager={{ total: filtered.length, page: current, pageSize: PAGE_SIZE, onPage: setPage }}
      >
        <table>
          <thead>
            <tr>
              <th className="check-cell"><input type="checkbox" {...sel.allProps} /></th>
              <th aria-sort={ariaSort('name')}><button type="button" className="sort" onClick={sortBy('name')}>氏名</button></th>
              <th aria-sort={ariaSort('number')}><button type="button" className="sort" onClick={sortBy('number')}>会員番号</button></th>
              <th>期</th>
              <th>区分</th>
              <th>状態</th>
              <th aria-sort={ariaSort('lastLogin')}><button type="button" className="sort" onClick={sortBy('lastLogin')}>最終ログイン</button></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className={sel.isSelected(r.id) ? 'clickable selected' : 'clickable'} onClick={rowClick(() => open(r.id))}>
                <td className="check-cell"><input type="checkbox" {...sel.rowProps(r.id, `${r.name}を選ぶ`)} /></td>
                <td>
                  <a className="person" href={`#console/members/${r.id}`}>
                    <span className="avatar" aria-hidden="true">{r.name[0]}</span>
                    <span className="person-text"><span className="person-name">{r.name}</span><span className="person-sub">{r.email}</span></span>
                  </a>
                </td>
                <td className="nowrap">{r.number}</td>
                <td className="nowrap">{r.cohort}期</td>
                <td><span className="tag">{r.type}</span>{r.role && <> <span className="tag brand">{r.role}</span></>}</td>
                <td><span className={`status-dot ${r.status}`}>{STATUS_LABEL[r.status]}</span></td>
                <td className="nowrap">{r.lastLogin || <span className="muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollectionLayout>
    </>
  );
}

/** まだ1件もないときの一覧（空の状態の見本） */
export function ConsoleEmptyPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ label: '運営', href: '#console/notices' }, { label: 'お知らせ' }]} title="お知らせ" count={0} description="マイポータルに出すお知らせを作成します。"
        actions={<button type="button" className="button primary inline">{icons.plus}お知らせを作成</button>} />
      <CollectionLayout
        empty={
          <div className="empty-state">
            <p className="empty-state-title">お知らせはまだありません</p>
            <p>作成したお知らせは、公開する日時になるとマイポータルのトップに出ます。</p>
            <div className="row"><button type="button" className="button primary inline">{icons.plus}お知らせを作成</button></div>
          </div>
        }
      />
    </>
  );
}

/** 設定のフォーム（横並びのフォーム .form.aligned、送信中は押せない、結果は toast） */
export function ConsoleSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; digits?: string }>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const next: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+$/.test(email)) next.email = 'メールアドレスの形式が正しくありません（例：office@example.com）。';
    setErrors(next);
    if (Object.keys(next).length) {
      toast('保存できませんでした。入力の誤りを直してください。', { kind: 'ng' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast('設定を保存しました。');
  }
  const errorList = Object.values(errors);
  return (
    <>
      <PageHeader breadcrumb={[{ label: '設定' }, { label: '同窓会の設定' }]} title="同窓会の設定" description="マイポータルと、送るメールに使う情報です。" />
      <Card title="基本情報">
        <form className="form aligned" onSubmit={submit} noValidate>
          {errorList.length > 0 && (
            <div className="message-box ng" role="alert">
              <p className="message-title">入力の誤りが {errorList.length} 件あります</p>
              <ul>{errorList.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          )}
          <Field label="同窓会の名前"><input name="name" defaultValue="大阪大学SEEDSプログラム同窓会" autoComplete="off" required /></Field>
          <Field label="問い合わせ先" hint="会員に送るメールの差出人と、問い合わせの宛先になります。" error={errors.email}>
            <input name="email" type="email" defaultValue="office@" autoComplete="off" aria-invalid={!!errors.email} required />
          </Field>
          <Field label="本登録の承認">
            <select name="approval" defaultValue="manual">
              <option value="manual">運営が名簿と照合して承認する</option>
              <option value="auto">名簿と一致したら自動で承認する</option>
            </select>
          </Field>
          <Field label="案内の文" optional hint="本登録の申請の画面の上に出ます。"><textarea name="intro" /></Field>
          <label className="check"><input type="checkbox" name="notify" defaultChecked /> 申請が届いたら運営にメールで知らせる</label>
          <div className="form-actions">
            <button className="button primary inline" disabled={saving}>{saving ? '保存しています…' : '変更を保存'}</button>
            <button type="reset" className="button secondary" disabled={saving} onClick={() => setErrors({})}>元に戻す</button>
          </div>
        </form>
      </Card>
    </>
  );
}

export function ConsoleDashboardPage() {
  return (
    <>
      <PageHeader title="ダッシュボード" description="対応が必要なことから順に並べています。" />
      <Tiles
        items={[
          { label: '審査待ちの申請', value: 3, href: '#console/applications' },
          { label: '利用中の会員', value: ROWS.filter((r) => r.status === 'ok').length, href: '#console/members' },
          { label: '停止中の会員', value: ROWS.filter((r) => r.status === 'ng').length, href: '#console/members' },
          { label: '送信に失敗したメール', value: 0 },
        ]}
      />
    </>
  );
}

/** 管理コンソールの見本（#console/… のハッシュで画面を切り替える） */
export function ConsoleDemo({ route, envLabel }: { route: string; envLabel?: string | null }) {
  const [section, id] = route.split('/');
  let body: ReactNode;
  if (!section) body = <ConsoleDashboardPage />;
  else if (section === 'members') body = id ? <MemberDetailContent id={Number(id) % 6 || 6} backHref="#console/members" /> : <ConsoleMembersPage />;
  else if (section === 'settings') body = <ConsoleSettingsPage />;
  else if (section === 'notices') body = <ConsoleEmptyPage />;
  else body = (
    <>
      <PageHeader title={navFor(route).flatMap((g) => g.items).find((i) => i.current)?.label ?? '画面'} />
      <Card><div className="empty-state"><p className="empty-state-title">この画面は見本では省略しています</p><p>一覧は「会員」、フォームは「同窓会の設定」を見てください。</p></div></Card>
    </>
  );
  return <ConsoleFrame route={route} envLabel={envLabel}>{body}</ConsoleFrame>;
}
