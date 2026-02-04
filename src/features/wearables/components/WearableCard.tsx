/**
 * WearableCard - Carte d'affichage d'un appareil connecté
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, BluetoothOff, Battery, Activity, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { wearablesUtils } from '../index';

export interface WearableDevice {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
  lastSync?: Date;
  batteryLevel?: number;
  metrics?: {
    heartRate?: number;
    steps?: number;
    calories?: number;
  };
}

interface WearableCardProps {
  device: WearableDevice;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  className?: string;
}

export const WearableCard = memo(function WearableCard({
  device,
  onConnect,
  onDisconnect,
  onSync,
  className
}: WearableCardProps) {
  const providerIcon = wearablesUtils.getProviderIcon(device.provider);
  const providerColor = wearablesUtils.getProviderColor(device.provider);

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              className="text-2xl p-2 rounded-lg"
              style={{ backgroundColor: `${providerColor}20` }}
              role="img"
              aria-label={`${device.provider} icon`}
            >
              {providerIcon}
            </span>
            <div>
              <CardTitle className="text-base">{device.name}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">
                {device.provider.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Badge 
            variant={device.connected ? 'default' : 'secondary'}
            className={cn(
              device.connected ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''
            )}
          >
            {device.connected ? (
              <><Bluetooth className="w-3 h-3 mr-1" aria-hidden="true" /> Connecté</>
            ) : (
              <><BluetoothOff className="w-3 h-3 mr-1" aria-hidden="true" /> Déconnecté</>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {device.connected && device.metrics && (
          <div className="grid grid-cols-3 gap-2">
            {device.metrics.heartRate && (
              <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                <Heart className="w-4 h-4 text-red-500 mb-1" aria-hidden="true" />
                <span className="text-sm font-medium">{device.metrics.heartRate}</span>
                <span className="text-[10px] text-muted-foreground">BPM</span>
              </div>
            )}
            {device.metrics.steps && (
              <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Activity className="w-4 h-4 text-blue-500 mb-1" aria-hidden="true" />
                <span className="text-sm font-medium">{device.metrics.steps.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">Pas</span>
              </div>
            )}
            {device.metrics.calories && (
              <div className="flex flex-col items-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <span className="text-lg mb-1" role="img" aria-label="calories">🔥</span>
                <span className="text-sm font-medium">{device.metrics.calories}</span>
                <span className="text-[10px] text-muted-foreground">kcal</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {device.batteryLevel !== undefined && (
              <span className="flex items-center gap-1">
                <Battery 
                  className={cn(
                    "w-3 h-3",
                    device.batteryLevel > 50 ? 'text-green-500' : 
                    device.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                  )} 
                  aria-hidden="true"
                />
                {device.batteryLevel}%
              </span>
            )}
            {device.lastSync && (
              <span>
                Sync: {new Date(device.lastSync).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {device.connected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSync}
                  aria-label="Synchroniser l'appareil"
                >
                  Sync
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onDisconnect}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Déconnecter l'appareil"
                >
                  Déconnecter
                </Button>
              </>
            ) : (
              <Button 
                size="sm"
                onClick={onConnect}
                aria-label={`Connecter ${device.name}`}
              >
                Connecter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default WearableCard;
