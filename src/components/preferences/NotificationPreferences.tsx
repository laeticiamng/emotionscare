
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from '@/hooks/usePreferences';

const NotificationPreferences: React.FC = () => {
  const { preferences, isLoading, updatePreferences } = usePreferences();
  
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
              checked={preferences.notifications_enabled || false}
              onCheckedChange={(checked) => updatePreferences({ notifications_enabled: checked })}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>E-mail</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch 
              checked={preferences.email_notifications || false}
              onCheckedChange={(checked) => updatePreferences({ email_notifications: checked })}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>Push</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
            </div>
            <Switch 
              checked={preferences.push_notifications || false}
              onCheckedChange={(checked) => updatePreferences({ push_notifications: checked })}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
