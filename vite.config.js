import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
    }),
  ],
  
  server: {
    host: "::",
    port: 8080,
  },
  
  preview: {
    port: 4173,
    host: "::"
  },
  
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TYPESCRIPT_ERROR') return;
        warn(warning);
      }
    }
  },
  
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
    jsxImportSource: 'react',
    loader: 'tsx',
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  },
});