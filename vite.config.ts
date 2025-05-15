
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin de débogage pour Vite
const debugPlugin = () => {
  return {
    name: 'debug-plugin',
    configResolved(config: any) {
      console.log('🔧 Configuration Vite résolue:');
      console.log('  - Mode:', config.mode);
      console.log('  - Base URL:', config.base);
      console.log('  - Env prefix:', config.envPrefix);
    },
    transformIndexHtml(html: any) {
      console.log('📄 Transformation de index.html');
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
    react(),
    mode === 'development' && componentTagger(),
    mode === 'development' && debugPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuration permettant d'afficher plus d'informations lors du build
  build: {
    sourcemap: true,
    reportCompressedSize: true,
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
  // Configuration développement
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__DEBUG_MODE__': mode === 'development'
  }
}));
