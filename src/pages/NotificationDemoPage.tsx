
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationContext } from '@/components/notifications/NotificationProvider';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import { 
  Trophy, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';

const NotificationDemoPage: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const { showToast } = useNotificationContext();

  const demoNotifications = [
    {
      title: '🏆 Nouveau Badge Débloqué !',
      message: 'Vous avez obtenu le badge "Régularité" pour 7 jours consécutifs',
      type: 'success' as const,
      priority: 'medium' as const,
      actionText: 'Voir mes badges',
      actionUrl: '/gamification'
    },
    {
      title: '⏰ Rappel quotidien',
      message: 'Il est temps de faire votre scan émotionnel quotidien',
      type: 'info' as const,
      priority: 'high' as const,
      actionText: 'Commencer le scan',
      actionUrl: '/scan'
    },
    {
      title: '💡 Suggestion du Coach IA',
      message: 'Essayez une séance de méditation de 5 minutes pour réduire votre stress',
      type: 'info' as const,
      priority: 'medium' as const,
      actionText: 'Parler au coach',
      actionUrl: '/coach'
    },
    {
      title: '⚠️ Attention',
      message: 'Votre niveau de stress semble élevé aujourd\'hui. Prenez une pause',
      type: 'warning' as const,
      priority: 'high' as const,
      actionText: 'Voir conseils',
      actionUrl: '/coach'
    },
    {
      title: '👥 Nouvelle activité communautaire',
      message: 'Un nouveau groupe de soutien vient d\'être créé dans votre région',
      type: 'info' as const,
      priority: 'low' as const,
      actionText: 'Rejoindre',
      actionUrl: '/community'
    }
  ];

  const handleDemoNotification = (demo: typeof demoNotifications[0]) => {
    showToast(demo);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Système de Notifications</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez le système complet de notifications push et en temps réel d'EmotionsCare. 
          Testez les différents types de notifications et personnalisez vos préférences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total notifications</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Non lues</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.filter(n => n.read).length}</p>
              <p className="text-sm text-muted-foreground">Lues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Tester les Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Cliquez sur les boutons ci-dessous pour tester différents types de notifications :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoNotifications.map((demo, index) => (
              <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{demo.title}</h4>
                      <Badge variant={
                        demo.type === 'success' ? 'default' :
                        demo.type === 'warning' ? 'destructive' : 'secondary'
                      }>
                        {demo.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{demo.message}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDemoNotification(demo)}
                    >
                      Tester
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Marquer tout comme lu ({unreadCount})
            </Button>
            <Button 
              variant="outline" 
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Effacer toutes les notifications ({notifications.length})
            </Button>
            <Button 
              onClick={() => showToast({
                title: '👋 Bienvenue !',
                message: 'Ceci est une notification de bienvenue personnalisée',
                type: 'success',
                priority: 'medium',
                actionText: 'Découvrir',
                actionUrl: '/dashboard'
              })}
            >
              Notification de bienvenue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <NotificationSettings />
    </div>
  );
};

export default NotificationDemoPage;
