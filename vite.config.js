import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false, // Disable TS type checking in Vite - use esbuild only for transformation
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
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
      "@": resolve(process.cwd(), "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      external: (id) => {
        // Exclude supabase functions/tests
        if (id.includes('supabase/functions') || id.includes('supabase/tests')) return true;
        // Exclude optional dependencies (not installed, loaded dynamically if available)
        const optionalDeps = [
          'mixpanel-browser',
          '@amplitude/analytics-browser',
          'posthog-js',
          'canvg',  // optional jspdf peer dep for SVG support
        ];
        return optionalDeps.some(pkg => id === pkg || id.startsWith(pkg + '/'));
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    }
  },
  
  esbuild: {
    target: 'esnext', // esbuild transforms TypeScript without type checking
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'direct-eval': 'silent'
    }
  },
  
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
}));