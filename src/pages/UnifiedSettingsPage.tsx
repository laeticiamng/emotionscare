import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import B2CSettingsPage from '@/pages/b2c/Settings';
import B2BUserSettingsPage from '@/pages/b2b/user/Settings';
import B2BAdminSettingsPage from '@/pages/b2b/admin/Settings';

const UnifiedSettingsPage: React.FC = () => {
  const { user } = useAuth();

  const role = normalizeUserMode(user?.role || 'b2c');

  if (role === 'b2b_admin') {
    return <B2BAdminSettingsPage />;
  }

  if (role === 'b2b_user') {
    return <B2BUserSettingsPage />;
  }

  return <B2CSettingsPage />;
};

export default UnifiedSettingsPage;
