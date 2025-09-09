import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { ArtifactReward } from '@/components/universe/ArtifactReward';
import { UniverseAmbiance } from '@/components/universe/UniverseAmbiance';
import { Button } from '@/components/ui/button';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { UNIVERSES } from '@/types/universes';
import { Zap, Flame, Sparkles } from 'lucide-react';

const FlashGlow: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [sparkleIntensity, setSparkleIntensity] = useState<'high' | 'medium' | 'low'>('high');
  const [sudsScorePre, setSudsScorePre] = useState<number | null>(null);
  const [showPreCheck, setShowPreCheck] = useState(true);
  const [showArtifact, setShowArtifact] = useState(false);

  const flashUniverse = UNIVERSES.flashGlow;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Gradually reduce sparkle intensity as time progresses
        const progress = (120 - timeLeft) / 120;
        if (progress < 0.3) setSparkleIntensity('high');
        else if (progress < 0.7) setSparkleIntensity('medium');
        else setSparkleIntensity('low');
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handlePreCheck = async (sudsLevel: number) => {
    setSudsScorePre(sudsLevel);
    setShowPreCheck(false);
    
    await startSession({
      id: 'flash-glow',
      name: 'Flash Glow',
      duration: 120
    });
  };

  const handleComplete = async () => {
    // Generate post-SUDS (simulated improvement)
    const sudsScorePost = Math.max(0, (sudsScorePre || 50) - Math.floor(Math.random() * 30) - 10);
    
    const responses = [
      { questionId: 'suds_pre', value: sudsScorePre || 50 },
      { questionId: 'suds_post', value: sudsScorePost }
    ];

    const result = await endSession({
      id: 'flash-glow',
      name: 'Flash Glow',
      duration: 120
    }, responses);

    // Check if needs continuation
    const improvement = (sudsScorePre || 50) - sudsScorePost;
    const needsContinuation = sudsScorePost >= 30 || improvement < 10;

    // Show artifact animation
    setShowArtifact(true);
    setTimeout(() => {
      setSessionResult({
        ...result,
        cta: needsContinuation ? {
          text: "Encore 60 s ?",
          action: "continue",
          duration: "1 min"
        } : result.cta
      });
      setShowArtifact(false);
    }, 3000);
  };

  const getSparkleCount = () => {
    switch (sparkleIntensity) {
      case 'high': return 20;
      case 'medium': return 12;
      case 'low': return 6;
    }
  };

  const getSparkleOpacity = () => {
    switch (sparkleIntensity) {
      case 'high': return 'opacity-90';
      case 'medium': return 'opacity-60';
      case 'low': return 'opacity-30';
    }
  };

  if (showArtifact) {
    return (
      <div className="min-h-screen relative" style={{ background: flashUniverse.ambiance.background }}>
        <UniverseAmbiance universe={flashUniverse} intensity={0.9} />
        <ArtifactReward 
          universe={flashUniverse}
          onComplete={() => {
            setShowArtifact(false);
            setSessionResult({ badge: "Feu intérieur apaisé ✨" });
          }}
        />
      </div>
    );
  }

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title={flashUniverse.name}
        state={state}
        showBack={false}
      >
        <div className="relative">
          <UniverseAmbiance universe={flashUniverse} intensity={0.4} />
          <SessionResultComponent 
            result={sessionResult}
            onContinue={() => {
              // Restart with 60s
              setTimeLeft(60);
              setSessionResult(null);
              setSparkleIntensity('high');
            }}
          />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: flashUniverse.ambiance.background }}>
      <UniverseAmbiance universe={flashUniverse} intensity={0.8} />
      
      <ModuleLayout 
        title={flashUniverse.name}
        subtitle="Désamorcer en douceur"
        state={state}
        className="bg-transparent"
      >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {showPreCheck && (
          <div className="text-center max-w-sm relative z-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant"
              style={{
                background: `linear-gradient(135deg, ${flashUniverse.ambiance.colors.primary}, ${flashUniverse.ambiance.colors.accent})`,
                boxShadow: `0 8px 32px ${flashUniverse.ambiance.colors.primary}60`
              }}
            >
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Les étincelles t'attendent
            </h2>
            <p className="text-muted-foreground mb-8">
              {flashUniverse.ambiance.metaphor}
            </p>
            
            <div className="space-y-3">
              {[
                { level: 20, text: "Plutôt calme" },
                { level: 40, text: "Un peu chargé" },
                { level: 60, text: "Assez tendu" },
                { level: 80, text: "Très chargé" }
              ].map(({ level, text }) => (
                <Button
                  key={level}
                  onClick={() => handlePreCheck(level)}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start bg-card/50 backdrop-blur-sm border-white/20 hover:bg-card/80"
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isActive && !showPreCheck && (
          <div className="text-center relative z-10">
            {/* Timer */}
            <div className="text-4xl font-light text-white mb-8 filter drop-shadow-lg">
              {formatTime(timeLeft)}
            </div>

            {/* Electric Dome with Sparks */}
            <div className="relative mb-12">
              <div 
                className="w-40 h-40 rounded-full transition-all duration-2000 ease-in-out"
                style={{
                  background: `radial-gradient(circle, ${flashUniverse.ambiance.colors.accent}80, ${flashUniverse.ambiance.colors.primary}40)`,
                  boxShadow: `0 0 80px ${flashUniverse.ambiance.colors.accent}60`,
                  opacity: sparkleIntensity === 'high' ? 1 : sparkleIntensity === 'medium' ? 0.7 : 0.4
                }}
              />
              
              {/* Electric sparks */}
              {Array.from({ length: getSparkleCount() }, (_, i) => (
                <Sparkles
                  key={i}
                  className={`absolute w-4 h-4 animate-ping ${getSparkleOpacity()}`}
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                    color: i % 2 === 0 ? flashUniverse.ambiance.colors.accent : flashUniverse.ambiance.colors.primary,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.8 + Math.random() * 0.4}s`,
                    filter: 'drop-shadow(0 0 8px currentColor)'
                  }}
                />
              ))}
              
              {/* Central flame */}
              <Flame 
                className={`absolute inset-0 m-auto w-16 h-16 text-white transition-opacity duration-2000 ${
                  sparkleIntensity === 'low' ? 'opacity-90' : 'opacity-60'
                }`}
                style={{ 
                  filter: `drop-shadow(0 0 20px ${flashUniverse.ambiance.colors.accent})`
                }}
              />
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <p className="text-lg text-white font-light">
                {sparkleIntensity === 'high' ? 'Les étincelles se calment à ton rythme' : 
                 sparkleIntensity === 'medium' ? 'Ça se regroupe doucement' : 
                 'La charge se dissipe...'}
              </p>
              
              {timeLeft > 60 && (
                <p className="text-sm text-white/80">
                  Laisse la lueur t'accompagner
                </p>
              )}
              
              {timeLeft <= 30 && (
                <p className="text-sm" style={{ color: flashUniverse.ambiance.colors.accent }}>
                  Le dôme s'apaise ✨
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="mt-8 w-full max-w-xs mx-auto">
              <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((120 - timeLeft) / 120) * 100}%`,
                    background: `linear-gradient(90deg, ${flashUniverse.ambiance.colors.accent}, ${flashUniverse.ambiance.colors.primary})`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashGlow;