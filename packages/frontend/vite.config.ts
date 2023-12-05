import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [solid(), svgr()],
  build: {
    // rollupOptions: {
    //   input: {
    //     main: '/src/main.tsx',
    //     // myStaticPage: '/public/myStaticPage.html', // 정적 페이지 경로 추가
    //   },
    // },
  },
});
