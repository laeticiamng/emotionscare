// Solution définitive : remplacer le main.tsx par une version simplifiée
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';

// Import de l'app simplifiée qui fonctionne
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element not found');
}

// Configuration React 18 optimisée
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);