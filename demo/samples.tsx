/**
 * 画面の型の見本（デモと Storybook で共通に使う）。データはすべて架空のもの。
 * 実際のアプリ（seeds-alumni-idaas）の画面を簡単にしたもので、部品の組み合わせ方の手本にする。
 */
import { useState } from 'react';
import {
  AccountMenu,
  AppShell,
  Badge,
  Card,
  DetailLayout,
  Field,
  ListLayout,
  Tiles,
  confirmDialog,
  inputDialog,
} from '../src';

type Member = { id: number; number: number; name: string; kana: string; type: string; cohort: string; tags: string; status: 'ok' | 'warn' | 'ng' };

export const MEMBERS: Member[] = [
  { id: 1, number: 9001, name: '番号 不明', kana: 'バンゴウ フメイ', type: '受講生・卒業生', cohort: '—', tags: '—', status: 'ok' },
  { id: 2, number: 10005, name: '見本 花子', kana: 'ミホン ハナコ', type: 'SEEDS アシスタント（SA）', cohort: '—', tags: '—', status: 'ok' },
  { id: 3, number: 15100, name: '管理 太郎', kana: 'カンリ タロウ', type: '受講生・卒業生', cohort: '1期（2015年度）', tags: '—', status: 'ok' },
  { id: 4, number: 16005, name: '申請 次郎', kana: 'シンセイ ジロウ', type: '受講生・卒業生', cohort: '2期（2016年度）', tags: '実行委員会', status: 'ok' },
  { id: 5, number: 18010, name: '停止 三郎', kana: 'テイシ サブロウ', type: '受講生・卒業生', cohort: '4期（2018年度）', tags: '—', status: 'ng' },
  { id: 6, number: 24123, name: '山田 一郎', kana: 'ヤマダ イチロウ', type: '受講生・卒業生', cohort: '10期（2024年度）', tags: '—', status: 'ok' },
];
const STATUS_LABEL = { ok: '利用中', warn: '審査中', ng: '停止中' } as const;

const MEMBER_TITLE = 'SEEDS-ID マイポータル';
const ADMIN_TITLE = 'SEEDS-ID 会員管理システム';

/** 会員向けのページ（マイポータル） */
export function MemberPortalPage({ envLabel }: { envLabel?: string | null }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <AppShell
      title={MEMBER_TITLE}
      href="#"
      envLabel={envLabel}
      actions={
        <AccountMenu name="管理 太郎" memberNumber={15100} role="会員">
          <a href="#/">会員管理システム</a>
          <hr />
          <button type="button">ログアウト</button>
        </AccountMenu>
      }
    >
      <div className="grid2">
      <Card title="登録情報">
        <dl>
          <dt>会員番号</dt><dd>15100</dd>
          <dt>期</dt><dd>1期（2015年度）</dd>
          <dt>氏名</dt><dd>管理 太郎（カンリ タロウ）</dd>
          <dt>メールアドレス</dt><dd>taro@example.com</dd>
        </dl>
        {saved && <p className="ok mt-md">保存しました。</p>}
        {!editing && (
          <div className="row mt-md">
            <button type="button" className="button secondary" onClick={() => setEditing(true)}>登録情報を編集</button>
          </div>
        )}
        {editing && (
          <form className="form box" onSubmit={(e) => { e.preventDefault(); setEditing(false); setSaved(true); }}>
            <Field label="氏名"><input defaultValue="管理 太郎" required /></Field>
            <Field label="現在の所属" optional hint="勤務先・在籍校など（200文字まで）"><input placeholder="例：大阪大学 工学部" /></Field>
            <div className="row">
              <button className="button primary inline">変更を保存</button>
              <button type="button" className="button secondary" onClick={() => setEditing(false)}>キャンセル</button>
            </div>
          </form>
        )}
      </Card>
      <Card title="役職・タグ">
        <dl>
          <dt>役職</dt><dd>理事（2026/04/01〜）</dd>
          <dt>タグ</dt><dd>実行委員会</dd>
        </dl>
      </Card>
      </div>
    </AppShell>
  );
}

