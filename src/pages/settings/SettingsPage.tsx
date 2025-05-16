
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('preferences');

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>You must be logged in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <PreferencesForm user={user} />
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="text-muted-foreground">
            Profile settings will be implemented soon.
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="text-muted-foreground">
            Notification settings will be implemented soon.
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="text-muted-foreground">
            Security settings will be implemented soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
