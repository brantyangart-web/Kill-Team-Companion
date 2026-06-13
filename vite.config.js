import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
