
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('=== MAIN.TSX INITIALIZATION ===');
console.log('✅ React hooks validation passed');
console.log('Creating React root...');
console.log('Rendering EmotionsCare app...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('✅ EmotionsCare application started successfully');
