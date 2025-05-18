
import React from 'react';
import ReactDOM from 'react-dom/client';
import './setupLogging';
import App from './App';
import './index.css';
import './monitoring';
import * as Sentry from '@sentry/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Une erreur est survenue.</p>} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
