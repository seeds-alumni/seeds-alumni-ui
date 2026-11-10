import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../css/index.css';
import { DialogHost } from '../src';

/** ツールバーの「表示」でライト・ダークを切り替える（<html data-theme>） */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'ライト・ダーク',
      toolbar: {
        title: '表示',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'ライト' },
          { value: 'dark', title: 'ダーク' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    viewport: {
      options: {
        phone: { name: 'スマートフォン（390px）', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        tablet: { name: 'タブレット（768px）', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
        desktop: { name: 'パソコン（1280px）', styles: { width: '1280px', height: '860px' }, type: 'desktop' },
      },
    },
    options: { storySort: { order: ['はじめに', 'トークン', '画面の型', '部品', 'クラス'] } },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      useEffect(() => {
        document.documentElement.dataset.theme = theme;
      }, [theme]);
      return (
        <>
          <Story />
          {!context.parameters.noDialogHost && <DialogHost />}
        </>
      );
    },
  ],
};
export default preview;
