
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImmersiveSettingsPage from './pages/ImmersiveSettingsPage';
import AdminPremiumDashboard from './pages/AdminPremiumDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPremiumDashboard />} />
        <Route path="/settings" element={<ImmersiveSettingsPage />} />
        <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