/** ログイン前のページ（行き先を選ばせる .choice） */
export function LoginPage() {
  return (
    <AppShell title={MEMBER_TITLE} href="#" narrow>
      <Card title="ログイン">
        <p>SEEDS同窓会のマイポータルです。ログイン方法を選んでください。</p>
        <div className="stack">
          <a className="choice" href="#">Google でログイン</a>
          <a className="choice" href="#">メールアドレスでログイン（確認コード）</a>
        </div>
      </Card>
    </AppShell>
  );
}

/** 申請フォーム（フォームの型） */
export function ApplicationFormPage() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <AppShell title={MEMBER_TITLE} href="#" narrow>
      <Card title="本登録の申請">
        <p className="muted">会員として利用するには本登録の申請が必要です。運営が名簿と照合してから承認します。</p>
        <form className="form" onSubmit={(e) => { e.preventDefault(); setError(agreed ? null : 'プライバシーポリシーと会則に同意してください。'); }}>
          <fieldset>
            <legend>登録区分</legend>
            <label className="radio"><input type="radio" name="type" defaultChecked /> 受講生・卒業生</label>
            <label className="radio"><input type="radio" name="type" /> SEEDS アシスタント（SA）</label>
            <label className="radio"><input type="radio" name="type" /> その他の関係者</label>
          </fieldset>
          <Field label="氏名"><input required /></Field>
          <Field label="氏名（カナ）"><input placeholder="例：ヤマダ タロウ" required /></Field>
          <Field label="会員番号（受講生番号・5桁）" hint="分からなければ空欄のままで構いません。"><input inputMode="numeric" placeholder="例：15001" /></Field>
          <Field label="補足" optional hint="本人確認の参考になる情報があれば書いてください。"><textarea /></Field>
          <ul className="doc-links">
            <li><a href="#">プライバシーポリシー</a></li>
            <li><a href="#">会則</a></li>
          </ul>
          <label className="check"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /> プライバシーポリシー・会則を確認し、同意します</label>
          {error && <span className="error small">{error}</span>}
          <button className="button primary">申請</button>
        </form>
      </Card>
    </AppShell>
  );
}

const ADMIN_TABS = [
  { key: '', label: 'ダッシュボード' },
  { key: 'applications', label: '申請審査' },
  { key: 'users', label: '会員' },
  { key: 'settings', label: '設定' },
];

/** 管理画面の枠（タブつき）。route は #/ 以降 */
export function AdminFrame({ route, envLabel, children }: { route: string; envLabel?: string | null; children: React.ReactNode }) {
  const section = route.split('/')[0] ?? '';
  return (
    <AppShell
      title={ADMIN_TITLE}
      href="#/"
      wide
      envLabel={envLabel}
      actions={
        <AccountMenu name="管理 太郎" memberNumber={15100} role="管理者">
          <a href="#member">マイポータル</a>
          <hr />
          <button type="button">ログアウト</button>
        </AccountMenu>
      }
      tabs={ADMIN_TABS.map((t) => ({ href: `#/${t.key}`, label: t.label, active: section === t.key }))}
    >
      {children}
    </AppShell>
  );
}

/** ダッシュボード */
export function DashboardContent() {
  return (
    <Tiles
      items={[
        { label: '審査待ちの申請', value: 3, href: '#/applications' },
        { label: '本登録済みの会員', value: 1276, href: '#/users' },
        { label: '仮番号の会員（名簿と未結合）', value: 2, href: '#/users' },
        { label: '送信に失敗したメール', value: 0 },
      ]}
    />
  );
}

/** 一覧 */
export function MemberListContent({ onOpen }: { onOpen?: (id: number) => void }) {
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const rows = MEMBERS.filter((m) => !query || `${m.number}${m.name}${m.kana}`.includes(query));
  const open = (id: number) => (onOpen ? onOpen(id) : (location.hash = `#/users/${id}`));
  return (
    <ListLayout
      title="会員"
      filters={
        <>
          <input aria-label="検索" placeholder="会員番号・氏名・カナ" value={q} onChange={(e) => setQ(e.target.value)} />
          <select aria-label="タグ" defaultValue="">
            <option value="">タグ（すべて）</option>
            <option>実行委員会</option>
          </select>
          <label className="check"><input type="checkbox" /> 仮番号のみ</label>
          <button className="button">検索</button>
        </>
      }
      onSearch={() => { setQuery(q.trim()); setPage(1); }}
      summary={`${rows.length} 件`}
      tools={<button type="button" className="button small-btn">CSV をダウンロード</button>}
      pager={{ total: rows.length, page, pageSize: 20, onPage: setPage }}
    >
      <table>
        <thead><tr><th>会員番号</th><th>氏名</th><th>区分</th><th>期</th><th>タグ</th><th>状態</th></tr></thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className="clickable" onClick={() => open(m.id)}>
              <td className="nowrap">{m.number}{m.number < 10000 && <> <Badge kind="warn">仮番号</Badge></>}</td>
              <td className="nowrap"><a href={`#/users/${m.id}`} onClick={(e) => { e.preventDefault(); open(m.id); }}>{m.name}</a><br /><span className="muted small">{m.kana}</span></td>
              <td>{m.type}</td>
              <td className="nowrap">{m.cohort}</td>
              <td className="small">{m.tags}</td>
              <td><Badge kind={m.status}>{STATUS_LABEL[m.status]}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </ListLayout>
  );
}

