
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Assurer que React est correctement importé
      jsxImportSource: 'react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-toast',
      'framer-motion',
      'lucide-react',
    ],
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-dialog'],
          icons: ['lucide-react'],
          animations: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 8080,
    host: true,
  },
});
