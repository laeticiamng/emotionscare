
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin de débogage pour Vite
const debugPlugin = () => {
  return {
    name: 'debug-plugin',
    configResolved(config: any) {
      if (process.env.DEBUG) {
        console.log('🔧 Configuration Vite résolue:');
        console.log('  - Mode:', config.mode);
        console.log('  - Base URL:', config.base);
        console.log('  - Env prefix:', config.envPrefix);
      }
    },
    transformIndexHtml(html: any) {
      if (process.env.DEBUG) {
        console.log('📄 Transformation de index.html');
      }
      return html;
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      plugins: [],
      // Use SWC minify for faster builds
      swcMinify: true,
    }),
    mode === 'development' && componentTagger(),
    mode === 'development' && debugPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Improve build performance
  build: {
    sourcemap: mode === 'development',
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000, // Increase warning limit
    minify: 'esbuild', // Always use esbuild for faster builds
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: mode === 'production', // Remove debugger statements in production
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@/components/ui']
        }
      }
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['cypress']
  },
  // Define environment variables
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__DEBUG_MODE__': mode === 'development'
  }
}));
