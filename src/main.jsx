// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './AppLatest.jsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode><App /></React.StrictMode>);