import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React のデモ（demo/react.html）。素の HTML のデモ（demo/index.html）は加工せずにそのまま公開する（scripts/build-site.mjs）
export default defineConfig({
  root: 'demo',
  base: './',
  plugins: [react()],
  build: { outDir: '../site/demo', emptyOutDir: false, rollupOptions: { input: { react: 'demo/react.html' } } },
});
