// Pure JavaScript configuration to bypass broken tsconfig.json
export default {
  plugins: [
    {
      name: 'react-jsx',
      transform(code, id) {
        if (id.endsWith('.jsx') || id.endsWith('.tsx') || id.endsWith('.ts')) {
          return {
            code: code,
            map: null
          };
        }
      }
    }
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
      "@": new URL('./src', import.meta.url).pathname,
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  
  esbuild: {
    jsx: 'automatic',
    loader: {
      '.ts': 'tsx',
      '.tsx': 'tsx'
    }
  }
};