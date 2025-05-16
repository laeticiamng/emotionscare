import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import B2C Music pages
import B2CMusic from '../pages/b2c/Music';
import B2CMusicCreate from '../pages/b2c/MusicCreate';
import B2CMusicPreferences from '../pages/b2c/MusicPreferences';

// Import B2B User Music pages
import B2BUserMusic from '../pages/b2b/user/Music';
import B2BUserMusicCreate from '../pages/b2b/user/MusicCreate';
import B2BUserMusicPreferences from '../pages/b2b/user/MusicPreferences';

// Import B2B Admin Music page
import B2BAdminMusic from '../pages/b2b/admin/Music';

// Import B2C Coach pages
import B2CCoach from '../pages/b2c/Coach';
import B2CCoachChat from '../pages/b2c/CoachChat';

// Import B2B User Coach pages
import B2BUserCoach from '../pages/b2b/user/Coach';
import B2BUserCoachChat from '../pages/b2b/user/CoachChat';

// Import B2B Admin Coach Analytics
import B2BAdminCoachAnalytics from '../pages/b2b/admin/CoachAnalytics';

// Other pages
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* B2C Music Routes */}
      <Route path="/music" element={<B2CMusic />} />
      <Route path="/music/create" element={<B2CMusicCreate />} />
      <Route path="/music/preferences" element={<B2CMusicPreferences />} />
      
      {/* B2B User Music Routes */}
      <Route path="/b2b/user/music" element={<B2BUserMusic />} />
      <Route path="/b2b/user/music/create" element={<B2BUserMusicCreate />} />
      <Route path="/b2b/user/music/preferences" element={<B2BUserMusicPreferences />} />
      
      {/* B2B Admin Music Route */}
      <Route path="/b2b/admin/music" element={<B2BAdminMusic />} />
      
      {/* B2C Coach Routes */}
      <Route path="/coach" element={<B2CCoach />} />
      <Route path="/coach-chat" element={<B2CCoachChat />} />
      
      {/* B2B User Coach Routes */}
      <Route path="/b2b/user/coach" element={<B2BUserCoach />} />
      <Route path="/b2b/user/coach-chat" element={<B2BUserCoachChat />} />
      
      {/* B2B Admin Coach Analytics */}
      <Route path="/b2b/admin/coach-analytics" element={<B2BAdminCoachAnalytics />} />
    </Routes>
  );
};

export default AppRoutes;
