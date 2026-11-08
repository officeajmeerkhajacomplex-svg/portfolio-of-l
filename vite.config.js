import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/portfolio-of-l/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined;
          if (/\\/node_modules\\/(react|react-dom|scheduler)\\//.test(id)) return 'vendor-react';
          if (/\\/node_modules\\/(framer-motion|motion-dom|motion-utils)\\//.test(id)) return 'vendor-motion';
          if (/\\/node_modules\\/(lottie-react|lottie-web)\\//.test(id)) return 'vendor-lottie';
          return undefined;
        },
      },
    },
  },
});
