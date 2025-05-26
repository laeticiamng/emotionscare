
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure React is available immediately
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Add console logging for debugging
console.log('EmotionsCare - React initialization check:', {
  React: !!React,
  hooks: { 
    useState: !!React.useState, 
    useContext: !!React.useContext,
    useEffect: !!React.useEffect
  },
  StrictMode: !!StrictMode,
  timestamp: new Date().toISOString()
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found - Check index.html');
}

console.log('Creating React root...');

const root = createRoot(rootElement);

// Add error boundary for initialization
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('EmotionsCare application started successfully');
} catch (error) {
  console.error('Failed to render application:', error);
  // Fallback render without StrictMode
  root.render(<App />);
}
