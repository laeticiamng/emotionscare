
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePreferences } from '@/hooks/usePreferences';

const NotificationPreferences = () => {
  const {
    preferences,
    isLoading,
    updatePreferences,
    notifications_enabled = false,
    notification_frequency = 'daily',
    notification_type = 'all',
    notification_tone = 'gentle',
    email_notifications = false,
    push_notifications = false
  } = usePreferences();

  const handleUpdatePreferences = async (newPrefs: Partial<typeof preferences>) => {
    await updatePreferences(newPrefs);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Gérez vos préférences de notification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications-enabled"
              checked={!!notifications_enabled}
              onCheckedChange={(checked) => handleUpdatePreferences({ 
                notifications_enabled: !!checked 
              })}
            />
            <label htmlFor="notifications-enabled" className="text-sm">
              Activer toutes les notifications
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fréquence des notifications</label>
          <Select
            defaultValue={notification_frequency}
            onValueChange={(value) => handleUpdatePreferences({ 
              notificationFrequency: value 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Quotidiennement</SelectItem>
              <SelectItem value="weekly">Chaque semaine</SelectItem>
              <SelectItem value="monthly">Mensuellement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type de notifications</label>
          <Select
            defaultValue={notification_type}
            onValueChange={(value) => handleUpdatePreferences({ 
              notificationType: value 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout</SelectItem>
              <SelectItem value="important">Important uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tonalité des notifications</label>
          <Select
            defaultValue={notification_tone}
            onValueChange={(value) => handleUpdatePreferences({ 
              notificationTone: value 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une tonalité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gentle">Douce</SelectItem>
              <SelectItem value="assertive">Assurée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-notifications"
              checked={!!email_notifications}
              onCheckedChange={(checked) =>
                handleUpdatePreferences({ 
                  notifications: { 
                    ...preferences.notifications, 
                    email: !!checked 
                  } 
                })
              }
            />
            <label htmlFor="email-notifications" className="text-sm">
              Recevoir des notifications par email
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push-notifications"
              checked={!!push_notifications}
              onCheckedChange={(checked) =>
                handleUpdatePreferences({ 
                  notifications: { 
                    ...preferences.notifications, 
                    push: !!checked 
                  } 
                })
              }
            />
            <label htmlFor="push-notifications" className="text-sm">
              Recevoir des notifications push
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
