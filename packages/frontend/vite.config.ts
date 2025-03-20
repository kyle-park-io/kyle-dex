import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [solid(), svgr()],
  build: {
    rollupOptions: {
      //   input: {
      //     main: '/src/main.tsx',
      //     // myStaticPage: '/public/myStaticPage.html', // 정적 페이지 경로 추가
      //   },
      output: {
        entryFileNames: `assets/[name].dex.js`, // JavaScript 파일의 이름 패턴
        chunkFileNames: `assets/[name].dex.js`, // 비동기 청크 파일의 이름 패턴
        assetFileNames: `assets/[name].dex.[ext]`, // CSS, 이미지 등의 파일 이름 패턴
      },
    },
  },
  server: {
    port: 3004,
  },
});
