import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeToggle } from '../src/ThemeToggle';

/** クラス（docs/catalog.md §3）。React を使わない画面（素の HTML）でも同じクラスで組める */
const meta: Meta = { title: 'クラス' };
export default meta;
type Story = StoryObj;

export const ボタン: Story = {
  render: () => (
    <section>
      <h2>ボタン</h2>
      <div className="stack">
        <button type="button" className="button">標準（幅いっぱい）</button>
        <button type="button" className="button primary">主要な操作（1画面に1つ）</button>
      </div>
      <div className="row mt-md">
        <button type="button" className="button primary inline">承認する</button>
        <button type="button" className="button danger inline">却下する</button>
        <button type="button" className="button secondary">キャンセル</button>
        <button type="button" className="button small-btn">小さい操作</button>
        <button type="button" className="button secondary" disabled>押せない</button>
        <button type="button" className="link">リンクの見た目のボタン</button>
      </div>
    </section>
  ),
};

export const 選択肢: Story = {
  render: () => (
    <section>
      <h2>ログイン方法</h2>
      <div className="stack">
        <a className="choice" href="#">Google でログイン</a>
        <a className="choice" href="#">メールアドレスでログイン（確認コード）</a>
      </div>
    </section>
  ),
};

export const フォーム: Story = {
  render: () => (
    <section>
      <h2>フォーム</h2>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label>氏名<input required /></label>
        <label>区分
          <select defaultValue="student"><option value="student">受講生・卒業生</option><option>その他の関係者</option></select>
        </label>
        <fieldset>
          <legend>通知</legend>
          <label className="radio"><input type="radio" name="n" defaultChecked /> メールで受け取る</label>
          <label className="radio"><input type="radio" name="n" /> 受け取らない</label>
        </fieldset>
        <label>補足（任意）<textarea /><span className="muted small">本人確認の参考になる情報があれば書いてください</span></label>
        <label className="check"><input type="checkbox" /> 規約に同意します</label>
        <button className="button primary">送信する</button>
      </form>
    </section>
  ),
};

export const 絞り込みと表: Story = {
  render: () => (
    <section>
      <h2>会員</h2>
      <form className="filters" onSubmit={(e) => e.preventDefault()}>
        <input aria-label="検索" placeholder="会員番号・氏名" />
        <select aria-label="ロール" defaultValue=""><option value="">ロール（すべて）</option></select>
        <label className="check"><input type="checkbox" /> 仮番号のみ</label>
        <button className="button">検索</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr><th>会員番号</th><th>氏名</th><th>照合</th></tr></thead>
          <tbody>
            <tr className="clickable"><td>15001</td><td>山田 太郎</td><td><span className="badge ok">一致</span></td></tr>
            <tr className="partial"><td>15002</td><td>佐藤 花子</td><td><span className="badge warn">部分一致</span></td></tr>
            <tr className="mismatch"><td>15003</td><td>鈴木 次郎</td><td><span className="badge ng">不一致</span></td></tr>
          </tbody>
        </table>
      </div>
      <h3>比べる表</h3>
      <table className="compare">
        <tbody><tr><td>氏名</td><td>山田 太郎</td><td>山田 太郎</td></tr><tr><td>期</td><td>1期</td><td>2期</td></tr></tbody>
      </table>
    </section>
  ),
};

export const 箱とお知らせ: Story = {
  render: () => (
    <section>
      <h2>箱とお知らせ</h2>
      <div className="grid2">
        <div className="box"><strong>箱（.box）</strong><span className="muted small">カードの中の小さなまとまり</span></div>
        <div className="box warnbox"><strong>注意（.box.warnbox）</strong><ul><li>名簿と番号が一致しません</li></ul></div>
      </div>
      <h3>お知らせの本文（.notice）</h3>
      <div className="notice">プライバシーポリシーを改訂しました。{'\n'}主な変更点：Wallet に追加したときの取り扱い</div>
      <h3>文書へのリンク（.doc-links）</h3>
      <ul className="doc-links"><li><a href="#">会則</a></li><li><a href="#">プライバシーポリシー</a></li></ul>
      <h3>文字の補助クラス</h3>
      <p className="muted">補足（.muted）</p>
      <p className="ok">保存しました（.ok）</p>
      <p className="warn">確認してください（.warn）</p>
      <p className="error">入力に誤りがあります（.error）</p>
      <p className="small">小さい文字（.small）</p>
    </section>
  ),
};

