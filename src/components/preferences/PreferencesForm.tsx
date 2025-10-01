// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import ThemeSettings from './ThemeSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AccessibilitySettings from './AccessibilitySettings';

const PreferencesForm: React.FC = () => {
  const { preferences, isLoading } = useUserPreferences();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences utilisateur</CardTitle>
        <CardDescription>
          Personnalisez votre expérience selon vos besoins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="theme">Thème</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-4">
            <ThemeSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <AccessibilitySettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
