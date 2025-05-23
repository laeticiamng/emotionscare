
import React from 'react';
import ReactDOM from 'react-dom/client';
import './setupLogging';
import App from './App';
import './index.css';
import './monitoring';

// Defer non-critical operations
const initializeApp = () => {
  // Use createRoot API with error handling
  const container = document.getElementById('root');

  if (!container) {
    console.error('Root element not found!');
    return;
  }
  
  const root = ReactDOM.createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Check if the document is already loaded
if (document.readyState === 'loading') {
  // Use modern event listener with error handling
  document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
} else {
  // If DOMContentLoaded already fired, initialize immediately
  setTimeout(initializeApp, 0);
}
