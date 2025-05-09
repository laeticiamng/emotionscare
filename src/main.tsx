// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Shell from './components/Shell';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('❌ Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </React.StrictMode>
);