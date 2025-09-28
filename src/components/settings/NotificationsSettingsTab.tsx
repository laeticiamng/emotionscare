import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Heart,
  TrendingUp,
  Calendar,
  Users,
  Zap,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

const NotificationsSettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: '22:00',
    end: '08:00'
  });

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'wellness',
      title: 'Rappels bien-être',
      description: 'Méditation, exercices de respiration, pauses',
      icon: Heart,
      enabled: true,
      email: false,
      push: true,
      frequency: 'daily'
    },
    {
      id: 'progress',
      title: 'Suivi des progrès',
      description: 'Résumés hebdomadaires, objectifs atteints',
      icon: TrendingUp,
      enabled: true,
      email: true,
      push: true,
      frequency: 'weekly'
    },
    {
      id: 'sessions',
      title: 'Sessions et rendez-vous',
      description: 'Rappels de séances, confirmations',
      icon: Calendar,
      enabled: true,
      email: true,
      push: true,
      frequency: 'immediate'
    },
    {
      id: 'social',
      title: 'Activité sociale',
      description: 'Messages, invitations de groupe, mentions',
      icon: Users,
      enabled: true,
      email: false,
      push: true,
      frequency: 'immediate'
    },
    {
      id: 'emergency',
      title: 'Alertes d\'urgence',
      description: 'Détection de stress élevé, aide immédiate',
      icon: Zap,
      enabled: true,
      email: true,
      push: true,
      frequency: 'immediate'
    }
  ]);

  const updateCategory = (id: string, field: keyof NotificationCategory, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const testNotification = () => {
    toast({
      title: "Notification de test envoyée",
      description: "Vérifiez vos paramètres de navigateur pour les notifications push."
    });
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };

  return (
    <div className="space-y-6">
      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Paramètres généraux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                {globalNotifications ? (
                  <Volume2 className="h-4 w-4 text-green-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
                Toutes les notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Active ou désactive toutes les notifications de l'application
              </p>
            </div>
            <Switch
              checked={globalNotifications}
              onCheckedChange={setGlobalNotifications}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heures de silence
              </Label>
              <Switch
                checked={quietHours.enabled}
                onCheckedChange={(checked) => setQuietHours({...quietHours, enabled: checked})}
              />
            </div>
            
            {quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div className="space-y-1">
                  <Label className="text-xs">Début</Label>
                  <Select value={quietHours.start} onValueChange={(value) => setQuietHours({...quietHours, start: value})}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 24}, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fin</Label>
                  <Select value={quietHours.end} onValueChange={(value) => setQuietHours({...quietHours, end: value})}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 24}, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Button onClick={testNotification} variant="outline" className="w-full">
            Tester les notifications
          </Button>
        </CardContent>
      </Card>

      {/* Catégories de notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Types de notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.title}</span>
                        {category.id === 'emergency' && (
                          <Badge variant="destructive" className="text-xs">
                            Critique
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={category.enabled}
                    onCheckedChange={(checked) => updateCategory(category.id, 'enabled', checked)}
                  />
                </div>

                {category.enabled && (
                  <div className="ml-8 space-y-3">
                    {/* Canaux de notification */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm">Email</Label>
                        <Switch
                          checked={category.email}
                          onCheckedChange={(checked) => updateCategory(category.id, 'email', checked)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm">Push</Label>
                        <Switch
                          checked={category.push}
                          onCheckedChange={(checked) => updateCategory(category.id, 'push', checked)}
                        />
                      </div>
                    </div>

                    {/* Fréquence */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm w-16">Fréquence</Label>
                      <Select 
                        value={category.frequency} 
                        onValueChange={(value) => updateCategory(category.id, 'frequency', value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immédiate</SelectItem>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="never">Jamais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Paramètres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notifications de chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Messages directs</Label>
              <p className="text-sm text-muted-foreground">
                Notifications pour les messages privés
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mentions dans les groupes</Label>
              <p className="text-sm text-muted-foreground">
                Quand quelqu'un vous mentionne dans un groupe
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Aperçu des messages</Label>
              <p className="text-sm text-muted-foreground">
                Afficher le contenu du message dans la notification
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarder */}
      <Button onClick={saveSettings} className="w-full">
        Sauvegarder les paramètres
      </Button>
    </div>
  );
};

export default NotificationsSettingsTab;