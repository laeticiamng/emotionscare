import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { Button } from '@/components/ui/button';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { Scan as ScanIcon, Sparkles } from 'lucide-react';

const Scan: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [ambiance, setAmbiance] = useState<string>('');

  const handleStartScan = async () => {
    await startSession({
      id: 'scan',
      name: 'Scan émotionnel',
      duration: 10
    });

    // Simulate scanning animation
    setTimeout(() => {
      setScanComplete(true);
      generateAmbiance();
    }, 5000);
  };

  const generateAmbiance = () => {
    const ambiances = [
      { text: "Coton léger", color: "from-blue-100 to-blue-200" },
      { text: "Lumière calme", color: "from-yellow-100 to-yellow-200" },
      { text: "Eau fluide", color: "from-cyan-100 to-cyan-200" },
      { text: "Brume douce", color: "from-gray-100 to-gray-200" },
      { text: "Mousse tendre", color: "from-green-100 to-green-200" }
    ];
    
    const selected = ambiances[Math.floor(Math.random() * ambiances.length)];
    setAmbiance(selected.text);
  };

  const handleMicroGesture = async () => {
    // Submit SAM-like response (simulated values)
    const responses = [
      { questionId: 'valence', value: Math.floor(Math.random() * 9) + 1 },
      { questionId: 'arousal', value: Math.floor(Math.random() * 9) + 1 }
    ];

    const result = await endSession({
      id: 'scan',
      name: 'Scan émotionnel',
      duration: 10
    }, responses);

    // Unlock theme reward
    const reward = unlockReward({
      type: 'theme',
      name: 'Fond ambiance',
      description: 'Nouveau fond d\'écran débloqué'
    });

    setSessionResult({
      ...result,
      reward
    });
  };

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title="Scan émotionnel"
        state={state}
        showBack={false}
      >
        <SessionResultComponent result={sessionResult} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Scan émotionnel"
      subtitle="Miroir du moment"
      state={state}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!isActive && (
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ScanIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Scanner ton moment
            </h2>
            <p className="text-muted-foreground mb-8">
              Une lecture douce de ton état intérieur
            </p>
            <Button 
              onClick={handleStartScan}
              size="lg"
              className="w-full"
            >
              Scanner
            </Button>
          </div>
        )}

        {isActive && !scanComplete && (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-pulse"></div>
              <ScanIcon className="absolute inset-0 m-auto w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Lecture en cours...
            </p>
          </div>
        )}

        {scanComplete && ambiance && (
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-2">
              {ambiance}
            </h3>
            <p className="text-muted-foreground mb-8">
              Voilà ta texture du moment
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Trois souffles doux ?
              </p>
              <Button 
                onClick={handleMicroGesture}
                size="lg"
                className="w-full"
              >
                Oui, on respire
              </Button>
              <Button 
                onClick={() => handleMicroGesture()}
                variant="outline"
                size="lg"
                className="w-full"
              >
                C'est parfait comme ça
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default Scan;