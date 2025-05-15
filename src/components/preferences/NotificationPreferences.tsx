
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, Mail, Clock, MessageSquare } from 'lucide-react';
import { NotificationFrequency, NotificationPreference } from '@/types';
import { Separator } from '@/components/ui/separator';
import { TimePickerInput } from '@/components/ui/time-picker';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const notificationsEnabled = preferences.notifications && 
    (typeof preferences.notifications === 'boolean' ? preferences.notifications : preferences.notifications.enabled);
  
  const emailEnabled = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' ? preferences.notifications.emailEnabled : false;

  const pushEnabled = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' ? preferences.notifications.pushEnabled : false;

  const inAppEnabled = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' ? preferences.notifications.inAppEnabled : true;

  const frequency = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' ? preferences.notifications.frequency : 'daily';

  const quietHoursEnabled = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' && 
    preferences.notifications.quietHours ? preferences.notifications.quietHours.enabled : false;

  const quietHoursStart = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' && 
    preferences.notifications.quietHours ? preferences.notifications.quietHours.start : '22:00';

  const quietHoursEnd = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' && 
    preferences.notifications.quietHours ? preferences.notifications.quietHours.end : '07:00';

  // Obtention des types de notification sécurisée
  const notificationTypes = preferences.notifications && 
    typeof preferences.notifications !== 'boolean' && 
    preferences.notifications.types ? preferences.notifications.types : {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true
    };

  const updateNotificationPreference = (key: keyof NotificationPreference, value: any) => {
    if (typeof preferences.notifications === 'boolean') {
      // Si les notifications sont simplement un booléen, créer un objet complet
      const newNotifications: NotificationPreference = {
        enabled: preferences.notifications,
        emailEnabled: false,
        [key]: value
      };
      updatePreferences({ notifications: newNotifications });
    } else if (preferences.notifications) {
      // Mettre à jour l'objet de notifications existant
      updatePreferences({
        notifications: {
          ...preferences.notifications,
          [key]: value
        }
      });
    } else {
      // Créer un nouvel objet de notifications
      const newNotifications: NotificationPreference = {
        enabled: true,
        emailEnabled: false,
        [key]: value
      };
      updatePreferences({ notifications: newNotifications });
    }
  };

  const updateNotificationType = (type: string, value: boolean) => {
    if (typeof preferences.notifications === 'boolean') {
      // Si les notifications sont simplement un booléen, créer un objet complet avec types
      const newNotifications: NotificationPreference = {
        enabled: preferences.notifications,
        emailEnabled: false,
        types: {
          ...notificationTypes,
          [type]: value
        }
      };
      updatePreferences({ notifications: newNotifications });
    } else if (preferences.notifications) {
      // Mettre à jour l'objet de notifications existant
      updatePreferences({
        notifications: {
          ...preferences.notifications,
          types: {
            ...(preferences.notifications.types || {}),
            [type]: value
          }
        }
      });
    }
  };

  const updateQuietHours = (key: string, value: any) => {
    if (typeof preferences.notifications === 'boolean') {
      // Si les notifications sont simplement un booléen, créer un objet complet
      const newNotifications: NotificationPreference = {
        enabled: preferences.notifications,
        emailEnabled: false,
        quietHours: {
          enabled: key === 'enabled' ? value : false,
          start: key === 'start' ? value : '22:00',
          end: key === 'end' ? value : '07:00'
        }
      };
      updatePreferences({ notifications: newNotifications });
    } else if (preferences.notifications) {
      // Mettre à jour l'objet de notifications existant
      updatePreferences({
        notifications: {
          ...preferences.notifications,
          quietHours: {
            ...(preferences.notifications.quietHours || { enabled: false, start: '22:00', end: '07:00' }),
            [key]: value
          }
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Paramètres généraux de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            <span>Préférences de notification</span>
          </CardTitle>
          <CardDescription>
            Gérez comment et quand vous souhaitez recevoir des notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-enabled" className="font-medium">
                Notifications activées
              </Label>
              <p className="text-sm text-muted-foreground">
                Activer ou désactiver toutes les notifications
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => {
                if (typeof preferences.notifications === 'boolean') {
                  updatePreferences({ notifications: checked });
                } else if (preferences.notifications) {
                  updatePreferences({
                    notifications: { ...preferences.notifications, enabled: checked }
                  });
                } else {
                  const newNotifications: NotificationPreference = {
                    enabled: checked,
                    emailEnabled: false
                  };
                  updatePreferences({ notifications: newNotifications });
                }
              }}
            />
          </div>
          
          {notificationsEnabled && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Canaux de notification</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={emailEnabled}
                      onCheckedChange={(checked) => updateNotificationPreference('emailEnabled', checked)}
                    />
                    <Label htmlFor="email-notifications" className="font-medium">
                      <Mail className="h-4 w-4 inline mr-1" /> Email
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push-notifications"
                      checked={pushEnabled}
                      onCheckedChange={(checked) => updateNotificationPreference('pushEnabled', checked)}
                    />
                    <Label htmlFor="push-notifications" className="font-medium">
                      <BellRing className="h-4 w-4 inline mr-1" /> Push
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="in-app-notifications"
                      checked={inAppEnabled}
                      onCheckedChange={(checked) => updateNotificationPreference('inAppEnabled', checked)}
                    />
                    <Label htmlFor="in-app-notifications" className="font-medium">
                      <MessageSquare className="h-4 w-4 inline mr-1" /> Dans l'app
                    </Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notification-frequency">Fréquence</Label>
                    <Select 
                      value={frequency as string} 
                      onValueChange={(value) => updateNotificationPreference('frequency', value)}
                    >
                      <SelectTrigger id="notification-frequency">
                        <SelectValue placeholder="Sélectionnez une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immédiate</SelectItem>
                        <SelectItem value="daily">Quotidienne (résumé)</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire (résumé)</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Types de notification */}
      {notificationsEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Types de notification</CardTitle>
            <CardDescription>
              Choisissez les types de notification que vous souhaitez recevoir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="system">Système</TabsTrigger>
                <TabsTrigger value="content">Contenu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system-notifications"
                      checked={notificationTypes.system}
                      onCheckedChange={(checked) => updateNotificationType('system', checked)}
                    />
                    <Label htmlFor="system-notifications">Système</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emotion-notifications"
                      checked={notificationTypes.emotion}
                      onCheckedChange={(checked) => updateNotificationType('emotion', checked)}
                    />
                    <Label htmlFor="emotion-notifications">Émotions</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="coach-notifications"
                      checked={notificationTypes.coach}
                      onCheckedChange={(checked) => updateNotificationType('coach', checked)}
                    />
                    <Label htmlFor="coach-notifications">Coach</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="journal-notifications"
                      checked={notificationTypes.journal}
                      onCheckedChange={(checked) => updateNotificationType('journal', checked)}
                    />
                    <Label htmlFor="journal-notifications">Journal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="community-notifications"
                      checked={notificationTypes.community}
                      onCheckedChange={(checked) => updateNotificationType('community', checked)}
                    />
                    <Label htmlFor="community-notifications">Communauté</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="achievement-notifications"
                      checked={notificationTypes.achievement}
                      onCheckedChange={(checked) => updateNotificationType('achievement', checked)}
                    />
                    <Label htmlFor="achievement-notifications">Réalisations</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="system">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="system-notifications-tab"
                    checked={notificationTypes.system}
                    onCheckedChange={(checked) => updateNotificationType('system', checked)}
                  />
                  <Label htmlFor="system-notifications-tab">Système</Label>
                </div>
              </TabsContent>
              
              <TabsContent value="content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emotion-notifications-tab"
                      checked={notificationTypes.emotion}
                      onCheckedChange={(checked) => updateNotificationType('emotion', checked)}
                    />
                    <Label htmlFor="emotion-notifications-tab">Émotions</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="journal-notifications-tab"
                      checked={notificationTypes.journal}
                      onCheckedChange={(checked) => updateNotificationType('journal', checked)}
                    />
                    <Label htmlFor="journal-notifications-tab">Journal</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Heures de silence */}
      {notificationsEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Heures de silence</span>
            </CardTitle>
            <CardDescription>
              Définissez une période pendant laquelle vous ne recevrez pas de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours-enabled" className="font-medium">
                  Activer les heures de silence
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pause automatique des notifications pendant les heures spécifiées
                </p>
              </div>
              <Switch
                id="quiet-hours-enabled"
                checked={quietHoursEnabled}
                onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
              />
            </div>
            
            {quietHoursEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <Label htmlFor="quiet-hours-start">Début</Label>
                  <TimePickerInput
                    id="quiet-hours-start"
                    value={quietHoursStart}
                    onChange={(value) => updateQuietHours('start', value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quiet-hours-end">Fin</Label>
                  <TimePickerInput
                    id="quiet-hours-end"
                    value={quietHoursEnd}
                    onChange={(value) => updateQuietHours('end', value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationPreferences;
