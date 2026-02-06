import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Sparkles, Check, Clock, AlertCircle, Heart, Music, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'insight' | 'encouragement' | 'alert';
  priority: 'low' | 'medium' | 'high';
  suggested_time: string;
  action: string;
  status: 'pending' | 'read' | 'dismissed';
  created_at: string;
  read_at?: string;
}

interface NotificationPreferences {
  enable_notifications: boolean;
  enable_morning_reminders: boolean;
  enable_evening_check_ins: boolean;
  enable_ai_insights: boolean;
  enable_streak_reminders: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  preferred_times: string[];
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enable_notifications: true,
    enable_morning_reminders: true,
    enable_evening_check_ins: true,
    enable_ai_insights: true,
    enable_streak_reminders: true,
    preferred_times: ['morning', 'evening']
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-notifications', {
        body: { action: 'get_notifications' }
      });

      if (error) throw error;
      setNotifications(data.notifications || []);
    } catch (error) {
      logger.error('Erreur chargement notifications:', error as Error, 'UI');
    }
  };

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setPreferences(data);
      }
    } catch (error) {
      logger.error('Erreur chargement préférences:', error as Error, 'UI');
    }
  };

  const generateSuggestions = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-notifications', {
        body: { 
          action: 'generate_suggestions',
          preferences 
        }
      });

      if (error) throw error;

      toast.success(`${data.notifications?.length || 0} nouvelles notifications générées ! 🎉`);
      await loadNotifications();
    } catch (error: unknown) {
      logger.error('Erreur génération', error instanceof Error ? error : new Error(String(error)), 'UI');
      toast.error('Erreur lors de la génération des notifications');
    } finally {
      setGenerating(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.functions.invoke('smart-notifications', {
        body: { 
          action: 'mark_read',
          notificationId 
        }
      });

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
      );
    } catch (error) {
      logger.error('Erreur marquage lu:', error as Error, 'UI');
    }
  };

  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    try {
      await supabase.functions.invoke('smart-notifications', {
        body: { 
          action: 'update_preferences',
          preferences: updated
        }
      });

      toast.success('Préférences mises à jour');
    } catch (error) {
      logger.error('Erreur mise à jour préférences:', error as Error, 'UI');
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'insight': return <Brain className="h-4 w-4" />;
      case 'encouragement': return <Heart className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Centre de Notifications
              </CardTitle>
              <CardDescription>
                Notifications intelligentes personnalisées par IA
              </CardDescription>
            </div>
            <Button
              onClick={generateSuggestions}
              disabled={generating}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? 'Génération...' : 'Générer suggestions IA'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune notification pour le moment</p>
                <Button onClick={generateSuggestions} className="mt-4">
                  Générer des suggestions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={notification.status === 'pending' ? 'border-primary' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge variant={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {notification.status === 'pending' && (
                            <Badge variant="outline">Nouveau</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📅 {notification.suggested_time}</span>
                          <span>🎯 Action: {notification.action}</span>
                          <span>⏰ {new Date(notification.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {notification.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Personnalisez vos notifications et rappels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-notifs" className="flex flex-col gap-1">
                  <span>Activer les notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Recevoir des notifications de l'application
                  </span>
                </Label>
                <Switch
                  id="enable-notifs"
                  checked={preferences.enable_notifications}
                  onCheckedChange={(checked) => 
                    updatePreferences({ enable_notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="morning" className="flex flex-col gap-1">
                  <span>Rappels matinaux</span>
                  <span className="text-sm text-muted-foreground">
                    Check-in émotionnel quotidien
                  </span>
                </Label>
                <Switch
                  id="morning"
                  checked={preferences.enable_morning_reminders}
                  onCheckedChange={(checked) => 
                    updatePreferences({ enable_morning_reminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="evening" className="flex flex-col gap-1">
                  <span>Check-in du soir</span>
                  <span className="text-sm text-muted-foreground">
                    Bilan émotionnel en fin de journée
                  </span>
                </Label>
                <Switch
                  id="evening"
                  checked={preferences.enable_evening_check_ins}
                  onCheckedChange={(checked) => 
                    updatePreferences({ enable_evening_check_ins: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ai-insights" className="flex flex-col gap-1">
                  <span>Insights IA</span>
                  <span className="text-sm text-muted-foreground">
                    Suggestions personnalisées par intelligence artificielle
                  </span>
                </Label>
                <Switch
                  id="ai-insights"
                  checked={preferences.enable_ai_insights}
                  onCheckedChange={(checked) => 
                    updatePreferences({ enable_ai_insights: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="streak" className="flex flex-col gap-1">
                  <span>Rappels de streak</span>
                  <span className="text-sm text-muted-foreground">
                    Notifications pour maintenir votre série quotidienne
                  </span>
                </Label>
                <Switch
                  id="streak"
                  checked={preferences.enable_streak_reminders}
                  onCheckedChange={(checked) => 
                    updatePreferences({ enable_streak_reminders: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{notifications.length}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">En attente</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {notifications.filter(n => n.status === 'read').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Lues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
