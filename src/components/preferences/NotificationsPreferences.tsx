
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NotificationSetting {
  label: string;
  key: string;
  description?: string;
}

interface NotificationsPreferencesProps {
  notifications: {
    system?: boolean;
    emotion?: boolean;
    badge?: boolean;
    challenge?: boolean;
    message?: boolean;
    update?: boolean;
    mention?: boolean;
    team?: boolean;
    report?: boolean;
    reminder?: boolean;
    activity?: boolean;
    comment?: boolean;
    reaction?: boolean;
    friend?: boolean;
    coach?: boolean;
    community?: boolean;
    achievement?: boolean; // Added this property to match usage
  };
  onChange: (key: string, value: boolean) => void;
}

export const NotificationsPreferences: React.FC<NotificationsPreferencesProps> = ({ 
  notifications, 
  onChange 
}) => {
  const notificationSettings: NotificationSetting[] = [
    { label: 'Système', key: 'system', description: 'Informations importantes et mises à jour de la plateforme' },
    { label: 'Émotions', key: 'emotion', description: 'Rapports et analyses liés à vos émotions' },
    { label: 'Badges', key: 'badge', description: 'Quand vous gagnez de nouveaux badges' },
    { label: 'Récompenses', key: 'achievement', description: 'Quand vous atteignez de nouveaux objectifs' },
    { label: 'Défis', key: 'challenge', description: 'Nouveau défis disponibles et complétés' },
    { label: 'Messages', key: 'message', description: 'Nouveaux messages privés reçus' },
    { label: 'Mises à jour', key: 'update', description: 'Nouvelles fonctionnalités et améliorations' },
    { label: 'Mentions', key: 'mention', description: 'Quand quelqu\'un vous mentionne' },
    { label: 'Équipe', key: 'team', description: 'Activités et mises à jour de votre équipe' },
    { label: 'Rapports', key: 'report', description: 'Rapports hebdomadaires et mensuels' },
    { label: 'Rappels', key: 'reminder', description: 'Rappels quotidiens et programmés' },
    { label: 'Activités', key: 'activity', description: 'Résumés de vos activités' },
    { label: 'Commentaires', key: 'comment', description: 'Réponses à vos publications' },
    { label: 'Réactions', key: 'reaction', description: 'Likes et réactions à vos contenus' },
    { label: 'Amis', key: 'friend', description: 'Demandes d\'amitié et connexions' },
    { label: 'Coach', key: 'coach', description: 'Conseils et suggestions de votre coach' },
    { label: 'Communauté', key: 'community', description: 'Nouveaux événements et activités de groupe' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
        <CardDescription>
          Contrôlez quelles notifications vous souhaitez recevoir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`notification-${setting.key}`} className="font-medium">
                    {setting.label}
                  </Label>
                  {setting.description && (
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  )}
                </div>
                <Switch
                  id={`notification-${setting.key}`}
                  checked={notifications[setting.key as keyof typeof notifications] || false}
                  onCheckedChange={(checked) => onChange(setting.key, checked)}
                />
              </div>
              {index < notificationSettings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPreferences;
