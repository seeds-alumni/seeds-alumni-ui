import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AccountMenu, AppHeader, Badge, Card, CollectionLayout, Field, PageHeader, Pager, Tabs, Tiles, confirmDialog, inputDialog, toast, useSelection } from '../src';
import { SITE_NAV } from './SitePage';

/** React の部品（docs/catalog.md §4）。Controls で props を変えて確かめられる */
const meta: Meta = { title: '部品' };
export default meta;

export const カード: StoryObj<typeof Card> = {
  render: (args) => (
    <Card {...args}>
      <dl>
        <dt>会員番号</dt><dd>15001</dd>
        <dt>氏名</dt><dd>山田 太郎</dd>
      </dl>
    </Card>
  ),
  args: { title: '基本情報', level: 2, tone: undefined },
  argTypes: { level: { control: 'inline-radio', options: [2, 3] }, tone: { control: 'inline-radio', options: [undefined, 'warn'] } },
};

export const 見出しの右に操作があるカード: StoryObj<typeof Card> = {
  render: (args) => <Card {...args}><p>見出しの右に、状態のバッジや「一覧へ」のリンクを置けます。</p></Card>,
  args: { title: '申請の詳細', actions: <><Badge kind="warn">審査中</Badge><a href="#">一覧へ</a></> },
};

export const バッジ: StoryObj<typeof Badge> = {
  render: () => (
    <div className="row">
      <Badge kind="ok">利用中</Badge>
      <Badge kind="warn">審査中</Badge>
      <Badge kind="ng">停止中</Badge>
      <Badge kind="none">未登録</Badge>
    </div>
  ),
};

export const ヘッダー: StoryObj<typeof AppHeader> = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <AppHeader {...args}>
      <AccountMenu name="管理 太郎" memberNumber={15100} role="会員">
        <a href="#">会員管理システム</a>
        <hr />
        <button type="button">ログアウト</button>
      </AccountMenu>
    </AppHeader>
  ),
  args: { title: 'SEEDS-ID マイポータル', href: '#', envLabel: '開発環境' },
};

export const ログイン中の人: StoryObj<typeof AccountMenu> = {
  render: (args) => (
    <div className="row between">
      <span />
      <AccountMenu {...args}>
        <a href="#">マイポータル</a>
        <hr />
        <button type="button">ログアウト</button>
      </AccountMenu>
    </div>
  ),
  args: { name: '管理 太郎', memberNumber: 15100, role: '管理者・閲覧者' },
};

export const メニューつきのヘッダー: StoryObj<typeof AppHeader> = {
  parameters: { layout: 'fullscreen' },
  render: (args) => <AppHeader {...args}><a className="button primary small-btn" href="#">会員ログイン</a></AppHeader>,
  args: { title: '大阪大学SEEDSプログラム同窓会', href: '#', wide: true, nav: SITE_NAV, navFooter: <a className="button primary" href="#">会員ログイン</a> },
};

export const タブ: StoryObj<typeof Tabs> = {
  render: (args) => <Tabs {...args} />,
  args: {
    items: [
      { href: '#', label: 'ダッシュボード' },
      { href: '#', label: '申請審査' },
      { href: '#', label: '会員', active: true },
      { href: '#', label: '設定' },
    ],
  },
};

export const タイル: StoryObj<typeof Tiles> = {
  render: (args) => <Tiles {...args} />,
  args: {
    items: [
      { label: '審査待ちの申請', value: 3, href: '#' },
      { label: '本登録済みの会員', value: 1276, href: '#' },
      { label: '送信に失敗したメール', value: 0 },
    ],
  },
};

export const フォームの項目: StoryObj<typeof Field> = {
  render: (args) => (
    <Card title="フォーム">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <Field {...args}><input placeholder="例：大阪大学 工学部" /></Field>
        <Field label="氏名"><input required /></Field>
        <button className="button primary">保存</button>
      </form>
    </Card>
  ),
  args: { label: '現在の所属', optional: true, hint: '本登録の後も、マイポータルで変更できます。', error: '' },
};

