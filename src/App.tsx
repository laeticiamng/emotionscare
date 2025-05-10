
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImmersiveSettingsPage from './pages/ImmersiveSettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImmersiveSettingsPage />} />
        <Route path="/settings" element={<ImmersiveSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
