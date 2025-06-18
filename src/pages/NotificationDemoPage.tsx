
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import NotificationPermissionDialog from '@/components/notifications/NotificationPermissionDialog';
import { Bell, Award, Calendar, Heart, Info, AlertTriangle } from 'lucide-react';

const NotificationDemoPage: React.FC = () => {
  const { sendNotification } = useNotifications();
  const { 
    permission, 
    showPermissionDialog, 
    setShowPermissionDialog, 
    requestPermission,
    isSupported 
  } = usePushNotifications();

  const handleSendDemo = async (type: string) => {
    switch (type) {
      case 'welcome':
        await sendNotification({
          type: 'system',
          priority: 'medium',
          title: 'Bienvenue sur EmotionsCare',
          message: 'Commencez votre parcours de bien-être émotionnel.',
          actionUrl: '/scan',
          actionText: 'Faire un scan'
        });
        break;
      
      case 'achievement':
        await sendNotification({
          type: 'achievement',
          priority: 'medium',
          title: 'Nouveau badge débloqué !',
          message: 'Félicitations ! Vous avez obtenu le badge "Premier scan".',
          actionUrl: '/gamification',
          actionText: 'Voir mes badges'
        });
        break;
      
      case 'reminder':
        await sendNotification({
          type: 'reminder',
          priority: 'low',
          title: 'Rappel quotidien',
          message: 'Il est temps de faire votre scan émotionnel quotidien.',
          actionUrl: '/scan',
          actionText: 'Commencer'
        });
        break;
      
      case 'emotion':
        await sendNotification({
          type: 'emotion',
          priority: 'medium',
          title: 'Analyse émotionnelle disponible',
          message: 'Votre rapport hebdomadaire est prêt à consulter.',
          actionUrl: '/journal',
          actionText: 'Voir le rapport'
        });
        break;
      
      case 'urgent':
        await sendNotification({
          type: 'urgent',
          priority: 'high',
          title: 'Attention requise',
          message: 'Votre niveau de stress semble élevé. Prenez un moment pour vous.',
          actionUrl: '/music',
          actionText: 'Se relaxer'
        });
        break;
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500">Autorisées</Badge>;
      case 'denied':
        return <Badge variant="destructive">Refusées</Badge>;
      default:
        return <Badge variant="secondary">Non demandées</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Système de Notifications</h1>
        <p className="text-muted-foreground">
          Testez et configurez les différents types de notifications
        </p>
      </div>

      {/* Statut des notifications push */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Push
          </CardTitle>
          <CardDescription>
            Configurez les notifications push de votre navigateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Support navigateur</p>
              <p className="text-sm text-muted-foreground">
                {isSupported ? 'Supporté' : 'Non supporté'}
              </p>
            </div>
            <Badge variant={isSupported ? 'default' : 'secondary'}>
              {isSupported ? 'Oui' : 'Non'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Statut des permissions</p>
              <p className="text-sm text-muted-foreground">
                Autorisation pour les notifications push
              </p>
            </div>
            {getPermissionBadge()}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowPermissionDialog(true)}
              disabled={!isSupported}
            >
              Configurer les notifications
            </Button>
            {permission === 'default' && (
              <Button
                variant="outline"
                onClick={requestPermission}
                disabled={!isSupported}
              >
                Demander l'autorisation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Démonstration des types de notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Types de notifications</CardTitle>
          <CardDescription>
            Cliquez sur les boutons pour tester les différents types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleSendDemo('welcome')}
            >
              <Info className="h-6 w-6 text-blue-500" />
              <span className="font-medium">Système</span>
              <span className="text-xs text-muted-foreground">Message de bienvenue</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleSendDemo('achievement')}
            >
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">Réussite</span>
              <span className="text-xs text-muted-foreground">Nouveau badge</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleSendDemo('reminder')}
            >
              <Calendar className="h-6 w-6 text-green-500" />
              <span className="font-medium">Rappel</span>
              <span className="text-xs text-muted-foreground">Scan quotidien</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleSendDemo('emotion')}
            >
              <Heart className="h-6 w-6 text-purple-500" />
              <span className="font-medium">Émotion</span>
              <span className="text-xs text-muted-foreground">Analyse disponible</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleSendDemo('urgent')}
            >
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <span className="font-medium">Urgent</span>
              <span className="text-xs text-muted-foreground">Attention requise</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <NotificationPermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onPermissionGranted={() => {
          console.log('Notifications push activées avec succès');
        }}
      />
    </div>
  );
};

export default NotificationDemoPage;
