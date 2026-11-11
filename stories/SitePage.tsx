import { AppHeader, type NavItem } from '../src';

/** 公開サイト（ホームページ）の見本：data-look="site" の見た目（白い地・色面・丸い矢印）。トップの区画と、下層ページの題名の帯・文章・フッター（docs/usage.md、カタログ §3.10） */
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

/** 写真の見本（灰色の地に「写真（見本）」） */
const PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Crect width='1600' height='900' fill='%23cfd8d2'/%3E%3Ctext x='800' y='470' font-family='sans-serif' font-size='56' text-anchor='middle' fill='%235b6660'%3E写真（見本）%3C/text%3E%3C/svg%3E";

export function SitePage() {
  return (
    <div data-look="site">
      <AppHeader title="大阪大学SEEDSプログラム同窓会" href="#" wide nav={SITE_NAV} navFooter={<a className="button primary" href="#">会員ログイン</a>}>
        <a className="button primary small-btn" href="#">会員ログイン</a>
      </AppHeader>
      <main className="full">
      {/* トップの最初の画面：題名 → 写真（後ろに色面）→ 大きなリンクボタン */}
      <div className="band">
        <div className="container wide">
          <h1>大阪大学SEEDSプログラム同窓会</h1>
          <p>トップページの見本です。データはすべて見本です。</p>
          <figure className="photo-block">
            <img src={PHOTO} alt="写真の見本" width="1600" height="900" />
            <figcaption>写真の説明（figcaption）</figcaption>
          </figure>
          <div className="quick-links mt-md">
            <a className="main" href="#">入会のご案内<span className="arrow-dot on-solid" aria-hidden="true"></span></a>
            <a href="#">同窓生のつどい<span className="arrow-dot" aria-hidden="true"></span></a>
            <a href="#">会員ポータル<span className="arrow-dot" aria-hidden="true"></span></a>
          </div>
        </div>
      </div>
      {/* 区画：左に欧文と日本語の見出し、右に中身 */}
      <div className="band soft">
        <div className="container wide split">
          <div>
            <p className="heading-en">About</p>
            <h2 className="heading-ja">同窓会について</h2>
            <p className="small mt-md">区画の説明の文章です。</p>
            <a className="text-link" href="#">同窓会について<span className="arrow-dot sm" aria-hidden="true"></span></a>
          </div>
          <ul className="link-list cols2">
            <li><a href="#"><span className="link-list-title">団体概要</span><span className="link-list-desc">名称・所在地・目的など</span><span className="arrow-dot" aria-hidden="true"></span></a></li>
            <li><a href="#"><span className="link-list-title">設立経緯</span><span className="link-list-desc">同窓会ができるまで</span><span className="arrow-dot" aria-hidden="true"></span></a></li>
            <li><a href="#"><span className="link-list-title">役員名簿</span><span className="arrow-dot" aria-hidden="true"></span></a></li>
            <li><a href="#"><span className="link-list-title">規約等</span><span className="link-list-desc">会則・プライバシーポリシーなど</span><span className="arrow-dot ink" aria-hidden="true"></span></a></li>
          </ul>
        </div>
      </div>
      {/* 画面の右端まで伸びる色面 */}
      <div className="band">
        <div className="container wide">
          <div className="color-band">
            <div className="color-band-item">
              <p className="color-band-label">MEMBERS</p>
              <h2>会員の方へ</h2>
              <p>会員ポータルにログインすると、会員証の表示や登録情報の確認・変更ができます。</p>
              <a className="color-band-link" href="#">会員ポータルにログイン<span className="arrow-dot sm on-solid" aria-hidden="true"></span></a>
            </div>
            <div className="color-band-item">
              <p className="color-band-label">CONTACT</p>
              <h2>お問い合わせ</h2>
              <p>ご質問・ご連絡は、お問い合わせフォームからお送りください。</p>
              <a className="color-band-link" href="#">お問い合わせフォーム<span className="arrow-dot sm on-solid" aria-hidden="true"></span></a>
            </div>
          </div>
        </div>
      </div>
      {/* 下層ページ：題名の帯（パンくず）と文章 */}
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
        <article className="prose">
          <p>長い文章（Markdown を変換した本文・規約など）は <code>.prose</code> で整えます。公開サイトではカードに入れず、白い地に直接置きます。</p>
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
        </article>
      </div>
    </main>
    <footer className="app-footer wide">
      <div className="app-footer-inner">
        <div>
          <p className="app-footer-name">大阪大学SEEDSプログラム同窓会</p>
          <p className="muted small">大阪府吹田市（見本）</p>
        </div>
        <nav className="app-footer-nav" aria-label="サイトの案内">
          <div>
            <p className="app-footer-heading">同窓会について</p>
            <ul><li><a href="#">団体概要</a></li><li><a href="#">設立経緯</a></li><li><a href="#">役員名簿</a></li></ul>
          </div>
          <div>
            <p className="app-footer-heading">企画</p>
            <ul><li><a href="#">同窓生のつどい</a></li><li><a href="#">SEEDSゼミ</a></li></ul>
          </div>
          <div>
            <p className="app-footer-heading">そのほか</p>
            <ul><li><a href="#">お知らせ</a></li><li><a href="#">お問い合わせ</a></li></ul>
          </div>
        </nav>
      </div>
      <p className="app-footer-bar">© 大阪大学SEEDSプログラム同窓会</p>
    </footer>
    </div>
  );
}
