import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  define: {
    global: 'window',
  },

  // import 경로 설정
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
});
