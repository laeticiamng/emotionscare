// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { usePush } from '@/hooks/usePush';
import { useNotifyStore } from '@/store/notify.store';

export const TestPushButton: React.FC = () => {
  const { hasPermission, loading, testPush } = usePush();
  const { prefs } = useNotifyStore();
  const isOnline = navigator.onLine;

  const handleTest = async () => {
    await testPush();

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'notify.test.sent');
    }
  };

  const canTest = (hasPermission || prefs.email) && isOnline;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={handleTest}
        disabled={!canTest || loading}
        className="w-full flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer un test
          </>
        )}
      </Button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {isOnline ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        
        <span>
          {!isOnline 
            ? "Hors-ligne - connectez-vous pour tester"
            : !hasPermission && !prefs.email 
            ? "Activez d'abord les notifications"
            : "Test disponible"
          }
        </span>
      </div>
    </div>
  );
};