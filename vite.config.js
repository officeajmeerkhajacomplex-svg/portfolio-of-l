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
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) return 'vendor-react';
          if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion-dom/') || id.includes('/node_modules/motion-utils/')) return 'vendor-motion';
          if (id.includes('/node_modules/lottie-react/') || id.includes('/node_modules/lottie-web/')) return 'vendor-lottie';
          return undefined;
        },
      },
    },
  },
});
