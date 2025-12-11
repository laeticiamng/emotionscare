// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
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
  VolumeX,
  BarChart3,
  History,
  CheckCircle2,
  XCircle,
  Settings2,
  Trash2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

interface NotificationHistory {
  id: string;
  title: string;
  category: string;
  channel: 'email' | 'push' | 'in-app';
  status: 'sent' | 'read' | 'dismissed';
  sentAt: string;
  readAt?: string;
}

interface NotificationStats {
  totalSent: number;
  totalRead: number;
  totalDismissed: number;
  byCategory: Record<string, { sent: number; read: number }>;
  byChannel: Record<string, number>;
}

const NotificationsSettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
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

  // Notification history
  const [history, setHistory] = useState<NotificationHistory[]>(() => {
    const saved = localStorage.getItem('notification_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Rappel méditation quotidienne', category: 'wellness', channel: 'push', status: 'read', sentAt: new Date().toISOString(), readAt: new Date().toISOString() },
      { id: '2', title: 'Votre résumé hebdomadaire est prêt', category: 'progress', channel: 'email', status: 'sent', sentAt: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', title: 'Session de coaching dans 1h', category: 'sessions', channel: 'push', status: 'read', sentAt: new Date(Date.now() - 172800000).toISOString() }
    ];
  });

  // Notification stats
  const [stats, setStats] = useState<NotificationStats>(() => {
    const saved = localStorage.getItem('notification_stats');
    return saved ? JSON.parse(saved) : {
      totalSent: 156,
      totalRead: 142,
      totalDismissed: 8,
      byCategory: {
        wellness: { sent: 45, read: 42 },
        progress: { sent: 12, read: 12 },
        sessions: { sent: 28, read: 28 },
        social: { sent: 65, read: 55 },
        emergency: { sent: 6, read: 5 }
      },
      byChannel: {
        push: 98,
        email: 42,
        'in-app': 16
      }
    };
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('notification_history', JSON.stringify(history.slice(-100)));
    localStorage.setItem('notification_stats', JSON.stringify(stats));
  }, [history, stats]);

  const updateCategory = (id: string, field: keyof NotificationCategory, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const testNotification = () => {
    const newNotif: NotificationHistory = {
      id: Date.now().toString(),
      title: 'Notification de test',
      category: 'wellness',
      channel: 'push',
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    setHistory(prev => [...prev, newNotif]);
    setStats(prev => ({
      ...prev,
      totalSent: prev.totalSent + 1,
      byChannel: { ...prev.byChannel, push: (prev.byChannel.push || 0) + 1 }
    }));
    
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

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "Historique effacé",
      description: "L'historique des notifications a été supprimé"
    });
  };

  const exportHistory = () => {
    const data = {
      history,
      stats,
      categories,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const readRate = stats.totalSent > 0 ? Math.round((stats.totalRead / stats.totalSent) * 100) : 0;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings" className="gap-1">
            <Settings2 className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-1">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
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
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
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
                
                <AnimatePresence>
                  {quietHours.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-3 ml-6"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button onClick={testNotification} variant="outline" className="w-full">
                Tester les notifications
              </Button>
            </CardContent>
          </Card>

          {/* Catégories de notifications */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Types de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div 
                    key={category.id} 
                    className="p-4 border rounded-lg space-y-3"
                    whileHover={{ scale: 1.01 }}
                  >
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

                    <AnimatePresence>
                      {category.enabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-8 space-y-3"
                        >
                          {/* Canaux de notification */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm">Email</Label>
                              <Switch
                                checked={category.email}
                                onCheckedChange={(checked) => updateCategory(category.id, 'email', checked)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          {/* Notifications de chat */}
          <Card className="mt-6">
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
                <Switch defaultChecked aria-label="Messages directs" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions dans les groupes</Label>
                  <p className="text-sm text-muted-foreground">
                    Quand quelqu'un vous mentionne dans un groupe
                  </p>
                </div>
                <Switch defaultChecked aria-label="Mentions dans les groupes" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aperçu des messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher le contenu du message dans la notification
                  </p>
                </div>
                <Switch defaultChecked={false} aria-label="Aperçu des messages" />
              </div>
            </CardContent>
          </Card>

          {/* Sauvegarder */}
          <Button onClick={saveSettings} className="w-full mt-6">
            Sauvegarder les paramètres
          </Button>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des notifications
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportHistory}>
                    <Download className="h-4 w-4 mr-1" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Effacer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...history].reverse().map((notif) => {
                      const category = categories.find(c => c.id === notif.category);
                      const Icon = category?.icon || Bell;
                      return (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <Icon className="h-4 w-4 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notif.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {notif.channel}
                              </Badge>
                              {notif.status === 'read' ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : notif.status === 'dismissed' ? (
                                <XCircle className="h-3 w-3 text-red-500" />
                              ) : null}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notif.sentAt)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Bell className="h-4 w-4" />
                  <span className="text-xs">Envoyées</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Lues</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalRead}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <XCircle className="h-4 w-4" />
                  <span className="text-xs">Ignorées</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalDismissed}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Taux de lecture</span>
                </div>
                <p className="text-2xl font-bold">{readRate}%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byCategory).map(([catId, catStats]) => {
                  const category = categories.find(c => c.id === catId);
                  const Icon = category?.icon || Bell;
                  const readPercent = catStats.sent > 0 ? (catStats.read / catStats.sent) * 100 : 0;
                  return (
                    <div key={catId}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{category?.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {catStats.read}/{catStats.sent}
                        </span>
                      </div>
                      <Progress value={readPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Par canal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(stats.byChannel).map(([channel, count]) => {
                  const Icon = channel === 'email' ? Mail : channel === 'push' ? Smartphone : Bell;
                  return (
                    <div key={channel} className="text-center p-4 bg-muted/50 rounded-lg">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground capitalize">{channel}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsSettingsTab;