function PagerDemo() {
  const [page, setPage] = useState(2);
  return <Pager total={95} page={page} pageSize={20} onPage={setPage} />;
}
export const ページ送り: StoryObj = { render: () => <PagerDemo /> };

function DialogDemo() {
  const [result, setResult] = useState('（まだ押していません）');
  return (
    <Card title="ダイアログ">
      <div className="row">
        <button type="button" className="button secondary" onClick={async () => setResult(String(await confirmDialog('この申請を承認しますか？', { title: '申請の承認', okLabel: '承認' })))}>承認</button>
        <button type="button" className="button danger inline" onClick={async () => setResult(String(await confirmDialog('この会員を停止しますか？', { title: '会員の停止', okLabel: '停止', danger: true })))}>停止</button>
        <button type="button" className="button secondary" onClick={async () => setResult(String(await inputDialog({ title: 'SA 登録の解除', label: '終了日', type: 'date', okLabel: '登録を解除' })))}>SA 登録を解除</button>
      </div>
      <p className="muted small mt-md">結果：{result}</p>
    </Card>
  );
}
export const ダイアログ: StoryObj = { render: () => <DialogDemo /> };

export const 画面の見出し: StoryObj<typeof PageHeader> = {
  render: (args) => <PageHeader {...args} />,
  args: {
    breadcrumb: [{ label: '会員管理', href: '#' }, { label: '会員' }],
    title: '会員',
    count: 63,
    description: 'SEEDS同窓会の会員と、ログイン・利用の状態を管理します。',
    actions: <><button type="button" className="button secondary">CSV をダウンロード</button><button type="button" className="button primary inline">会員を招待</button></>,
  },
};

const ITEMS = [
  { id: 1, name: '山田 太郎', status: 'ok' },
  { id: 2, name: '佐藤 花子', status: 'warn' },
  { id: 3, name: '鈴木 次郎', status: 'ng' },
] as const;
const LABEL = { ok: '利用中', warn: '審査中', ng: '停止中' };

function CollectionDemo() {
  const [view, setView] = useState<'all' | 'ok'>('all');
  const rows = ITEMS.filter((r) => view === 'all' || r.status === 'ok');
  const sel = useSelection(rows.map((r) => r.id));
  return (
    <CollectionLayout
      views={[
        { label: 'すべて', count: ITEMS.length, active: view === 'all', onSelect: () => setView('all') },
        { label: '利用中', count: 1, active: view === 'ok', onSelect: () => setView('ok') },
      ]}
      search={<span className="search-field"><input type="search" aria-label="会員を検索" /></span>}
      selection={{ count: sel.count, onClear: sel.clear, actions: <button type="button" className="button small-btn" onClick={() => toast(`${sel.count} 件にタグを付けました。`)}>タグを付ける</button> }}
      summary={`${rows.length} 件`}
    >
      <table>
        <thead><tr><th className="check-cell"><input type="checkbox" {...sel.allProps} /></th><th>氏名</th><th>状態</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={sel.isSelected(r.id) ? 'selected' : undefined}>
              <td className="check-cell"><input type="checkbox" {...sel.rowProps(r.id, `${r.name}を選ぶ`)} /></td>
              <td>{r.name}</td>
              <td><span className={`status-dot ${r.status}`}>{LABEL[r.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollectionLayout>
  );
}
/** 一覧（コレクション）の型。行を選ぶと、表の上の帯が一括操作に変わる */
export const 一覧の型: StoryObj = { render: () => <CollectionDemo /> };

export const 短い知らせ: StoryObj = {
  render: () => (
    <Card title="短い知らせ（toast）">
      <div className="row">
        <button type="button" className="button secondary" onClick={() => toast('設定を保存しました。')}>保存（成功）</button>
        <button type="button" className="button danger inline" onClick={() => toast('保存できませんでした。時間をおいて、もう一度お試しください。', { kind: 'ng' })}>保存（失敗。閉じるまで残る）</button>
      </div>
    </Card>
  ),
};
