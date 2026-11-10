import { AppHeader, type NavItem } from '../src';

/** 公開サイト（ホームページ）のページの見本：メニューつきのヘッダー・題名の帯（パンくず）・文章のカード・題名のカード・フッター（docs/usage.md） */
export const SITE_NAV: NavItem[] = [
  { label: 'お知らせ', href: '#' },
  {
    label: '同窓会について', href: '#', active: true,
    children: [
      { label: '団体概要', href: '#' },
      { label: '設立経緯', href: '#', current: true },
      { label: '役員名簿', href: '#' },
      { label: '規約等', href: '#', children: [{ label: '会則', href: '#' }, { label: 'プライバシーポリシー', href: '#' }] },
    ],
  },
  { label: '企画', href: '#', children: [{ label: '同窓生のつどい', href: '#' }, { label: 'SEEDSゼミ', href: '#' }, { label: '会報誌', href: '#' }] },
  { label: 'お問い合わせ', href: '#' },
];

export function SitePage() {
  return (
    <>
      <AppHeader title="大阪大学SEEDSプログラム同窓会" href="#" wide nav={SITE_NAV} navFooter={<a className="button primary" href="#">会員ログイン</a>}>
        <a className="button primary small-btn" href="#">会員ログイン</a>
      </AppHeader>
      <main className="full">
        <div className="page-head">
          <div className="container reading">
            <nav className="breadcrumb" aria-label="現在地">
              <ol>
                <li><a href="#">ホーム</a></li>
                <li><a href="#">同窓会について</a></li>
                <li><span aria-current="page">設立経緯</span></li>
              </ol>
            </nav>
            <h1>設立経緯</h1>
            <p className="page-meta"><time dateTime="2026-11-10">2026年11月10日</time><span className="badge none">お知らせ</span></p>
          </div>
        </div>
        <div className="container reading">
          <article className="card prose">
            <p>長い文章（Markdown を変換した本文・規約など）は <code>.prose</code> で整えます。カードにするときは <code>.card</code> と組み合わせます。</p>
            <h2>見出し（h2）</h2>
            <p>段落の文章です。読みやすい1行の長さ（<code>--layout-reading</code>）で並べます。</p>
            <ul>
              <li>箇条書き</li>
              <li>入れ子の箇条書き<ul><li>下の段</li></ul></li>
            </ul>
            <h3>小見出し（h3）</h3>
            <blockquote><p>引用は左に緑の線と淡い地。</p></blockquote>
            <div className="table-wrap">
              <table>
                <thead><tr><th>項目</th><th>内容</th></tr></thead>
                <tbody><tr><td>名称</td><td>大阪大学SEEDSプログラム同窓会</td></tr></tbody>
              </table>
            </div>
            <hr />
            <p>以上</p>
          </article>
          <div className="tiles">
            <a className="tile" href="#"><strong className="tile-title">団体概要</strong><span className="muted small">名称・所在地・目的など</span></a>
            <a className="tile" href="#"><strong className="tile-title">設立経緯</strong><span className="muted small">同窓会ができるまで。説明が2行以上になっても、題名の位置はそろいます</span></a>
            <a className="tile" href="#"><strong className="tile-title">役員名簿</strong></a>
          </div>
        </div>
      </main>
      <footer className="app-footer wide">
        <div className="app-footer-inner">
          <div>
            <p className="app-footer-name">大阪大学SEEDSプログラム同窓会</p>
            <p className="muted small">大阪府吹田市（見本）</p>
          </div>
          <nav aria-label="サイトの案内">
            <ul>{SITE_NAV.map((i, n) => <li key={n}><a href={i.href}>{i.label}</a></li>)}</ul>
          </nav>
        </div>
        <p className="app-footer-copy">© 大阪大学SEEDSプログラム同窓会</p>
      </footer>
    </>
  );
}
