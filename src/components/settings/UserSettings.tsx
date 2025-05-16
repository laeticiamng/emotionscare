
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettingsTab from './ThemeSettingsTab';
import { Theme } from '@/types/theme';
import { useTheme } from '@/contexts/ThemeContext';

const UserSettings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('theme');

  const handleThemeChange = (newTheme: Theme) => {
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
          <div>Contenu des paramètres du compte</div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div>Contenu des paramètres de notifications</div>
        </TabsContent>
        
        <TabsContent value="privacy">
          <div>Contenu des paramètres de confidentialité</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
