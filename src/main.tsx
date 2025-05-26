
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CacheProvider } from '@/components/optimization/CacheProvider';
import EnhancedErrorBoundary from '@/components/ErrorBoundary/EnhancedErrorBoundary';
import { ResourcePreloader } from '@/components/optimization/LazyComponentLoader';
import { initProductionSecurity } from '@/lib/security/productionSecurity';

// Initialiser la sécurité en production
if (import.meta.env.PROD) {
  try {
    initProductionSecurity();
  } catch (error) {
    console.error('Security initialization failed:', error);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <EnhancedErrorBoundary>
      <CacheProvider>
        <ResourcePreloader />
        <App />
      </CacheProvider>
    </EnhancedErrorBoundary>
  </React.StrictMode>
);
