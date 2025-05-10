import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPreferencesState, NotificationFrequency, NotificationType, NotificationTone } from '@/types';

interface NotificationPreferencesProps {
  preferences: UserPreferencesState;
  onUpdate: (key: string, value: any) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdate,
}) => {
  const handleChange = (key: string, value: any) => {
    onUpdate(key, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications_enabled" className="text-base">
                Activer les notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications sur votre état émotionnel
              </p>
            </div>
            <Switch
              id="notifications_enabled"
              checked={preferences.notifications_enabled}
              onCheckedChange={(checked) =>
                handleChange('notifications_enabled', checked)
              }
            />
          </div>

          {preferences.notifications_enabled && (
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="notification_frequency">Fréquence</Label>
                <Select
                  value={preferences.notification_frequency || 'daily'}
                  onValueChange={(value) =>
                    handleChange('notification_frequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="none">Aucune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_type">Type de notifications</Label>
                <Select
                  value={preferences.notification_type || 'minimal'}
                  onValueChange={(value) =>
                    handleChange('notification_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimalistes</SelectItem>
                    <SelectItem value="detailed">Détaillées</SelectItem>
                    <SelectItem value="full">Complètes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_tone">Ton des messages</Label>
                <Select
                  value={preferences.notification_tone || 'minimalist'}
                  onValueChange={(value) =>
                    handleChange('notification_tone', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir ton" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimalist">Minimaliste</SelectItem>
                    <SelectItem value="poetic">Poétique</SelectItem>
                    <SelectItem value="directive">Directif</SelectItem>
                    <SelectItem value="silent">Sans texte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notifications" className="cursor-pointer">
                      Notifications par e-mail
                    </Label>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={preferences.email_notifications || false}
                    onCheckedChange={(checked) =>
                      handleChange('email_notifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push_notifications" className="cursor-pointer">
                      Notifications push
                    </Label>
                  </div>
                  <Switch
                    id="push_notifications"
                    checked={preferences.push_notifications || false}
                    onCheckedChange={(checked) =>
                      handleChange('push_notifications', checked)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
