import type { Meta, StoryObj } from '@storybook/react-vite';
import { icons } from '../demo/icons';

/**
 * 管理画面の一覧・検索・知らせのクラス（docs/catalog.md §3.2〜§3.6・§8）。素の HTML でも同じクラスで組める。
 * 地の上（淡い深緑）に置くもの（.toolbar・.headline）と、カードの中に置くものがある
 */
const meta: Meta = { title: 'クラス（管理画面）' };
export default meta;
type Story = StoryObj;

export const 画面の見出し: Story = {
  render: () => (
    <div className="headline">
      <nav className="breadcrumb" aria-label="現在地"><ol><li><a href="#">会員管理</a></li><li><span aria-current="page">会員</span></li></ol></nav>
      <div className="headline-main">
        <h1 className="headline-title">会員<span className="count">63<span className="visually-hidden">件</span></span></h1>
        <p className="headline-desc">SEEDS同窓会の会員と、ログイン・利用の状態を管理します。</p>
      </div>
      <div className="headline-actions">
        <button type="button" className="button secondary">{icons.download}CSV をダウンロード</button>
        <button type="button" className="button primary inline">{icons.plus}会員を招待</button>
      </div>
    </div>
  ),
};

export const 検索と絞り込み: Story = {
  render: () => (
    <>
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="状態で分ける">
          <button type="button" aria-pressed="true">すべて<span className="count">63</span></button>
          <button type="button" aria-pressed="false">利用中<span className="count">56</span></button>
          <button type="button" aria-pressed="false">停止中<span className="count">3</span></button>
        </div>
        <form className="toolbar-group" role="search" onSubmit={(e) => e.preventDefault()}>
          <details className="dropdown">
            <summary className="button ghost has-caret applied">期<span className="count">2<span className="visually-hidden">件を選択中</span></span></summary>
            <div className="dropdown-menu">
              <span className="dropdown-label">期で絞り込む</span>
              <label className="check"><input type="checkbox" defaultChecked /> 1期</label>
              <label className="check"><input type="checkbox" defaultChecked /> 2期</label>
              <label className="check"><input type="checkbox" /> 3期</label>
            </div>
          </details>
          <details className="dropdown">
            <summary className="button ghost has-caret">区分</summary>
            <div className="dropdown-menu">
              <label className="check"><input type="checkbox" /> 受講生・卒業生</label>
              <label className="check"><input type="checkbox" /> SA</label>
            </div>
          </details>
          <span className="search-field"><input type="search" aria-label="会員を検索" placeholder="氏名・会員番号・メールアドレス" /></span>
        </form>
      </div>
      <div className="filter-tags">
        <span className="muted">絞り込み：</span>
        <button type="button" className="filter-tag" aria-label="期：1期 の条件を外す">期：1期</button>
        <button type="button" className="filter-tag" aria-label="期：2期 の条件を外す">期：2期</button>
        <button type="button" className="link">すべて外す</button>
      </div>
      <section>
        <h2>キーの案内つきの検索欄（.search-field ＋ .kbd）</h2>
        <span className="search-field"><input type="search" aria-label="設定・会員を検索" placeholder="設定・会員を検索" /><kbd className="kbd">Ctrl K</kbd></span>
      </section>
    </>
  ),
};

export const メニュー: Story = {
  render: () => (
    <section>
      <h2>ドロップダウン（details.dropdown）</h2>
      <p className="muted small">外を押す・Esc・項目を押すと閉じます。右端に置くときは .dropdown-menu.end。</p>
      <div className="row">
        <details className="dropdown" open>
          <summary className="button secondary has-caret">操作</summary>
          <div className="dropdown-menu">
            <a href="#">詳細を開く</a>
            <button type="button">タグを付ける</button>
            <hr />
            <button type="button" className="danger">停止</button>
          </div>
        </details>
      </div>
    </section>
  ),
};

const PEOPLE = [
  { name: '山田 太郎', email: 'member01@example.com', number: 15001, type: '受講生・卒業生', role: '理事', status: 'ok', label: '利用中', last: '2026/10/27 03:37' },
  { name: '佐藤 花子', email: 'member02@example.com', number: 15002, type: 'SA', status: 'warn', label: '審査中', last: '' },
  { name: '鈴木 次郎', email: 'member03@example.com', number: 16010, type: '受講生・卒業生', status: 'ng', label: '停止中', last: '2026/09/06 08:11' },
];

