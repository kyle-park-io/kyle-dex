import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/dex-static',
  plugins: [solid(), svgr()],
  build: {
    rollupOptions: {
      //   input: {
      //     main: '/src/main.tsx',
      //     // myStaticPage: '/public/myStaticPage.html', // 정적 페이지 경로 추가
      //   },
      output: {
        entryFileNames: `assets/[name].dex.[hash].js`, // JavaScript 파일의 이름 패턴
        chunkFileNames: `assets/[name].dex.[hash].js`, // 비동기 청크 파일의 이름 패턴
        assetFileNames: (assetInfo) => {
          // CSS, 이미지 등의 파일 이름 패턴
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `assets/[name].dex.[hash].[ext]`;
          }
          return `assets/[name].dex.[ext]`;
        },
      },
    },
  },
});
