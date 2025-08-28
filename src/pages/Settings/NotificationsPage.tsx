import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import { NotifyOptin } from '@/components/notify/NotifyOptin';
import { ChannelToggles } from '@/components/notify/ChannelToggles';
import { TestPushButton } from '@/components/notify/TestPushButton';
import { useNotifyStore } from '@/store/notify.store';

const NotificationsPage: React.FC = () => {
  const { prefs } = useNotifyStore();

  // Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.optin.view');
    }
  }, []);

  const hasNotifications = prefs.push || prefs.email;

  return (
    <div className="container mx-auto max-w-2xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Notifications & rappels</h1>
        <p className="text-muted-foreground">
          Configurez vos notifications pour rester motivé·e au bon moment.
        </p>
      </div>

      {/* Opt-in section */}
      {!hasNotifications && (
        <>
          <NotifyOptin />
          <Separator />
        </>
      )}

      {/* Configuration */}
      {hasNotifications && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notifications
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ChannelToggles />
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Test</h4>
              <TestPushButton />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiet Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Heures calmes</CardTitle>
          <CardDescription>
            Aucune notification ne sera envoyée pendant ces créneaux
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">22:00 - 07:00</p>
              <p className="text-sm text-muted-foreground">
                Fuseau horaire : {prefs.tz}
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Par défaut
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <h4 className="font-medium flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              À savoir
            </h4>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• Les notifications respectent vos heures calmes</li>
              <li>• Actions rapides : Lancer le module / Snooze 10 min</li>
              <li>• E-mail de secours si les notifications push échouent</li>
              <li>• Vous pouvez vous désabonner à tout moment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;