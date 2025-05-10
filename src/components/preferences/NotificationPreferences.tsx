import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NotificationFrequency, NotificationType, NotificationTone, UserPreferencesState } from '@/types';
import { TimePicker } from '@/components/ui/time-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface NotificationPreferencesProps {
  preferences: UserPreferencesState;
  onUpdate: (key: string, value: any) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdate
}) => {
  const handleToggleNotifications = (checked: boolean) => {
    onUpdate('notifications_enabled', checked);
  };

  const handleFrequencyChange = (value: NotificationFrequency) => {
    onUpdate('notification_frequency', value);
  };

  const handleTypeChange = (value: NotificationType) => {
    onUpdate('notification_type', value);
  };
  
  const handleToneChange = (value: NotificationTone) => {
    onUpdate('notification_tone', value);
  };

  const handleReminderTimeChange = (time: string) => {
    onUpdate('reminder_time', time);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
        <CardDescription>
          Personnalisez la façon dont vous recevez les notifications.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex-1">
            Activer les notifications
          </Label>
          <Switch
            id="notifications"
            checked={preferences.notifications_enabled}
            onCheckedChange={handleToggleNotifications}
          />
        </div>

        <div>
          <Label htmlFor="frequency">Fréquence</Label>
          <Select
            id="frequency"
            value={preferences.notification_frequency as string}
            onValueChange={(value) => handleFrequencyChange(value as NotificationFrequency)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Quotidien</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
              <SelectItem value="none">Aucune</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            value={preferences.notification_type as string}
            onValueChange={(value) => handleTypeChange(value as NotificationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="detailed">Détaillé</SelectItem>
              <SelectItem value="full">Complet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tone">Tonalité</Label>
          <Select
            id="tone"
            value={preferences.notification_tone as string}
            onValueChange={(value) => handleToneChange(value as NotificationTone)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la tonalité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimalist">Minimaliste</SelectItem>
              <SelectItem value="poetic">Poétique</SelectItem>
              <SelectItem value="directive">Directif</SelectItem>
              <SelectItem value="silent">Silencieux</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="reminderTime">Heure de rappel</Label>
          <TimePicker
            value={preferences.reminder_time || '09:00'}
            onChange={handleReminderTimeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
