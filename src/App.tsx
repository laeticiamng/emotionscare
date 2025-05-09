
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { MusicProvider } from './contexts/MusicContext'
import Shell from './components/Shell'
import ProtectedLayout from './components/ProtectedLayout'
import DashboardLayout from './components/DashboardLayout'

// Pages publiques
import Index from './pages/Index'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLoginPage from './pages/AdminLoginPage'
import NotFoundPage from './pages/NotFound'

// Pages utilisateurs
import DashboardPage from './pages/DashboardPage'
import ScanPage from './pages/ScanPage'
import JournalPage from './pages/JournalPage'
import SettingsPage from './pages/SettingsPage'

// Pages musique
import MusicPage from './pages/MusicPage'
import MusicGenerationPage from './pages/MusicGenerationPage'
import MusicPreferencesPage from './pages/MusicPreferencesPage'

// Pages coach
import CoachPage from './pages/CoachPage'
import CoachChatPage from './pages/CoachChatPage'

// Pages VR
import VRPage from './pages/VRPage'

// Admin
import AdminDashboardPage from './pages/AdminDashboardPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <Routes>
            {/* Structure principale avec le Shell */}
            <Route path="/" element={<Shell />}>
              {/* Page d'accueil */}
              <Route index element={<Index />} />
              
              {/* Pages d'authentification */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              
              {/* Routes protégées avec sous-navigation Dashboard */}
              <Route element={<ProtectedLayout />}>
                <Route element={<DashboardLayout />}>
                  {/* Dashboard utilisateur/admin basé sur le rôle */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {/* Routes pour les modules utilisateurs */}
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/vr" element={<VRPage />} />

                  {/* Routes pour les modules de musique */}
                  <Route path="/music" element={<MusicPage />} />
                  <Route path="/music/create" element={<MusicGenerationPage />} />
                  <Route path="/music/preferences" element={<MusicPreferencesPage />} />

                  {/* Routes pour le coach */}
                  <Route path="/coach" element={<CoachPage />} />
                  <Route path="/coach-chat" element={<CoachChatPage />} />
                  
                  {/* Routes admin explicites */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
