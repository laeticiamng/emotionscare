import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { Button } from '@/components/ui/button';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { Zap, Flame } from 'lucide-react';

const FlashGlow: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');
  const [sudsScorePre, setSudsScorePre] = useState<number | null>(null);
  const [showPreCheck, setShowPreCheck] = useState(true);

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
        // Alternate breathing visual every 4 seconds
        setBreathPhase(prev => prev === 'in' ? 'out' : 'in');
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

    // Unlock candle sticker
    const reward = unlockReward({
      type: 'sticker',
      name: 'Bougie zen',
      description: 'Flamme apaisante pour ton jardin'
    });

    setSessionResult({
      ...result,
      reward,
      cta: needsContinuation ? {
        text: "Encore 60 s ?",
        action: "continue",
        duration: "1 min"
      } : result.cta
    });
  };

  const getSudsText = (level: number) => {
    if (level <= 25) return "Plutôt calme";
    if (level <= 50) return "Un peu chargé";
    if (level <= 75) return "Assez tendu";
    return "Très chargé";
  };

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title="Flash Glow"
        state={state}
        showBack={false}
      >
        <SessionResultComponent 
          result={sessionResult}
          onContinue={() => {
            // Restart with 60s
            setTimeLeft(60);
            setSessionResult(null);
          }}
        />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Flash Glow"
      subtitle="Désamorcer en douceur"
      state={state}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {showPreCheck && (
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Comment tu te sens ?
            </h2>
            <p className="text-muted-foreground mb-8">
              On adapte l'exercice à ton état
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
                  className="w-full justify-start"
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isActive && !showPreCheck && (
          <div className="text-center">
            {/* Timer */}
            <div className="text-4xl font-light text-foreground mb-8">
              {formatTime(timeLeft)}
            </div>

            {/* Breathing Visual */}
            <div className="relative mb-12">
              <div 
                className={`w-40 h-40 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full transition-all duration-4000 ease-in-out ${
                  breathPhase === 'in' ? 'scale-110 opacity-90' : 'scale-90 opacity-70'
                }`}
                style={{
                  boxShadow: breathPhase === 'in' 
                    ? '0 0 60px rgba(255, 165, 0, 0.4)' 
                    : '0 0 30px rgba(255, 165, 0, 0.2)'
                }}
              />
              <Flame className={`absolute inset-0 m-auto w-16 h-16 text-orange-500 transition-opacity duration-2000 ${
                breathPhase === 'in' ? 'opacity-80' : 'opacity-40'
              }`} />
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <p className="text-lg text-foreground">
                {breathPhase === 'in' ? 'On souffle ensemble' : 'Ça se relâche'}
              </p>
              
              {timeLeft > 60 && (
                <p className="text-sm text-muted-foreground">
                  Laisse la lueur t'accompagner
                </p>
              )}
              
              {timeLeft <= 30 && (
                <p className="text-sm text-primary">
                  Ça se pose...
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="mt-8 w-full max-w-xs mx-auto">
              <div className="w-full bg-card rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((120 - timeLeft) / 120) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default FlashGlow;