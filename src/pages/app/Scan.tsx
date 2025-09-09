import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { ArtifactReward } from '@/components/universe/ArtifactReward';
import { UniverseAmbiance } from '@/components/universe/UniverseAmbiance';
import { Button } from '@/components/ui/button';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { UNIVERSES } from '@/types/universes';
import { Scan as ScanIcon, Sparkles, Droplets } from 'lucide-react';

const Scan: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [ambiance, setAmbiance] = useState<string>('');
  const [showArtifact, setShowArtifact] = useState(false);
  
  const scanUniverse = UNIVERSES.scan;

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
      { text: "Coton léger", color: scanUniverse.ambiance.colors.secondary, icon: "cloud" },
      { text: "Lumière calme", color: scanUniverse.ambiance.colors.accent, icon: "sun" },
      { text: "Eau fluide", color: scanUniverse.ambiance.colors.primary, icon: "water" },
      { text: "Brume douce", color: `${scanUniverse.ambiance.colors.secondary}80`, icon: "mist" },
      { text: "Mousse tendre", color: `${scanUniverse.ambiance.colors.accent}90`, icon: "leaf" }
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

    // Show artifact reward first
    setShowArtifact(true);
    
    // Then show session result after artifact animation
    setTimeout(() => {
      setSessionResult(result);
      setShowArtifact(false);
    }, 3000);
  };

  if (showArtifact) {
    return (
      <div className="min-h-screen relative" style={{ background: scanUniverse.ambiance.background }}>
        <UniverseAmbiance universe={scanUniverse} intensity={0.8} />
        <ArtifactReward 
          universe={scanUniverse}
          onComplete={() => {
            setShowArtifact(false);
            setSessionResult({ badge: "Reflet capturé ✨" });
          }}
        />
      </div>
    );
  }

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title={scanUniverse.name}
        state={state}
        showBack={false}
      >
        <div className="relative">
          <UniverseAmbiance universe={scanUniverse} intensity={0.6} />
          <SessionResultComponent result={sessionResult} />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: scanUniverse.ambiance.background }}>
      <UniverseAmbiance universe={scanUniverse} intensity={0.7} interactive />
      
      <ModuleLayout 
        title={scanUniverse.name}
        subtitle="L'Atelier des Reflets"
        state={state}
        className="bg-transparent"
      >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!isActive && (
          <div className="text-center max-w-sm relative z-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant"
              style={{
                background: `linear-gradient(135deg, ${scanUniverse.ambiance.colors.primary}, ${scanUniverse.ambiance.colors.accent})`,
                boxShadow: `0 8px 32px ${scanUniverse.ambiance.colors.primary}40`
              }}
            >
              <ScanIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Scanner ton moment
            </h2>
            <p className="text-muted-foreground mb-8">
              {scanUniverse.ambiance.metaphor}
            </p>
            <Button 
              onClick={handleStartScan}
              size="lg"
              className="w-full"
              style={{
                background: `linear-gradient(135deg, ${scanUniverse.ambiance.colors.primary}, ${scanUniverse.ambiance.colors.accent})`
              }}
            >
              Poser ton doigt
            </Button>
          </div>
        )}

        {isActive && !scanComplete && (
          <div className="text-center relative z-10">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div 
                className="absolute inset-0 border-4 rounded-full animate-pulse"
                style={{ borderColor: `${scanUniverse.ambiance.colors.primary}40` }}
              />
              <div 
                className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: scanUniverse.ambiance.colors.primary }}
              />
              <div 
                className="absolute inset-4 border-2 rounded-full animate-pulse"
                style={{ borderColor: `${scanUniverse.ambiance.colors.accent}60` }}
              />
              
              {/* Fluid animation */}
              <div 
                className="absolute inset-6 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${scanUniverse.ambiance.colors.primary}60, ${scanUniverse.ambiance.colors.accent}40)`
                }}
              />
              
              <Droplets className="absolute inset-0 m-auto w-8 h-8 text-white animate-bounce" />
            </div>
            <p className="text-foreground">
              Les fluides se mélangent...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ton reflet prend forme
            </p>
          </div>
        )}

        {scanComplete && ambiance && (
          <div className="text-center max-w-sm relative z-10">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in shadow-elegant"
              style={{
                background: `radial-gradient(circle, ${scanUniverse.ambiance.colors.primary}, ${scanUniverse.ambiance.colors.accent})`,
                boxShadow: `0 12px 40px ${scanUniverse.ambiance.colors.primary}50`
              }}
            >
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-2">
              {ambiance}
            </h3>
            <p className="text-muted-foreground mb-8">
              Voilà ta texture du moment
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Étire tes épaules en douceur ?
              </p>
              <Button 
                onClick={handleMicroGesture}
                size="lg"
                className="w-full"
                style={{
                  background: `linear-gradient(135deg, ${scanUniverse.ambiance.colors.primary}, ${scanUniverse.ambiance.colors.accent})`
                }}
              >
                Oui, on s'étire
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
    </div>
  );
};

export default Scan;