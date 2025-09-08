import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Toaster } from '@/components/ui/toaster';

// Import direct de la page principale
import HomePage from '@/pages/index.tsx';

// Pages d'erreur simples
const Page404 = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground">Page non trouvée</p>
    </div>
  </div>
);

/**
 * APP SIMPLIFIÉ - Version stable
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Route principale */}
          <Route path="/" element={<HomePage />} />
          
          {/* Autres routes essentielles */}
          <Route path="/b2c" element={<div>Page B2C en construction</div>} />
          <Route path="/entreprise" element={<div>Page Entreprise en construction</div>} />
          <Route path="/login" element={<div>Page Login en construction</div>} />
          <Route path="/help" element={<div>Page Aide en construction</div>} />
          
          {/* Page 404 */}
          <Route path="/404" element={<Page404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;