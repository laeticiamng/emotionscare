
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import BusinessPage from '@/pages/BusinessPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ScanPage from '@/pages/ScanPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ImmersiveSettingsPage from '@/pages/ImmersiveSettingsPage';
import DesignSystemPage from '@/pages/DesignSystemPage';
import UserSettingsPage from '@/pages/UserSettingsPage';
import ARPage from './pages/ARPage';
import MusicTherapyPage from './pages/MusicTherapyPage';
import { MusicProvider } from '@/contexts/MusicContext';

const App: React.FC = () => {
  console.log("Rendering App component");
  
  return (
    <ThemeProvider>
      <MusicProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Tableaux de bord */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/settings/design" element={<DesignSystemPage />} />
              <Route path="/settings/immersive" element={<ImmersiveSettingsPage />} />
              <Route path="/settings/user" element={<UserSettingsPage />} />
              
              {/* Ajout des routes pour les autres éléments de la sidebar */}
              <Route path="/journal" element={<div className="p-8"><h1>Journal</h1><p>Page en construction</p></div>} />
              <Route path="/music" element={<MusicTherapyPage />} />
              <Route path="/audio" element={<div className="p-8"><h1>Audio</h1><p>Page en construction</p></div>} />
              <Route path="/video" element={<div className="p-8"><h1>Vidéothérapie</h1><p>Page en construction</p></div>} />
              <Route path="/profile" element={<div className="p-8"><h1>Profil</h1><p>Page en construction</p></div>} />
              <Route path="/settings" element={<div className="p-8"><h1>Paramètres</h1><p>Page en construction</p></div>} />
            </Route>
          </Route>
          
          {/* Ajoutez cette route au composant Routes */}
          <Route path="/ar" element={<ARPage />} />
        </Routes>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
