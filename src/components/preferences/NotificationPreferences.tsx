
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellOff, Bell, Clock } from 'lucide-react';
import { NotificationTone } from '@/types';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleNotificationsToggle = (enabled: boolean) => {
    updatePreferences({ notifications_enabled: enabled });
  };

  const handleTimeChange = (value: string) => {
    updatePreferences({ reminder_time: value });
  };

  const handleFrequencyChange = (value: string) => {
    updatePreferences({ 
      notificationFrequency: value as any
    });
  };

  const handleToneChange = (value: NotificationTone) => {
    updatePreferences({ 
      notificationTone: value
    });
  };

  const handleEmailToggle = (checked: boolean) => {
    updatePreferences({
      notificationTypes: {
        ...preferences.notificationTypes,
        email: checked
      }
    });
  };

  const handlePushToggle = (checked: boolean) => {
    updatePreferences({
      notificationTypes: {
        ...preferences.notificationTypes,
        push: checked
      }
    });
  };

  const handleSmsToggle = (checked: boolean) => {
    updatePreferences({
      notificationTypes: {
        ...preferences.notificationTypes,
        sms: checked
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Configurez comment et quand vous souhaitez recevoir des notifications.
          </p>
        </div>
        <Switch 
          checked={preferences.notifications_enabled}
          onCheckedChange={handleNotificationsToggle}
        />
      </div>

      {preferences.notifications_enabled && (
        <>
          <Separator />
          
          <div className="space-y-4">
            <Label className="text-base">Types de notifications</Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center gap-2">
                  Email
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={preferences.notificationTypes?.email}
                  onCheckedChange={handleEmailToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2">
                  Notifications push
                </Label>
                <Switch 
                  id="push-notifications" 
                  checked={preferences.notificationTypes?.push}
                  onCheckedChange={handlePushToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                  SMS
                </Label>
                <Switch 
                  id="sms-notifications" 
                  checked={preferences.notificationTypes?.sms}
                  onCheckedChange={handleSmsToggle}
                />
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <Label className="text-base">Style de notification</Label>
            <RadioGroup 
              value={preferences.notificationTone || 'minimalist'}
              onValueChange={(value) => handleToneChange(value as NotificationTone)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimalist" id="tone-minimalist" />
                <Label htmlFor="tone-minimalist">Minimaliste</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poetic" id="tone-poetic" />
                <Label htmlFor="tone-poetic">Poétique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="directive" id="tone-directive" />
                <Label htmlFor="tone-directive">Directif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="silent" id="tone-silent" />
                <Label htmlFor="tone-silent">Silencieux (visuel uniquement)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <Label className="text-base">Fréquence</Label>
            <Select 
              value={preferences.notificationFrequency || 'daily'}
              onValueChange={handleFrequencyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="flexible">Flexible (selon votre activité)</SelectItem>
                <SelectItem value="none">Aucune</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <Label htmlFor="reminder-time" className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Heure de rappel préférée
            </Label>
            <Select 
              value={preferences.reminder_time || '09:00'}
              onValueChange={handleTimeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">08:00 (Matin)</SelectItem>
                <SelectItem value="09:00">09:00 (Matin)</SelectItem>
                <SelectItem value="12:00">12:00 (Midi)</SelectItem>
                <SelectItem value="15:00">15:00 (Après-midi)</SelectItem>
                <SelectItem value="18:00">18:00 (Soir)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPreferences;