export const 候補リスト: Story = {
  render: () => (
    <section>
      <h2>候補リスト（.suggest）</h2>
      <div className="form-field">
        <span>卒業学校</span>
        <input aria-label="卒業学校" defaultValue="灘" />
        <ul className="suggest">
          <li><button type="button">灘高等学校<span className="muted small">兵庫県神戸市</span></button></li>
          <li><button type="button">灘中学校<span className="muted small">兵庫県神戸市</span></button></li>
        </ul>
      </div>
    </section>
  ),
};

/** ハンバーガーメニュー（.nav-toggle / .nav-screen）。素の HTML では js/nav.js が開け閉めする（ここでは同じ動きを React の状態で見せる） */
function HamburgerMenu() {
  const [open, setOpen] = useState(true);
  const [about, setAbout] = useState(true);
  const [projects, setProjects] = useState(false);
  return (
    <>
      <header className="app-header wide">
        <div className="app-header-inner">
          <a className="brand" href="#"><span className="brand-mark" aria-hidden="true">S</span><span className="brand-name">大阪大学SEEDSプログラム同窓会</span></a>
          <div className="header-actions">
            <a className="button primary small-btn" href="#">会員ログイン</a>
            <button type="button" className="nav-toggle" aria-controls="story-nav-screen" aria-expanded={open} aria-label={open ? 'メニューを閉じる' : 'メニューを開く'} onClick={() => setOpen(!open)}>
              <span className="nav-toggle-bars" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className="nav-screen" id="story-nav-screen" hidden={!open}>
        <nav className="nav-screen-inner" aria-label="メニュー">
          <ul className="nav-screen-list">
            <li><a href="#">ホーム</a></li>
            <li>
              <div className="nav-screen-row">
                <a href="#">同窓会について</a>
                <button type="button" className="nav-screen-expand" aria-controls="story-nav-about" aria-expanded={about} aria-label="同窓会についての下のページ" onClick={() => setAbout(!about)} />
              </div>
              <ul id="story-nav-about" hidden={!about}>
                <li><a href="#">団体概要</a></li>
                <li><a href="#" aria-current="page">設立経緯</a></li>
                <li><a href="#">役員名簿</a></li>
                <li><a href="#">規約等</a></li>
              </ul>
            </li>
            <li><a href="#">お知らせ</a></li>
            <li>
              <div className="nav-screen-row">
                <a href="#">企画</a>
                <button type="button" className="nav-screen-expand" aria-controls="story-nav-projects" aria-expanded={projects} aria-label="企画の下のページ" onClick={() => setProjects(!projects)} />
              </div>
              <ul id="story-nav-projects" hidden={!projects}>
                <li><a href="#">同窓生のつどい</a></li>
                <li><a href="#">SEEDSゼミ</a></li>
                <li><a href="#">会報誌</a></li>
              </ul>
            </li>
            <li><a href="#">お問い合わせ</a></li>
          </ul>
          <div className="nav-screen-footer">
            <div className="nav-screen-theme">表示（ライト・ダーク）<ThemeToggle /></div>
            <a className="button primary" href="#">会員ログイン</a>
          </div>
        </nav>
      </div>
      <main>
        <section>
          <h2>本文</h2>
          <p className="muted">右上の3本線でメニューを開け閉めします。</p>
        </section>
      </main>
    </>
  );
}

export const ハンバーガーメニュー: Story = {
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'phone' } },
  render: () => <HamburgerMenu />,
};
