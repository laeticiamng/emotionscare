import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Version ultra-simplifiée pour débugger
function AppSimple() {
  return (
    <Router>
      <div className="min-h-screen bg-background p-4">
        <h1 className="text-2xl font-bold">EmotionsCare - Test Simple</h1>
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-xl">Page d'accueil</h2>
                <p>Application en cours de développement...</p>
              </div>
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-xl text-red-500">Page non trouvée</h2>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default AppSimple;