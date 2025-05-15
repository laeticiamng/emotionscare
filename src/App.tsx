
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ImmersiveHome from '@/pages/ImmersiveHome';
import Selection from '@/pages/common/Selection';
import B2BSelection from '@/pages/common/B2BSelection';

import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ImmersiveHome />} />
      <Route path="/immersive" element={<HomePage />} />
      <Route path="/selection" element={<Selection />} />
      <Route path="/b2b/selection" element={<B2BSelection />} />
      
      {/* Ajoutez ici les routes pour le reste de l'application */}
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