export const 表のカード: Story = {
  render: () => (
    <div className="table-card">
      <div className="table-card-bar bulk" role="region" aria-label="選んだ行の操作">
        <span>1 件を選択中</span>
        <button type="button" className="button small-btn">タグを付ける</button>
        <button type="button" className="link small">選択を解除</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="check-cell"><input type="checkbox" aria-label="表示中の行をすべて選ぶ" /></th>
              <th aria-sort="ascending"><button type="button" className="sort">氏名</button></th>
              <th aria-sort="none"><button type="button" className="sort">会員番号</button></th>
              <th>区分</th>
              <th>状態</th>
              <th className="num">寄付の額</th>
              <th className="actions-cell"><span className="visually-hidden">操作</span></th>
            </tr>
          </thead>
          <tbody>
            {PEOPLE.map((p, i) => (
              <tr key={p.number} className={i === 0 ? 'clickable selected' : 'clickable'}>
                <td className="check-cell"><input type="checkbox" defaultChecked={i === 0} aria-label={`${p.name}を選ぶ`} /></td>
                <td><a className="person" href="#"><span className="avatar" aria-hidden="true">{p.name[0]}</span><span className="person-text"><span className="person-name">{p.name}</span><span className="person-sub">{p.email}</span></span></a></td>
                <td className="nowrap">{p.number}</td>
                <td><span className="tag">{p.type}</span>{p.role && <> <span className="tag brand">{p.role}</span></>}</td>
                <td><span className={`status-dot ${p.status}`}>{p.label}</span></td>
                <td className="num">{(i + 1) * 3000} 円</td>
                <td className="actions-cell"><button type="button" className="button small-btn">編集</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-card-foot">
        <div className="row pager"><button type="button" className="button small-btn" disabled>前へ</button><span className="muted">3 件中 1〜3 件（1/1）</span><button type="button" className="button small-btn" disabled>次へ</button></div>
      </div>
    </div>
  ),
};

export const 状態と分類: Story = {
  render: () => (
    <section>
      <h2>状態の点（.status-dot）と状態のバッジ（.badge）</h2>
      <div className="row">
        <span className="status-dot ok">利用中</span>
        <span className="status-dot warn">審査中</span>
        <span className="status-dot ng">停止中</span>
        <span className="status-dot none">未登録</span>
      </div>
      <div className="row mt-md">
        <span className="badge ok">利用中</span><span className="badge warn">審査中</span><span className="badge ng">停止中</span><span className="badge none">未登録</span>
      </div>
      <h3>分類の札（.tag）と件数（.count）</h3>
      <div className="row">
        <span className="tag">受講生・卒業生</span><span className="tag">実行委員会</span><span className="tag brand">理事</span>
        <span className="count">63<span className="visually-hidden">件</span></span>
      </div>
      <h3>人（.avatar・.person）</h3>
      <div className="row">
        <span className="avatar sm" aria-hidden="true">山</span>
        <span className="avatar" aria-hidden="true">山</span>
        <span className="avatar lg" aria-hidden="true">山</span>
        <span className="person"><span className="avatar" aria-hidden="true">山</span><span className="person-text"><span className="person-name">山田 太郎</span><span className="person-sub">member01@example.com</span></span></span>
      </div>
      <h3>アイコンだけのボタン（.icon-button）</h3>
      <div className="row">
        <a className="icon-button" href="#" aria-label="ヘルプ">{icons.help}</a>
        <button type="button" className="icon-button has-dot" aria-label="お知らせ（未読あり）">{icons.bell}</button>
      </div>
    </section>
  ),
};

export const 知らせ: Story = {
  render: () => (
    <section>
      <h2>画面の中の知らせ（.message-box）</h2>
      <div className="message-box info"><p className="message-title">名簿の取り込みについて</p><p>取り込んだあと、名簿と一致しなかった会員は「審査中」になります。</p></div>
      <div className="message-box ok"><p>名簿を取り込みました（1,276 件）。</p></div>
      <div className="message-box warn"><p className="message-title">3 件は名簿と一致しませんでした</p><p>一覧の「審査中」で確認してください。</p></div>
      <div className="message-box ng" role="alert"><p className="message-title">入力の誤りが 2 件あります</p><ul><li>メールアドレスの形式が正しくありません。</li><li>会員番号は5桁の数字で入力してください。</li></ul></div>
      <h3>画面の下の短い知らせ（.toast。React は toast()）</h3>
      <div className="stack">
        <div className="toast"><span className="toast-text">設定を保存しました。</span><button type="button" className="toast-close" aria-label="知らせを閉じる">×</button></div>
        <div className="toast ng"><span className="toast-text">保存できませんでした。時間をおいて、もう一度お試しください。</span><button type="button" className="toast-close" aria-label="知らせを閉じる">×</button></div>
      </div>
    </section>
  ),
};

export const 空の状態: Story = {
  render: () => (
    <div className="grid2">
      <div className="table-card">
        <div className="empty-state">
          <p className="empty-state-title">お知らせはまだありません</p>
          <p>作成したお知らせは、公開する日時になるとマイポータルのトップに出ます。</p>
          <div className="row"><button type="button" className="button primary inline">{icons.plus}お知らせを作成</button></div>
        </div>
      </div>
      <div className="table-card">
        <div className="empty-state">
          <p className="empty-state-title">条件に当てはまる会員はいません</p>
          <p>検索の言葉を変えるか、絞り込みの条件を外してください。</p>
          <div className="row"><button type="button" className="button secondary">条件をすべて外す</button></div>
        </div>
      </div>
    </div>
  ),
};

export const 横並びのフォーム: Story = {
  render: () => (
    <section>
      <h2>基本情報（.form.aligned）</h2>
      <form className="form aligned" onSubmit={(e) => e.preventDefault()}>
        <label className="form-field"><span>同窓会の名前</span><input defaultValue="大阪大学SEEDSプログラム同窓会" /></label>
        <label className="form-field">
          <span>問い合わせ先</span>
          <input type="email" defaultValue="office@" aria-invalid="true" />
          <span className="muted small">会員に送るメールの差出人になります。</span>
          <span className="error small">メールアドレスの形式が正しくありません（例：office@example.com）。</span>
        </label>
        <label className="form-field"><span>案内の文（任意）</span><textarea /></label>
        <label className="check"><input type="checkbox" defaultChecked /> 申請が届いたら運営にメールで知らせる</label>
        <div className="form-actions">
          <button className="button primary inline">変更を保存</button>
          <button type="button" className="button secondary">元に戻す</button>
        </div>
      </form>
    </section>
  ),
};
