
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { MusicProvider } from './contexts/MusicContext'
import Shell from './components/Shell'
import ProtectedLayout from './components/ProtectedLayout'

// Pages utilisateurs
import Index from './pages/Index'
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

// Auth
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLoginPage from './pages/AdminLoginPage'

// Admin
import AdminDashboardPage from './pages/AdminDashboardPage'

// Erreurs & fallback
import NotFoundPage from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <Routes>
            {/* Route publique racine */}
            <Route path="/" element={<Shell />}>
              <Route index element={<Index />} />
              
              {/* Authentification */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              
              {/* Routes protégées */}
              <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
              <Route path="/scan" element={<ProtectedLayout><ScanPage /></ProtectedLayout>} />
              <Route path="/journal" element={<ProtectedLayout><JournalPage /></ProtectedLayout>} />
              <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
              <Route path="/vr" element={<ProtectedLayout><VRPage /></ProtectedLayout>} />

              {/* Music modules */}
              <Route path="/music" element={<ProtectedLayout><MusicPage /></ProtectedLayout>} />
              <Route path="/music/create" element={<ProtectedLayout><MusicGenerationPage /></ProtectedLayout>} />
              <Route path="/music/preferences" element={<ProtectedLayout><MusicPreferencesPage /></ProtectedLayout>} />

              {/* Coach */}
              <Route path="/coach" element={<ProtectedLayout><CoachPage /></ProtectedLayout>} />
              <Route path="/coach-chat" element={<ProtectedLayout><CoachChatPage /></ProtectedLayout>} />

              {/* Admin dashboard */}
              <Route path="/admin" element={<ProtectedLayout requireRole="admin"><AdminDashboardPage /></ProtectedLayout>} />

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
