import React, { useEffect } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Heart } from 'lucide-react';
import BubbleBeat from '@/components/hr/BubbleBeat';
import HRConnectButton from '@/components/hr/HRConnectButton';
import { useHeartRate } from '@/hooks/useHeartRate';
import { useSimulatedHR } from '@/hooks/useSimulatedHR';
import { useARAnalytics } from '@/hooks/useARAnalytics';
import { usePrivacyPrefs } from '@/hooks/usePrivacyPrefs';
import { useHRStore } from '@/store/hr.store';

const BubbleBeatPage: React.FC = () => {
  const store = useHRStore();
  const { bpm, connected, isSupported } = useHeartRate();
  const { startSimulation, isRunning } = useSimulatedHR();

  // Auto-start demo if BLE not supported or not connected
  useEffect(() => {
    if (!isSupported || (!connected && !isRunning)) {
      startSimulation();
    }
  }, [isSupported, connected, isRunning, startSimulation]);

  const displayBPM = connected ? bpm : (isRunning ? store.bpm : null);

  return (
    <div className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Heart className="h-8 w-8 text-primary animate-pulse" />
                <h1 className="text-3xl font-bold">Bubble Beat</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Visualisation de ton rythme cardiaque en bulles animées
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <BubbleBeat 
                  bpm={displayBPM || undefined}
                  reducedMotion={store.reducedMotion}
                />
              </div>
              
              <div className="space-y-6">
                <HRConnectButton variant="card" />
                
                {displayBPM && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{displayBPM}</div>
                    <div className="text-sm text-muted-foreground">
                      {connected ? 'Capteur BLE' : 'Mode démo'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default BubbleBeatPage;