
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserModeProvider>
          <App />
        </UserModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
