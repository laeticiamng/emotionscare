
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App.tsx';
import './styles/index.css';
import './styles/premium.css';
import './styles/components.css';
import './App.css';

// --- DEBUG IMPORTS -------------------------------------------------
import.meta.glob(['/**/*.{tsx,ts,jsx,js}']).forEach(async (loader, path) => {
  if (!path.includes('node_modules')) {
    const mod = await loader();
    for (const key in mod) {
      if (typeof mod[key] !== 'function' && typeof mod[key] !== 'object') continue;
      if (
        mod[key] === undefined ||
        (mod[key]?.$$typeof && mod[key].render === undefined) // mauvais export React
      ) {
        console.error('[IMPORT-DEBUG] invalid export in ->', path, 'export:', key, mod[key]);
      }
    }
  }
});
// -------------------------------------------------------------------

const initializeApp = () => {
  console.info(`🚀 Application EmotionsCare - Démarrage [${new Date().toISOString()}]`);
  console.info(`📌 Version: ${import.meta.env.VITE_APP_VERSION || '1.0.0'}`);
  console.info(`📌 Environnement: ${import.meta.env.MODE}`);
  
  // Create a client with improved default options
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
  
  // Get root element
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Root element not found! Application cannot start.");
    return;
  }
  
  // Create and render root
  const root = createRoot(rootElement);
  
  root.render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );
  
  console.info("✅ Application initialization completed");
};

// Start the application
initializeApp();
