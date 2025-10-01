// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { usePush } from '@/hooks/usePush';
import { useNotifyStore } from '@/store/notify.store';

interface NotifyOptinProps {
  onOptIn?: () => void;
  compact?: boolean;
}

export const NotifyOptin: React.FC<NotifyOptinProps> = ({ onOptIn, compact = false }) => {
  const { supported, hasPermission, loading, subscribe } = usePush();
  const { prefs } = useNotifyStore();

  const handleEnable = async () => {
    if (supported) {
      const success = await subscribe();
      if (success && onOptIn) {
        onOptIn();
      }
    } else {
      // Fallback to email notifications
      if (onOptIn) {
        onOptIn();
      }
    }

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.optin.accepted');
    }
  };

  const handleDecline = () => {
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.optin.declined');
    }
    
    if (onOptIn) {
      onOptIn();
    }
  };

  // Don't show if already opted in
  if (hasPermission || prefs.email) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <Bell className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Restez motivé·e</p>
          <p className="text-xs text-muted-foreground">Recevez des rappels personnalisés</p>
        </div>
        <Button 
          size="sm" 
          onClick={handleEnable}
          disabled={loading}
          className="flex-shrink-0"
        >
          {loading ? 'Activation...' : 'Activer'}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Notifications & rappels</CardTitle>
            <CardDescription>
              Restez motivé·e avec des rappels personnalisés au bon moment
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>Rappels pour vos défis et micro-pauses</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span>Respect de vos heures calmes (22:00-07:00)</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Bell className="w-4 h-4 text-primary" />
            <span>Actions rapides : Lancer / Snooze 10 min</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex gap-2">
            <Button 
              onClick={handleEnable}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Activation...' : 'Activer les notifications'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDecline}
              disabled={loading}
            >
              Plus tard
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {supported 
              ? "Notifications push + e-mail de secours" 
              : "Notifications par e-mail uniquement"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};