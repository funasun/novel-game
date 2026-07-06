import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages はプロジェクトページを /<repo>/ 配下で配信するため base を合わせる。
  // ローカル/LAN 配信では '/' のまま（GH_PAGES 環境変数がある時だけサブパス化）。
  base: process.env.GH_PAGES ? '/novel-game/' : '/',
  // host: true で LAN 上の全端末（スマホ・タブレット等）からアクセス可能にする。
  server: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  preview: {
    host: true,
    port: process.env.PREVIEW_PORT ? Number(process.env.PREVIEW_PORT) : 4173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,glb,png,svg,mp3,ogg,json}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        name: '十五少年漂流記',
        short_name: '十五少年',
        description: '没入体験型生活ゲーム — パブリックドメイン名作古典シリーズ',
        theme_color: '#0b1d2a',
        background_color: '#0b1d2a',
        display: 'fullscreen',
        orientation: 'landscape',
      },
    }),
  ],
});
