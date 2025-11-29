import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/dex-static',
  plugins: [solid(), svgr()],
  build: {
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].dex.[hash].js`, // JavaScript entry file naming pattern
        chunkFileNames: `assets/[name].dex.[hash].js`, // Async chunk file naming pattern
        assetFileNames: (assetInfo) => {
          // Asset file naming pattern (CSS, images, etc.)
          const fileName = assetInfo.name;
          if (fileName != null && fileName.endsWith('.css')) {
            return `assets/[name].dex.[hash].[ext]`;
          }
          return `assets/[name].dex.[ext]`;
        },
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core framework
            if (id.includes('solid-js') || id.includes('@solidjs/router') || id.includes('@solid-primitives')) {
              return 'vendor-solid';
            }
            // Lightweight Charts (large)
            if (id.includes('lightweight-charts') || id.includes('fancy-canvas')) {
              return 'vendor-lw-charts';
            }
            // Chart.js (large)
            if (id.includes('chart.js') || id.includes('solid-chartjs')) {
              return 'vendor-chartjs';
            }
            // Chroma
            if (id.includes('chroma-js')) {
              return 'vendor-chroma';
            }
            // Ethers (very large)
            if (id.includes('ethers')) {
              return 'vendor-ethers';
            }
            // Metamask SDK (large)
            if (id.includes('@metamask')) {
              return 'vendor-metamask';
            }
            // Crypto libs
            if (id.includes('@noble') || id.includes('@scure') || id.includes('aes-js')) {
              return 'vendor-crypto';
            }
            // UI
            if (id.includes('solid-bootstrap') || id.includes('bootstrap')) {
              return 'vendor-ui';
            }
            // HTTP
            if (id.includes('axios')) {
              return 'vendor-http';
            }
            // Other node_modules
            return 'vendor-misc';
          }
        },
      },
    },
    // Source map for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['solid-js', '@solidjs/router', 'lightweight-charts', 'chroma-js'],
  },
});
