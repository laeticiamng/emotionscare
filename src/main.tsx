
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './contexts/AppProviders';
import { GlobalErrorBoundary } from '@/components/ErrorBoundary/GlobalErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </AppProviders>
  </React.StrictMode>
);
