
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import B2CDashboardPage from './pages/b2c/DashboardPage';
import B2CLayout from './layouts/B2CLayout';
import { MusicProvider } from './contexts/music';

function App() {
  return (
    <MusicProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/b2c/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* B2C Routes */}
        <Route path="/b2c" element={<B2CLayout />}>
          <Route path="dashboard" element={<B2CDashboardPage />} />
        </Route>
      </Routes>
    </MusicProvider>
  );
}

export default App;
