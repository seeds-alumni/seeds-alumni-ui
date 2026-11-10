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
