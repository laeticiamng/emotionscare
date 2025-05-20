
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Home from '@/Home';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import B2BSelectionImmersive from '@/pages/B2BSelectionImmersive';
import { ThemeProvider } from '@/contexts/ThemeContext';
import UserModeProvider from '@/contexts/UserModeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <UserModeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/b2c/dashboard" element={<DashboardPage />} />
              <Route path="/b2c/profile" element={<ProfilePage />} />
              <Route path="/b2c/settings" element={<SettingsPage />} />
              <Route path="/b2b/selection" element={<B2BSelectionImmersive />} />
              <Route path="/b2b/user/dashboard" element={<DashboardPage />} />
              <Route path="/b2b/admin/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Router>
          <Toaster />
        </UserModeProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}

export default App;
