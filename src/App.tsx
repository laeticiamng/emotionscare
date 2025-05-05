
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Index from './pages/Index';
import NotFoundPage from './pages/NotFound';
import SocialCocoonPage from './pages/SocialCocoonPage';
import CommunityAdminPage from './pages/CommunityAdminPage';
import CompliancePage from './pages/CompliancePage';
import DashboardPage from './pages/DashboardPage';

// Import VR pages
import VRSessionsPage from './pages/VRSessionsPage';
import VRSessionPage from './pages/VRSessionPage';
import VRAnalyticsPage from './pages/VRAnalyticsPage';

function App() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        } />
        
        <Route path="/social-cocoon" element={
          <ProtectedLayout>
            <SocialCocoonPage />
          </ProtectedLayout>
        } />
        
        <Route path="/community" element={
          <ProtectedLayout>
            <SocialCocoonPage />
          </ProtectedLayout>
        } />
        
        <Route path="/community/admin" element={
          <ProtectedLayout requireRole="admin">
            <CommunityAdminPage />
          </ProtectedLayout>
        } />
        
        <Route path="/vr-sessions" element={
          <ProtectedLayout>
            <VRSessionsPage />
          </ProtectedLayout>
        } />
        
        <Route path="/vr-sessions/:id" element={
          <ProtectedLayout>
            <VRSessionPage />
          </ProtectedLayout>
        } />
        
        <Route path="/vr-analytics" element={
          <ProtectedLayout>
            <VRAnalyticsPage />
          </ProtectedLayout>
        } />
        
        <Route path="/compliance" element={<CompliancePage />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
