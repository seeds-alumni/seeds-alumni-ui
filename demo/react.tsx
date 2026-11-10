import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/index.css';
import { AdminDemo, ApplicationFormPage, LoginPage, MemberPortalPage } from './samples';

/**
 * 画面の型のデモ。#/ で管理画面（#/users、#/users/4 など）、#member で会員向けのページ。
 * 見本のデータは架空のもの
 */
function useHash() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function Demo() {
  const hash = useHash();
  if (hash === '#member') return <MemberPortalPage envLabel="デモ" />;
  if (hash === '#login') return <LoginPage />;
  if (hash === '#apply') return <ApplicationFormPage />;
  return <AdminDemo route={hash.replace(/^#\/?/, '')} envLabel="デモ" />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
