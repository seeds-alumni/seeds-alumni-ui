import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppHeader, Badge, Card, Field, Pager, Tabs, Tiles, confirmDialog, inputDialog } from '../src';

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
  args: { title: '登録情報', level: 2, tone: undefined },
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
  render: (args) => <AppHeader {...args}><span className="header-user">管理 太郎（admin）</span><a href="#">会員ページ</a></AppHeader>,
  args: { title: 'SEEDS同窓会 会員管理システム', href: '#', wide: true, envLabel: '開発環境' },
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
        <Field {...args}><input placeholder="勤務先・在籍校など" /></Field>
        <Field label="氏名"><input required /></Field>
        <button className="button primary">保存する</button>
      </form>
    </Card>
  ),
  args: { label: '現在の所属', optional: true, hint: '登録後もマイページで変更できます。', error: '' },
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
        <button type="button" className="button secondary" onClick={async () => setResult(String(await confirmDialog('この申請を承認しますか？', { title: '承認', okLabel: '承認する' })))}>確認</button>
        <button type="button" className="button danger inline" onClick={async () => setResult(String(await confirmDialog('この会員を停止しますか？', { title: '会員の停止', okLabel: '停止する', danger: true })))}>取り消せない操作の確認</button>
        <button type="button" className="button secondary" onClick={async () => setResult(String(await inputDialog({ title: 'SA 登録の解除', label: '終了日', type: 'date' })))}>入力</button>
      </div>
      <p className="muted small mt-md">結果：{result}</p>
    </Card>
  );
}
export const ダイアログ: StoryObj = { render: () => <DialogDemo /> };
