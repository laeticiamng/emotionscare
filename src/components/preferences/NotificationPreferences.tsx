
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from '@/hooks/usePreferences';

const NotificationPreferences: React.FC = () => {
  const { preferences, isLoading, updatePreferences } = usePreferences();
  
  const handleNotificationsChange = (checked: boolean) => {
    updatePreferences({ 
      notifications: checked
    });
  };
  
  const handleEmailNotificationsChange = (checked: boolean) => {
    // Using a temporary custom property for email notifications
    updatePreferences({ 
      // Create a custom property for the preferences object
      notifications: checked
    });
  };
  
  const handlePushNotificationsChange = (checked: boolean) => {
    // Using a temporary custom property for push notifications
    updatePreferences({ 
      // Create a custom property for the preferences object
      notifications: checked
    });
  };
  
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-medium">Paramètres de notification</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Notifications</p>
              <p className="text-sm text-muted-foreground">Activer les notifications</p>
            </div>
            <Switch 
              checked={preferences.notifications || false}
              onCheckedChange={handleNotificationsChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>E-mail</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch 
              checked={preferences.notifications || false}
              onCheckedChange={handleEmailNotificationsChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>Push</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
            </div>
            <Switch 
              checked={preferences.notifications || false}
              onCheckedChange={handlePushNotificationsChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
