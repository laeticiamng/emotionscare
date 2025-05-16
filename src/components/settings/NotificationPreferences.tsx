
import React from 'react';
import { UserPreferences } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NotificationPreferencesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ preferences, onChange }) => {
  // Ensure we have the notifications object
  const notifications = preferences.notifications || {
    enabled: false,
    emailEnabled: false,
    pushEnabled: false,
    inAppEnabled: false,
    types: {},
    frequency: 'immediate'
  };

  // Helper to update nested notification preferences
  const handleNotificationChange = (key: string, value: any) => {
    onChange({
      notifications: {
        ...notifications,
        [key]: value
      }
    });
  };

  // Helper to update notification types
  const handleTypeChange = (type: string, enabled: boolean) => {
    onChange({
      notifications: {
        ...notifications,
        types: {
          ...notifications.types,
          [type]: enabled
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="notificationsEnabled">Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Activer ou désactiver toutes les notifications
          </p>
        </div>
        <Switch
          id="notificationsEnabled"
          checked={notifications.enabled}
          onCheckedChange={(checked) => handleNotificationChange('enabled', checked)}
        />
      </div>

      {notifications.enabled && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailEnabled">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch
              id="emailEnabled"
              checked={notifications.emailEnabled}
              onCheckedChange={(checked) => handleNotificationChange('emailEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushEnabled">Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications push sur votre appareil
              </p>
            </div>
            <Switch
              id="pushEnabled"
              checked={notifications.pushEnabled}
              onCheckedChange={(checked) => handleNotificationChange('pushEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inAppEnabled">Notifications dans l'application</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications dans l'application
              </p>
            </div>
            <Switch
              id="inAppEnabled"
              checked={notifications.inAppEnabled}
              onCheckedChange={(checked) => handleNotificationChange('inAppEnabled', checked)}
            />
          </div>

          <div>
            <Label htmlFor="frequency">Fréquence des notifications</Label>
            <Select
              value={notifications.frequency}
              onValueChange={(value) => handleNotificationChange('frequency', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Sélectionner une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immédiatement</SelectItem>
                <SelectItem value="hourly">Toutes les heures</SelectItem>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Types de notifications</Label>

            {notifications.types && Object.entries(notifications.types).map(([type, enabled]) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`notification-${type}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Label>
                </div>
                <Switch
                  id={`notification-${type}`}
                  checked={enabled}
                  onCheckedChange={(checked) => handleTypeChange(type, checked)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPreferences;
