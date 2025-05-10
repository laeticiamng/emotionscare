
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TimeInput } from "@/components/ui/time-input";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationTone, UserPreferencesState } from '@/types';

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
  // Initialize notification settings if they don't exist
  useEffect(() => {
    if (!preferences.notifications) {
      onUpdate({
        notifications: {
          journal: false,
          breathing: false,
          music: false,
        }
      });
    }
  }, [preferences, onUpdate]);

  const handleToggleNotifications = (enabled: boolean) => {
    onUpdate({ notificationsEnabled: enabled });
  };

  const handleToggleJournalNotification = (enabled: boolean) => {
    onUpdate({
      notifications: {
        ...(preferences.notifications || { journal: false, breathing: false, music: false }),
        journal: enabled,
      },
    });
  };

  const handleToggleBreathingNotification = (enabled: boolean) => {
    onUpdate({
      notifications: {
        ...(preferences.notifications || { journal: false, breathing: false, music: false }),
        breathing: enabled,
      },
    });
  };

  const handleToggleMusicNotification = (enabled: boolean) => {
    onUpdate({
      notifications: {
        ...(preferences.notifications || { journal: false, breathing: false, music: false }),
        music: enabled,
      },
    });
  };

  const handleReminderTimeChange = (time: string) => {
    onUpdate({ reminderTime: time });
  };

  const handleToneChange = (tone: NotificationTone) => {
    onUpdate({ notificationTone: tone });
  };

  const handleResetNotifications = () => {
    onUpdate({
      notificationsEnabled: true,
      notifications: {
        journal: true,
        breathing: false,
        music: true,
      },
      reminderTime: "09:00",
      notificationTone: "minimalist"
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
      <CardContent className="space-y-8">
        {/* Main notification toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notification-toggle" className="text-base font-medium">
              Activer les notifications
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Recevez des rappels personnalisés selon votre activité
            </p>
          </div>
          <Switch
            id="notification-toggle"
            checked={preferences.notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
            disabled={isUpdating}
          />
        </div>

        {preferences.notificationsEnabled && (
          <>
            {/* Activities notifications section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Activités</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="journal-notification" className="cursor-pointer">
                    Journal émotionnel
                  </Label>
                  <Switch
                    id="journal-notification"
                    checked={preferences.notifications?.journal}
                    onCheckedChange={handleToggleJournalNotification}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="breathing-notification" className="cursor-pointer">
                    Exercices de respiration
                  </Label>
                  <Switch
                    id="breathing-notification"
                    checked={preferences.notifications?.breathing}
                    onCheckedChange={handleToggleBreathingNotification}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="music-notification" className="cursor-pointer">
                    Suggestions musicales
                  </Label>
                  <Switch
                    id="music-notification"
                    checked={preferences.notifications?.music}
                    onCheckedChange={handleToggleMusicNotification}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>

            {/* Reminder time section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="reminder-time" className="text-sm font-medium text-muted-foreground">
                  Heure de rappel quotidien
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Choisissez l'heure à laquelle vous souhaitez être rappelé pour votre check-in émotionnel
                </p>
              </div>
              <TimeInput
                id="reminder-time"
                value={preferences.reminderTime || "09:00"}
                onChange={handleReminderTimeChange}
                disabled={isUpdating}
              />
            </div>

            {/* Notification tone section */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tonalité des notifications
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Choisissez le style de langage utilisé dans vos notifications
                </p>
              </div>

              <RadioGroup
                value={preferences.notificationTone || "minimalist"}
                onValueChange={(value) => handleToneChange(value as NotificationTone)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="minimalist" id="tone-minimalist" />
                  <Label htmlFor="tone-minimalist">Minimaliste</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="poetic" id="tone-poetic" />
                  <Label htmlFor="tone-poetic">Poétique</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="directive" id="tone-directive" />
                  <Label htmlFor="tone-directive">Directive</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="silent" id="tone-silent" />
                  <Label htmlFor="tone-silent">Silencieuse</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reset button */}
            <div className="pt-4 text-right">
              <Button variant="outline" onClick={handleResetNotifications} disabled={isUpdating}>
                Réinitialiser les notifications
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