/** 詳細 */
export function MemberDetailContent({ id = 4, backHref = '#/users' }: { id?: number; backHref?: string }) {
  const m = MEMBERS.find((x) => x.id === id) ?? MEMBERS[3]!;
  const [status, setStatus] = useState(m.status);
  const [note, setNote] = useState('');
  async function suspend() {
    const reason = await inputDialog({ title: '会員の停止', label: '理由', hint: '本人には知らせません。', okLabel: '次へ' });
    if (reason === null) return;
    if (!(await confirmDialog('この会員を停止しますか？すぐにログアウトされ、ログインしても利用できなくなります。', { title: '会員の停止', okLabel: '停止', danger: true }))) return;
    setStatus('ng');
    setNote(`会員を停止しました（理由：${reason}）。`);
  }
  return (
    <DetailLayout
      back={{ href: backHref, label: '会員一覧' }}
      title={<>{m.number}：{m.name}</>}
      status={<Badge kind={status}>{STATUS_LABEL[status]}</Badge>}
      summary={
        <>
          <dl>
            <dt>氏名（カナ）</dt><dd>{m.name}（{m.kana}）</dd>
            <dt>登録区分</dt><dd>{m.type}</dd>
            <dt>期</dt><dd>{m.cohort}</dd>
            <dt>タグ</dt><dd>{m.tags}</dd>
          </dl>
          <div className="row mt-md"><button type="button" className="button small-btn">基本情報を編集</button></div>
        </>
      }
    >
      <Card title="名簿と結合（仮番号 → 受講生番号）" level={3} tone="warn">
        <p className="small">名簿で本人の受講生番号を確認できたら、ここで結合します。</p>
        <div className="row">
          <input className="w-name" aria-label="名簿の会員番号" placeholder="例：16005" />
          <button type="button" className="button small-btn">名簿を確認</button>
        </div>
      </Card>
      <Card title="所属・役割" level={3}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>所属・役割</th><th>開始</th><th>終了</th><th></th></tr></thead>
            <tbody>
              <tr><td>SA</td><td>2017/04/01</td><td>—</td><td><button type="button" className="button small-btn">終了</button></td></tr>
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="例外的な操作" level={3}>
        {note && <p className="warn">{note}</p>}
        <div className="box">
          <strong>会員の停止</strong>
          <p className="muted small">停止すると、すぐにログアウトされます。</p>
          <div className="row"><button type="button" className="button danger inline" disabled={status === 'ng'} onClick={suspend}>停止</button></div>
        </div>
      </Card>
    </DetailLayout>
  );
}

/** 管理画面の見本（#/ のハッシュで画面を切り替える） */
export function AdminDemo({ route, envLabel }: { route: string; envLabel?: string | null }) {
  const [section, id] = route.split('/');
  return (
    <AdminFrame route={route} envLabel={envLabel}>
      {(section === '' || section === undefined) && <DashboardContent />}
      {section === 'users' && (id ? <MemberDetailContent id={Number(id)} /> : <MemberListContent />)}
      {section === 'applications' && (
        <Card title="申請審査">
          <p className="muted">見本では省略しています。一覧の型は「会員」タブを見てください。</p>
        </Card>
      )}
      {section === 'settings' && (
        <Card title="設定">
          <div className="notice">設定の画面は、設定のまとまりごとにカードを1枚ずつ並べます。</div>
        </Card>
      )}
    </AdminFrame>
  );
}
