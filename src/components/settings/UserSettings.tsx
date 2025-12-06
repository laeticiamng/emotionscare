// @ts-nocheck

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettingsTab from './ThemeSettingsTab';
import AccountSettingsTab from './AccountSettingsTab';
import NotificationsSettingsTab from './NotificationsSettingsTab';
import PrivacySettingsTab from './PrivacySettingsTab';
import { useTheme } from '@/providers/theme';
import { ThemeName } from '@/types/theme';

const UserSettings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('theme');

  // Properly typed theme handler
  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Paramètres utilisateur</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="theme">Thème</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme">
          <ThemeSettingsTab 
            currentTheme={theme}
            onThemeChange={handleThemeChange} 
          />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettingsTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSettingsTab />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
