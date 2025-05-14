import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationFrequency, NotificationType, NotificationTone } from '@/types/notification';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Volume2 } from 'lucide-react';

export default function NotificationPreferences() {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const handleToggleNotifications = (enabled: boolean) => {
    updatePreferences({
      notificationsEnabled: enabled,
      notifications: {
        ...preferences.notifications,
        enabled: enabled
      }
    });
  };
  
  const handleToggleEmailNotifications = (enabled: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        emailEnabled: enabled
      }
    });
  };
  
  const handleTogglePushNotifications = (enabled: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        pushEnabled: enabled
      }
    });
  };
  
  const handleFrequencyChange = (value: string) => {
    updatePreferences({
      notificationFrequency: value
    });
  };
  
  const handleToneChange = (value: string) => {
    updatePreferences({
      notificationTone: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Préférences de notifications
        </CardTitle>
        <CardDescription>
          Configurez comment et quand vous souhaitez recevoir des notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Activer ou désactiver toutes les notifications
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={preferences.notificationsEnabled || preferences.notifications?.enabled} 
              onCheckedChange={handleToggleNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={preferences.notifications?.emailEnabled} 
              onCheckedChange={handleToggleEmailNotifications}
              disabled={!preferences.notificationsEnabled && !preferences.notifications?.enabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications dans votre navigateur
              </p>
            </div>
            <Switch 
              id="push-notifications" 
              checked={preferences.notifications?.pushEnabled} 
              onCheckedChange={handleTogglePushNotifications}
              disabled={!preferences.notificationsEnabled && !preferences.notifications?.enabled}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Fréquence des notifications</Label>
            </div>
            <Select 
              value={preferences.notificationFrequency || 'daily'} 
              onValueChange={handleFrequencyChange}
              disabled={!preferences.notificationsEnabled && !preferences.notifications?.enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instantanée</SelectItem>
                <SelectItem value="hourly">Toutes les heures</SelectItem>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Définit à quelle fréquence vous recevez des notifications récapitulatives
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Ton des notifications</Label>
            </div>
            <Select 
              value={preferences.notificationTone || 'friendly'} 
              onValueChange={handleToneChange}
              disabled={!preferences.notificationsEnabled && !preferences.notifications?.enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un ton" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutre</SelectItem>
                <SelectItem value="friendly">Amical</SelectItem>
                <SelectItem value="professional">Professionnel</SelectItem>
                <SelectItem value="encouraging">Encourageant</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Définit le style de communication utilisé dans vos notifications
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="outline" className="w-full">
            Tester les notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
