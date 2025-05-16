
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import ThemeLayout from './layouts/ThemeLayout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeLayout>
      <App />
      <Toaster />
    </ThemeLayout>
  </React.StrictMode>
);
