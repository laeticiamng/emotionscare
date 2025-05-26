
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure React is globally available immediately
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('React globally set:', !!React);
}

// Add comprehensive React initialization check
console.log('EmotionsCare - React initialization check:', {
  React: !!React,
  ReactDOM: !!createRoot,
  hooks: { 
    useState: !!React.useState, 
    useContext: !!React.useContext,
    useEffect: !!React.useEffect,
    useCallback: !!React.useCallback,
    useMemo: !!React.useMemo
  },
  StrictMode: !!StrictMode,
  timestamp: new Date().toISOString()
});

// Validate React is properly loaded
if (!React || !React.useState) {
  throw new Error('React hooks not available - critical initialization failure');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found - Check index.html');
}

console.log('Creating React root...');

const root = createRoot(rootElement);

// Add error boundary for initialization with detailed error handling
try {
  console.log('Rendering app with StrictMode...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('EmotionsCare application started successfully');
} catch (error) {
  console.error('Failed to render application:', error);
  // Fallback render without StrictMode but with error reporting
  try {
    console.log('Attempting fallback render without StrictMode...');
    root.render(<App />);
    console.log('Fallback render successful');
  } catch (fallbackError) {
    console.error('Critical: Both normal and fallback renders failed:', fallbackError);
    // Last resort: render a simple error message
    root.render(
      React.createElement('div', { 
        style: { 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          color: '#dc2626' 
        } 
      }, 'Application failed to start. Please refresh the page.')
    );
  }
}
