
import React from 'react';
import UserSettings from '@/components/settings/UserSettings';
import Shell from '@/Shell';

const UserSettingsPage: React.FC = () => {
  return (
    <Shell>
      <div className="py-6">
        <UserSettings />
      </div>
    </Shell>
  );
};

export default UserSettingsPage;
