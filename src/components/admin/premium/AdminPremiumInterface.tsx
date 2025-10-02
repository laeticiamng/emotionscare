import React from 'react';
import PremiumAdminHeader from './PremiumAdminHeader';
import AdminSidebar from './AdminSidebar';
import { User } from '@/types/user';

interface AdminPremiumInterfaceProps {
  children: React.ReactNode;
  currentPath?: string;
  user?: User;
}

const AdminPremiumInterface: React.FC<AdminPremiumInterfaceProps> = ({
  children,
  currentPath = '/admin',
  user
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="flex h-screen bg-background dark:bg-gray-900">
      <AdminSidebar currentPath={currentPath} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PremiumAdminHeader 
          pageTitle="Dashboard Administration" 
          onSettingsClick={toggleSettings}
          user={user}
        />
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
      
      {/* Settings panel could be added here if needed */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="w-80 bg-background h-full p-4 animate-in slide-in-from-right">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            {/* Settings content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPremiumInterface;
