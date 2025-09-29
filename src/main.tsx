// Updated main.tsx for latest Lovable template
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Updated for latest Lovable template with clean App structure
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);