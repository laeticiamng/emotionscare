import React, {} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, AlertCircle } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NotificationSettings: React.FC = () => {
  const {
    permission,
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  const handleTestNotification = async () => {
    await sendTestNotification();
  };

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return (
          <Badge variant="default" className="gap-1">
            <Check className="h-3 w-3" />
            Activées
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="h-3 w-3" />
            Refusées
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Non configurées
          </Badge>
        );
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Votre navigateur ne supporte pas les notifications push. 
          Veuillez utiliser Chrome, Firefox, Edge ou Safari récents.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications Push Navigateur
            </CardTitle>
            <CardDescription>
              Recevez des alertes instantanées pour les événements critiques
            </CardDescription>
          </div>
          {getPermissionBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === 'default' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Activez les notifications pour être alerté en temps réel des événements importants 
              (tests A/B significatifs, alertes critiques, tickets créés).
            </AlertDescription>
          </Alert>
        )}

        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Les notifications ont été refusées. Pour les activer :
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Cliquez sur l'icône 🔒 ou ⓘ dans la barre d'adresse</li>
                <li>Cherchez "Notifications" dans les paramètres du site</li>
                <li>Changez de "Bloquer" à "Autoriser"</li>
                <li>Rechargez la page</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-push" className="text-base">
                Activer les notifications push
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevez des alertes même lorsque le navigateur est en arrière-plan
              </p>
            </div>
            <Switch
              id="enable-push"
              checked={isSubscribed}
              onCheckedChange={handleToggleNotifications}
              disabled={permission === 'denied'}
            />
          </div>

          {permission === 'granted' && (
            <>
              <div className="pt-4 border-t space-y-3">
                <Label className="text-sm font-semibold">Événements notifiés :</Label>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span>Tests A/B atteignant la significativité statistique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">🚨</span>
                    <span>Alertes critiques détectées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">🎫</span>
                    <span>Tickets créés automatiquement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Escalades de niveau élevé</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleTestNotification} variant="outline" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Envoyer une notification de test
                </Button>
              </div>

              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  {isSubscribed 
                    ? '✅ Vous êtes abonné aux notifications en temps réel'
                    : '⏳ Configuration des notifications en cours...'}
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Les notifications fonctionnent même quand l'onglet est fermé. 
            Vous pouvez les désactiver à tout moment en changeant le paramètre ci-dessus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
