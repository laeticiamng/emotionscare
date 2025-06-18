
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserSettings from '@/components/settings/UserSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import ThemeSettingsTab from '@/components/settings/ThemeSettingsTab';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="theme">Thème</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
