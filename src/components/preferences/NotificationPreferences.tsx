
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeInput from "@/components/ui/time-input";
import { Bell } from "lucide-react";
import { NotificationFrequency, NotificationType, NotificationTone, UserPreferencesState } from "@/types";

interface NotificationPreferencesProps {
  preferences: UserPreferencesState;
  onUpdate: (preferences: Partial<UserPreferencesState>) => void;
  isUpdating?: boolean;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  preferences, 
  onUpdate,
  isUpdating = false,
}) => {
  // Update notification enabled state
  const handleToggleNotifications = (enabled: boolean) => {
    onUpdate({
      notificationsEnabled: enabled
    });
  };

  // Update reminder time
  const handleReminderTimeChange = (time: string) => {
    onUpdate({
      reminderTime: time
    });
  };

  // Update notification frequency
  const handleFrequencyChange = (value: NotificationFrequency) => {
    onUpdate({
      notificationFrequency: value
    });
  };

  // Update notification type
  const handleTypeChange = (value: NotificationType) => {
    onUpdate({
      notificationType: value
    });
  };

  // Update notification tone
  const handleToneChange = (value: NotificationTone) => {
    onUpdate({
      notificationTone: value
    });
  };

  // Toggle channel settings
  const handleChannelToggle = (channel: keyof UserPreferences['channels'], enabled: boolean) => {
    onUpdate({
      channels: {
        ...preferences.channels,
        [channel]: enabled
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Préférences de notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/disable notifications */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications-toggle" className="text-base font-medium">Notifications</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Activez ou désactivez toutes les notifications
            </p>
          </div>
          <Switch
            id="notifications-toggle"
            checked={preferences.notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
            disabled={isUpdating}
          />
        </div>

        {preferences.notificationsEnabled && (
          <>
            {/* Notification channels */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Canaux de notification</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-toggle" className="cursor-pointer">Email</Label>
                  <Switch
                    id="email-toggle"
                    checked={preferences.channels.email}
                    onCheckedChange={(checked) => handleChannelToggle("email", checked)}
                    disabled={isUpdating}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-toggle" className="cursor-pointer">Notifications push</Label>
                  <Switch
                    id="push-toggle"
                    checked={preferences.channels.push}
                    onCheckedChange={(checked) => handleChannelToggle("push", checked)}
                    disabled={isUpdating}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-toggle" className="cursor-pointer">SMS</Label>
                  <Switch
                    id="sms-toggle"
                    checked={preferences.channels.sms}
                    onCheckedChange={(checked) => handleChannelToggle("sms", checked)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
            
            {/* Notification frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency-select">Fréquence des notifications</Label>
              <Select
                value={preferences.notificationFrequency}
                onValueChange={(value) => handleFrequencyChange(value as NotificationFrequency)}
                disabled={isUpdating}
              >
                <SelectTrigger id="frequency-select">
                  <SelectValue placeholder="Fréquence des notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="none">Aucune</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                À quelle fréquence souhaitez-vous recevoir des notifications?
              </p>
            </div>
            
            {/* Notification time */}
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Heure de rappel préférée</Label>
              <TimeInput
                id="reminder-time"
                value={preferences.reminderTime}
                onChange={handleReminderTimeChange}
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground mt-1">
                À quelle heure préférez-vous recevoir les notifications?
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
