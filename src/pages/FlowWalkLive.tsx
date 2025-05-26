
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, Square } from 'lucide-react';

const FlowWalkLive: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

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
    const phaseInterval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000); // Change every 4 seconds

    return () => clearInterval(phaseInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleStop = () => {
    setIsActive(false);
    navigate('/breath/flowwalk/summary', { state: { duration: time } });
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
                Flow Walk en cours
              </div>
            </div>

            <div className="mb-8">
              <div className={`w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000 ${
                breathPhase === 'inhale' 
                  ? 'border-blue-500 scale-110' 
                  : 'border-green-500 scale-90'
              }`}>
                <div className="flex items-center justify-center h-full">
                  <span className="text-lg font-semibold">
                    {breathPhase === 'inhale' ? 'Inspirez' : 'Expirez'}
                  </span>
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

export default FlowWalkLive;
