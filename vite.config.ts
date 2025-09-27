import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      // Force JSX configuration
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    // Force JSX processing for all TypeScript files
    jsx: 'automatic',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'tsx',
    include: [
      /\.(tsx?|jsx?)$/,
      /\.ts$/,
      /\.tsx$/,
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});