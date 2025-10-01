// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bluetooth, BluetoothConnected, Heart, HelpCircle } from 'lucide-react';
import { useHeartRate } from '@/hooks/useHeartRate';

interface HRConnectButtonProps {
  className?: string;
  variant?: 'button' | 'card';
}

const HRConnectButton: React.FC<HRConnectButtonProps> = ({ 
  className = '', 
  variant = 'button' 
}) => {
  const { 
    connected, 
    connecting, 
    isSupported, 
    error, 
    connect, 
    disconnect,
    checkSupport 
  } = useHeartRate();

  // Handle connection toggle
  const handleToggle = async () => {
    if (connected) {
      await disconnect();
    } else {
      if (!checkSupport()) {
        return;
      }
      await connect();
    }
  };

  // Not supported fallback
  if (!isSupported) {
    return (
      <div className={`hr-connect-not-supported ${className}`}>
        {variant === 'card' ? (
          <Card className="border-muted-foreground/20">
            <CardContent className="p-4 text-center">
              <div className="text-muted-foreground mb-2">
                <Bluetooth className="h-8 w-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Bluetooth non supporté sur cet appareil
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Le mode démo sera utilisé automatiquement
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button variant="outline" disabled className="cursor-not-allowed">
            <Bluetooth className="h-4 w-4 mr-2 opacity-50" />
            Non supporté
          </Button>
        )}
      </div>
    );
  }

  const ConnectContent = () => (
    <>
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          {connected ? (
            <BluetoothConnected className="h-5 w-5 text-blue-600" />
          ) : (
            <Bluetooth className="h-5 w-5" />
          )}
          <Heart className={`h-4 w-4 ${connected ? 'text-red-500 animate-pulse' : ''}`} />
        </div>
        
        <div className="text-left flex-1">
          <div className="font-medium">
            {connected ? 'Capteur connecté' : 'Connecter un capteur cardiaque'}
          </div>
          {connected && (
            <div className="text-xs text-muted-foreground">
              Réception des données en temps réel
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button 
          onClick={handleToggle}
          disabled={connecting}
          size="sm"
          variant={connected ? "outline" : "default"}
          className="flex-1"
          aria-label={connected ? "Déconnecter le capteur cardiaque" : "Connecter un capteur cardiaque"}
        >
          {connecting ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Connexion...
            </>
          ) : connected ? (
            'Déconnecter'
          ) : (
            'Connecter'
          )}
        </Button>
        
        {!connected && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              // Open help modal or link
              window.open('https://example.com/help/heart-rate', '_blank');
            }}
            aria-label="Aide pour la connexion du capteur"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );

  if (variant === 'card') {
    return (
      <div className={`hr-connect-card ${className}`}>
        <Card className={connected ? 'border-blue-200 bg-blue-50/30' : ''}>
          <CardContent className="p-4">
            <ConnectContent />
            
            {error && (
              <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`hr-connect-button ${className}`}>
      <Button 
        onClick={handleToggle}
        disabled={connecting}
        variant={connected ? "outline" : "default"}
        size="lg"
        aria-label={connected ? "Capteur cardiaque connecté - cliquer pour déconnecter" : "Connecter un capteur cardiaque"}
        aria-describedby={error ? "hr-error" : undefined}
      >
        {connecting ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connexion...
          </>
        ) : connected ? (
          <>
            <BluetoothConnected className="h-4 w-4 mr-2 text-blue-600" />
            <Heart className="h-4 w-4 mr-2 text-red-500 animate-pulse" />
            Capteur connecté
          </>
        ) : (
          <>
            <Bluetooth className="h-4 w-4 mr-2" />
            <Heart className="h-4 w-4 mr-2" />
            Connecter un capteur cardiaque
          </>
        )}
      </Button>
      
      {error && (
        <div 
          id="hr-error"
          className="mt-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default HRConnectButton;