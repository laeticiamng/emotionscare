
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { NotificationsPreferences } from '@/types/preferences';

const NotificationSettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const notifications = preferences.notifications as NotificationsPreferences;

  const updateNotificationSetting = (key: keyof NotificationsPreferences, value: boolean) => {
    updatePreferences({
      notifications: {
        ...notifications,
        [key]: value,
      },
    });
  };

  const updateNotificationType = (type: keyof NotificationsPreferences['types'], value: boolean) => {
    updatePreferences({
      notifications: {
        ...notifications,
        types: {
          ...notifications.types,
          [type]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Méthodes de notification</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Notifications par email</Label>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Notifications push</Label>
          <Switch
            id="push-notifications"
            checked={notifications.push}
            onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="inapp-notifications">Notifications dans l'app</Label>
          <Switch
            id="inapp-notifications"
            checked={notifications.inApp}
            onCheckedChange={(checked) => updateNotificationSetting('inApp', checked)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Types de notifications</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="security-notifications">Sécurité</Label>
          <Switch
            id="security-notifications"
            checked={notifications.types.security}
            onCheckedChange={(checked) => updateNotificationType('security', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="system-notifications">Système</Label>
          <Switch
            id="system-notifications"
            checked={notifications.types.system}
            onCheckedChange={(checked) => updateNotificationType('system', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="social-notifications">Social</Label>
          <Switch
            id="social-notifications"
            checked={notifications.types.social}
            onCheckedChange={(checked) => updateNotificationType('social', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="achievements-notifications">Réussites</Label>
          <Switch
            id="achievements-notifications"
            checked={notifications.types.achievements}
            onCheckedChange={(checked) => updateNotificationType('achievements', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reminders-notifications">Rappels</Label>
          <Switch
            id="reminders-notifications"
            checked={notifications.types.reminders}
            onCheckedChange={(checked) => updateNotificationType('reminders', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
