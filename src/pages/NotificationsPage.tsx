
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Heart, 
  Brain, 
  Music, 
  MessageCircle, 
  Trophy,
  Clock,
  Settings,
  Check,
  X,
  Volume2,
  Smartphone,
  Mail
} from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'wellness',
      icon: <Heart className="h-5 w-5" />,
      title: 'Session de méditation recommandée',
      message: 'Votre niveau de stress semble élevé. Une session de 10 minutes pourrait vous aider.',
      time: 'Il y a 5 minutes',
      unread: true,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      type: 'achievement',
      icon: <Trophy className="h-5 w-5" />,
      title: 'Nouveau badge obtenu !',
      message: 'Félicitations ! Vous avez complété 7 jours consécutifs de bien-être.',
      time: 'Il y a 2 heures',
      unread: true,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      type: 'music',
      icon: <Music className="h-5 w-5" />,
      title: 'Nouvelle playlist disponible',
      message: 'Une playlist "Focus matinal" a été créée spécialement pour vous.',
      time: 'Il y a 1 jour',
      unread: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      type: 'emotion',
      icon: <Brain className="h-5 w-5" />,
      title: 'Analyse émotionnelle complète',
      message: 'Votre rapport hebdomadaire est prêt. Découvrez vos tendances émotionnelles.',
      time: 'Il y a 2 jours',
      unread: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 5,
      type: 'coach',
      icon: <MessageCircle className="h-5 w-5" />,
      title: 'Message de votre coach IA',
      message: 'Bonjour ! Comment vous sentez-vous aujourd\'hui ? Parlons de vos objectifs.',
      time: 'Il y a 3 jours',
      unread: false,
      color: 'from-green-500 to-emerald-500'
    }
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    wellnessReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    coachMessages: true,
    emergencyAlerts: true
  });

  const handleNotificationRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleNotificationDelete = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4" data-testid="page-root">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="h-8 w-8 text-blue-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                  Notifications
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Gérez vos alertes et préférences de notifications
                </p>
              </div>
            </div>
            <Button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Tout marquer comme lu</span>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des notifications */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Notifications récentes</span>
                    <Badge variant="outline">{notifications.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.unread 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500' 
                            : 'bg-slate-50 dark:bg-slate-800 border-l-slate-300'
                        } transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full bg-gradient-to-r ${notification.color} text-white`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-slate-800 dark:text-white">
                                  {notification.title}
                                </h3>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>{notification.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {notification.unread && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleNotificationRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleNotificationDelete(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Paramètres de notifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Paramètres généraux */}
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                        Général
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4 text-slate-500" />
                            <Label htmlFor="push">Notifications push</Label>
                          </div>
                          <Switch
                            id="push"
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <Label htmlFor="email">Notifications email</Label>
                          </div>
                          <Switch
                            id="email"
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="h-4 w-4 text-slate-500" />
                            <Label htmlFor="sound">Sons activés</Label>
                          </div>
                          <Switch
                            id="sound"
                            checked={settings.soundEnabled}
                            onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Types de notifications */}
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                        Types de notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            <Label htmlFor="wellness">Rappels bien-être</Label>
                          </div>
                          <Switch
                            id="wellness"
                            checked={settings.wellnessReminders}
                            onCheckedChange={(checked) => handleSettingChange('wellnessReminders', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <Label htmlFor="achievements">Récompenses</Label>
                          </div>
                          <Switch
                            id="achievements"
                            checked={settings.achievementAlerts}
                            onCheckedChange={(checked) => handleSettingChange('achievementAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-blue-500" />
                            <Label htmlFor="reports">Rapports hebdomadaires</Label>
                          </div>
                          <Switch
                            id="reports"
                            checked={settings.weeklyReports}
                            onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                            <Label htmlFor="coach">Messages du coach</Label>
                          </div>
                          <Switch
                            id="coach"
                            checked={settings.coachMessages}
                            onCheckedChange={(checked) => handleSettingChange('coachMessages', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Urgence */}
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                        Urgence
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-red-500" />
                          <Label htmlFor="emergency">Alertes d'urgence</Label>
                        </div>
                        <Switch
                          id="emergency"
                          checked={settings.emergencyAlerts}
                          onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Notifications critiques pour votre bien-être
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
