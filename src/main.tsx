
import React from 'react';
import ReactDOM from 'react-dom/client';
import './setupLogging';
import App from './App';
import './index.css';
import './monitoring';

// Use createRoot API with error handling
const container = document.getElementById('root');

if (!container) {
  console.error('Root element not found!');
} else {
  const root = ReactDOM.createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
