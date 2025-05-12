
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import DashboardLayout from '@/components/DashboardLayout';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PersonalProfile from '@/components/settings/PersonalProfile';
import ThemeSettingsTab from '@/components/admin/settings/ThemeSettingsTab';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { user } = useAuth();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Paramètres"
          description="Gérez votre compte et vos préférences"
          icon={<Settings className="h-5 w-5" />}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="w-full border-b bg-transparent p-0 h-auto">
            <div className="flex overflow-x-auto pb-1">
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Compte
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Profil personnel
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Apparence
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings user={user} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <PersonalProfile />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <ThemeSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
