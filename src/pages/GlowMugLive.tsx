
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, Square } from 'lucide-react';

const GlowMugLive: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const phases = ['inhale', 'hold', 'exhale'] as const;
    let currentPhaseIndex = 0;
    
    const phaseInterval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex]);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(phaseInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Inspirez la chaleur';
      case 'hold': return 'Retenez la lumière';
      case 'exhale': return 'Expirez la détente';
    }
  };

  const getGlowIntensity = () => {
    switch (breathPhase) {
      case 'inhale': return 'shadow-lg shadow-yellow-500/50 scale-110';
      case 'hold': return 'shadow-xl shadow-orange-500/70 scale-105';
      case 'exhale': return 'shadow-md shadow-green-500/30 scale-95';
    }
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleStop = () => {
    setIsActive(false);
    navigate('/breath/glowmug/summary', { state: { duration: time } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatTime(time)}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                Glow Mug en cours
              </div>
            </div>

            <div className="mb-8">
              <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 transition-all duration-1000 ${getGlowIntensity()}`}>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-2">☕</div>
                    <div className="text-sm font-semibold text-orange-800">
                      {getPhaseText()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!isActive ? (
                <Button onClick={handleStart} className="w-full" size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Commencer
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline" className="w-full" size="lg">
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              )}
              
              <Button onClick={handleStop} variant="destructive" className="w-full">
                <Square className="mr-2 h-4 w-4" />
                Terminer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlowMugLive;
