import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { usePush } from '@/hooks/usePush';
import { useNotifyStore } from '@/store/notify.store';

export const ChannelToggles: React.FC = () => {
  const { supported, hasPermission, subscribe, unsubscribe } = usePush();
  const { prefs, setPrefs } = useNotifyStore();

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const success = await subscribe();
      if (success) {
        setPrefs({ push: true });
      }
    } else {
      const success = await unsubscribe();
      if (success) {
        setPrefs({ push: false });
      }
    }

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.prefs.updated', {
        push: enabled
      });
    }
  };

  const handleEmailToggle = (enabled: boolean) => {
    setPrefs({ email: enabled });

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.prefs.updated', {
        email: enabled
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Canaux de notification
        </h3>
        
        <div className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label htmlFor="push-toggle" className="text-sm font-medium">
                  Notifications push
                </Label>
                <p className="text-xs text-muted-foreground">
                  {supported 
                    ? "Notifications instantanées sur cet appareil" 
                    : "Non supporté par votre navigateur"
                  }
                </p>
              </div>
            </div>
            
            <Switch
              id="push-toggle"
              role="switch"
              aria-checked={prefs.push && hasPermission}
              checked={prefs.push && hasPermission}
              onCheckedChange={handlePushToggle}
              disabled={!supported}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label htmlFor="email-toggle" className="text-sm font-medium">
                  Notifications par e-mail
                </Label>
                <p className="text-xs text-muted-foreground">
                  Fallback si les notifications push échouent
                </p>
              </div>
            </div>
            
            <Switch
              id="email-toggle"
              role="switch"
              aria-checked={prefs.email}
              checked={prefs.email}
              onCheckedChange={handleEmailToggle}
            />
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Statut :</strong> {
            prefs.push && hasPermission ? "Notifications push actives" :
            prefs.email ? "E-mail de secours activé" :
            "Aucune notification activée"
          }
        </p>
      </div>
    </div>
  );
};