/**
 * Main.tsx ultra-simplifié pour diagnostiquer les problèmes
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';

// Configuration basique
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'fr';
  document.title = "EmotionsCare - Plateforme d'intelligence émotionnelle";
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
