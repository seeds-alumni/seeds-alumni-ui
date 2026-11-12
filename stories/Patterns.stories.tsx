import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AdminFrame,
  ApplicationFormPage,
  DashboardContent,
  LoginPage,
  MemberDetailContent,
  MemberListContent,
  MemberPortalPage,
} from '../demo/samples';
import { ConsoleDashboardPage, ConsoleEmptyPage, ConsoleFrame, ConsoleMembersPage, ConsoleSettingsPage } from '../demo/console';
import { SitePage } from './SitePage';

/**
 * 画面の型（docs/catalog.md §4）。新しい画面はここから近いものを選んで始める。
 * 右上の「表示」でライト・ダーク、ビューポートでスマートフォンの幅を確かめられる。
 */
const meta: Meta = {
  title: '画面の型',
  parameters: { layout: 'fullscreen', noDialogHost: true },
};
export default meta;
type Story = StoryObj;

export const 会員向けのページ: Story = { render: () => <MemberPortalPage /> };
export const ログイン: Story = { render: () => <LoginPage /> };
export const フォーム: Story = { render: () => <ApplicationFormPage /> };
export const ダッシュボード: Story = { render: () => <AdminFrame route=""><DashboardContent /></AdminFrame> };
export const 一覧: Story = { render: () => <AdminFrame route="users"><MemberListContent onOpen={() => {}} /></AdminFrame> };
export const 詳細: Story = { render: () => <AdminFrame route="users/1"><MemberDetailContent /></AdminFrame> };
export const 開発環境のバッジ: Story = { render: () => <AdminFrame route="" envLabel="開発環境"><DashboardContent /></AdminFrame> };
/** 管理コンソール：左のメニュー・全体の検索・画面の見出し・一覧（表示の切り替え・絞り込み・検索・一括操作・並べ替え）。980px 以下では左のメニューを3本線で引き出す */
export const 管理コンソールの一覧: Story = { render: () => <ConsoleFrame route="members"><ConsoleMembersPage /></ConsoleFrame> };
/** 検索に当てはまるものがないときの一覧 */
export const 管理コンソールの一覧_該当なし: Story = { name: '管理コンソールの一覧（該当なし）', render: () => <ConsoleFrame route="members"><ConsoleMembersPage initialQuery="該当なし" /></ConsoleFrame> };
/** まだ1件もないときの一覧 */
export const 管理コンソールの一覧_まだない: Story = { name: '管理コンソールの一覧（まだない）', render: () => <ConsoleFrame route="notices"><ConsoleEmptyPage /></ConsoleFrame> };
/** 横並びのフォーム。「変更を保存」で、誤りがあれば上に .message-box・項目の下に誤り・画面の下に toast */
export const 管理コンソールの設定: Story = { render: () => <ConsoleFrame route="settings"><ConsoleSettingsPage /></ConsoleFrame> };
export const 管理コンソールのダッシュボード: Story = { render: () => <ConsoleFrame route=""><ConsoleDashboardPage /></ConsoleFrame> };
/** 公開サイト（ホームページ）のページ。980px 以下ではメニューがハンバーガーメニューに切り替わる */
export const 公開サイトのページ: Story = { render: () => <SitePage /> };
