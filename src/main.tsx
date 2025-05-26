
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Ensure React is fully available before importing App
console.log('Main.tsx - React check:', {
  React: !!React,
  useState: !!React?.useState,
  useContext: !!React?.useContext,
  StrictMode: !!StrictMode
});

// Make React globally available
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Import App after React is confirmed to be available
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

console.log('Creating React root...');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
