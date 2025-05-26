
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure React is available globally and properly initialized
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Ensure React hooks are available
console.log('React hooks check:', { useState: React.useState, useContext: React.useContext });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
