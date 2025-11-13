// @ts-nocheck
/**
 * PushNotificationSetup - Configuration des notifications push
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, X, Zap } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const PushNotificationSetup: React.FC = () => {
  const {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Non Supportées
          </CardTitle>
          <CardDescription>
            Votre navigateur ne supporte pas les notifications push
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const permissionBadge = {
    granted: { variant: 'default' as const, icon: Check, text: 'Autorisé' },
    denied: { variant: 'destructive' as const, icon: X, text: 'Refusé' },
    default: { variant: 'secondary' as const, icon: Bell, text: 'Non demandé' }
  }[permission];

  const PermissionIcon = permissionBadge.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications Push
        </CardTitle>
        <CardDescription>
          Recevez des alertes instantanées pour vos parcours Journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Statut des notifications</p>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? 'Actives et fonctionnelles' : 'Non configurées'}
            </p>
          </div>
          <Badge variant={permissionBadge.variant} className="gap-1">
            <PermissionIcon className="h-3 w-3" />
            {permissionBadge.text}
          </Badge>
        </div>

        {/* Fonctionnalités */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Ce que vous recevrez :</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Notifications quand un track Journey est généré</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Alertes personnalisées selon l'émotion cible</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Rappels pour continuer votre parcours</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Sons adaptatifs selon votre état émotionnel</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isSubscribed ? (
            <Button onClick={subscribe} size="lg" className="w-full">
              <Bell className="h-5 w-5 mr-2" />
              Activer les Notifications
            </Button>
          ) : (
            <>
              <Button onClick={sendTestNotification} variant="outline" size="lg" className="w-full">
                <Zap className="h-5 w-5 mr-2" />
                Envoyer une Notification Test
              </Button>
              <Button onClick={unsubscribe} variant="destructive" size="lg" className="w-full">
                <BellOff className="h-5 w-5 mr-2" />
                Désactiver les Notifications
              </Button>
            </>
          )}
        </div>

        {permission === 'denied' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium mb-1">
              Notifications bloquées
            </p>
            <p className="text-xs text-muted-foreground">
              Vous devez autoriser les notifications dans les paramètres de votre navigateur
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
