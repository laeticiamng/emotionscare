import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    sourcemap: mode === 'development',
    minify: 'esbuild',
    reportCompressedSize: false,
  },
  
  esbuild: {
    target: 'esnext',
    logLevel: 'silent'
  },
  
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
}));