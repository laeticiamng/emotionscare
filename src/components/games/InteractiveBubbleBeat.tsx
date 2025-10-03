import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Pause, RotateCcw, Trophy, Target, Zap, Star } from 'lucide-react';
import { useWebBluetooth } from '@/hooks/useWebBluetooth';
import { supabase } from '@/integrations/supabase/client';
import { triggerConfetti } from '@/lib/confetti';
import { toast } from '@/hooks/use-toast';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  phase: number;
  pulseStrength: number;
  targetRadius: number;
  id: string;
  clickable: boolean;
  scored: boolean;
}

interface GameLevel {
  id: string;
  name: string;
  description: string;
  targetBPM: { min: number; max: number };
  duration: number; // en secondes
  bubbleCount: number;
  difficultyMultiplier: number;
  pointsPerBubble: number;
}

interface ScoreStreak {
  count: number;
  multiplier: number;
  type: 'perfect' | 'good' | 'miss';
}

const gameLevels: GameLevel[] = [
  {
    id: 'zen',
    name: 'Mode Zen',
    description: 'Détente avec rythme lent',
    targetBPM: { min: 60, max: 80 },
    duration: 90,
    bubbleCount: 50,
    difficultyMultiplier: 1,
    pointsPerBubble: 10
  },
  {
    id: 'focus',
    name: 'Mode Focus',
    description: 'Concentration optimale',
    targetBPM: { min: 80, max: 100 },
    duration: 120,
    bubbleCount: 75,
    difficultyMultiplier: 1.2,
    pointsPerBubble: 15
  },
  {
    id: 'cardio',
    name: 'Mode Cardio',
    description: 'Entraînement cardiaque',
    targetBPM: { min: 100, max: 130 },
    duration: 180,
    bubbleCount: 100,
    difficultyMultiplier: 1.5,
    pointsPerBubble: 20
  },
  {
    id: 'champion',
    name: 'Mode Champion',
    description: 'Pour les maîtres du rythme',
    targetBPM: { min: 130, max: 160 },
    duration: 240,
    bubbleCount: 150,
    difficultyMultiplier: 2,
    pointsPerBubble: 30
  }
];

export default function InteractiveBubbleBeat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { isConnected: hrConnected, heartRate } = useWebBluetooth();
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(gameLevels[0]);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [perfectHits, setPerfectHits] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [streak, setStreak] = useState<ScoreStreak>({ count: 0, multiplier: 1, type: 'miss' });
  
  // Beat detection
  const [currentBPM, setCurrentBPM] = useState(75);
  const [bpmHistory, setBpmHistory] = useState<number[]>([]);
  const [isInZone, setIsInZone] = useState(false);
  
  // Initialize bubbles
  const createBubble = useCallback((canvas: HTMLCanvasElement): Bubble => {
    return {
      x: Math.random() * (canvas.width - 100) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 15 + Math.random() * 25,
      targetRadius: 15 + Math.random() * 25,
      opacity: 0.6 + Math.random() * 0.4,
      hue: 180 + Math.random() * 120, // Blue to purple range
      phase: Math.random() * Math.PI * 2,
      pulseStrength: 0.5 + Math.random() * 0.5,
      id: `bubble_${Date.now()}_${Math.random()}`,
      clickable: false,
      scored: false
    };
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBubbles: Bubble[] = [];
    for (let i = 0; i < selectedLevel.bubbleCount; i++) {
      newBubbles.push(createBubble(canvas));
    }
    setBubbles(newBubbles);
  }, [selectedLevel, createBubble]);

  // Update bubbles physics and beat sync
  const updateBubbles = useCallback((canvas: HTMLCanvasElement, deltaTime: number) => {
    const beatInterval = currentBPM ? (60 / currentBPM) * 1000 : 1000;
    const beatPhase = (Date.now() % beatInterval) / beatInterval;
    const pulseIntensity = Math.sin(beatPhase * Math.PI * 2) * 0.5 + 0.5;
    
    setBubbles(prevBubbles => prevBubbles.map(bubble => {
      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      
      // Bounce off walls
      if (bubble.x < bubble.radius || bubble.x > canvas.width - bubble.radius) {
        bubble.vx *= -0.8;
        bubble.x = Math.max(bubble.radius, Math.min(canvas.width - bubble.radius, bubble.x));
      }
      if (bubble.y < bubble.radius || bubble.y > canvas.height - bubble.radius) {
        bubble.vy *= -0.8;
        bubble.y = Math.max(bubble.radius, Math.min(canvas.height - bubble.radius, bubble.y));
      }
      
      // Update pulse phase
      bubble.phase += deltaTime * 0.003;
      
      // Pulse with heart rate
      const basePulse = Math.sin(bubble.phase) * 0.3;
      const heartPulse = pulseIntensity * bubble.pulseStrength * 0.4;
      bubble.radius = bubble.targetRadius * (1 + basePulse + heartPulse);
      
      // Make bubbles clickable on beat peak
      bubble.clickable = pulseIntensity > 0.8 && !bubble.scored;
      
      // Update hue based on BPM zone
      if (isInZone) {
        bubble.hue = 120 + Math.sin(bubble.phase) * 30; // Green zone
      } else {
        bubble.hue = 0 + Math.sin(bubble.phase) * 30; // Red zone
      }
      
      return bubble;
    }));
  }, [currentBPM, isInZone]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw BPM zone indicator
    if (isInZone) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw bubbles
    bubbles.forEach(bubble => {
      ctx.save();
      
      // Glow effect for clickable bubbles
      if (bubble.clickable) {
        ctx.shadowColor = `hsl(${bubble.hue}, 70%, 60%)`;
        ctx.shadowBlur = 20;
      }
      
      // Create radial gradient for bubble
      const bubbleGradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius
      );
      
      const alpha = bubble.clickable ? 0.8 : 0.4;
      bubbleGradient.addColorStop(0, `hsla(${bubble.hue}, 70%, 70%, ${alpha})`);
      bubbleGradient.addColorStop(0.7, `hsla(${bubble.hue}, 60%, 50%, ${alpha * 0.6})`);
      bubbleGradient.addColorStop(1, `hsla(${bubble.hue}, 50%, 30%, 0)`);
      
      ctx.fillStyle = bubbleGradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw click target for clickable bubbles
      if (bubble.clickable) {
        ctx.strokeStyle = `hsla(${bubble.hue}, 70%, 80%, 0.8)`;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.restore();
    });
    
    // Draw UI elements
    drawUI(ctx, canvas);
  }, [bubbles, isInZone, score, combo, gameTime, selectedLevel]);

  const drawUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    
    // Score
    ctx.fillText(`Score: ${score}`, 20, 40);
    
    // Combo
    if (combo > 1) {
      ctx.fillStyle = combo > 5 ? '#f59e0b' : '#3b82f6';
      ctx.fillText(`Combo x${combo}`, 20, 70);
    }
    
    // BPM display
    ctx.fillStyle = isInZone ? '#22c55e' : '#ef4444';
    ctx.fillText(`BPM: ${currentBPM}`, canvas.width - 150, 40);
    
    // Target zone
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`Zone: ${selectedLevel.targetBPM.min}-${selectedLevel.targetBPM.max}`, canvas.width - 150, 65);
    
    // Time remaining
    const timeLeft = Math.max(0, selectedLevel.duration - gameTime);
    ctx.fillText(`Temps: ${Math.ceil(timeLeft)}s`, canvas.width - 150, 90);
  };

  // Handle bubble clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setTotalClicks(prev => prev + 1);
    
    // Check for bubble hits
    const hitBubble = bubbles.find(bubble => {
      const distance = Math.sqrt(Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2));
      return distance <= bubble.radius && bubble.clickable && !bubble.scored;
    });
    
    if (hitBubble) {
      handleBubbleHit(hitBubble);
    } else {
      handleMiss();
    }
  };

  const handleBubbleHit = (bubble: Bubble) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Mark bubble as scored
    setBubbles(prev => prev.map(b => 
      b.id === bubble.id ? { ...b, scored: true } : b
    ));
    
    // Calculate score
    let points = selectedLevel.pointsPerBubble;
    
    if (isInZone) {
      points *= 2; // Double points in BPM zone
      setPerfectHits(prev => prev + 1);
      setCombo(prev => prev + 1);
      setStreak(prev => ({ ...prev, count: prev.count + 1, type: 'perfect' }));
    } else {
      points = Math.floor(points * 0.7);
      setStreak(prev => ({ ...prev, type: 'good' }));
    }
    
    // Apply combo multiplier
    if (combo > 5) points *= 2;
    if (combo > 10) points *= 3;
    
    setScore(prev => prev + points);
    
    // Replace bubble
    setTimeout(() => {
      setBubbles(prev => prev.map(b => 
        b.id === bubble.id ? createBubble(canvas) : b
      ));
    }, 100);
    
    // Visual feedback
    if (points > selectedLevel.pointsPerBubble) {
      triggerConfetti();
    }
  };

  const handleMiss = () => {
    setCombo(0);
    setStreak(prev => ({ count: 0, multiplier: 1, type: 'miss' }));
  };

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    updateBubbles(canvasRef.current!, currentTime);
    render();
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [updateBubbles, render, isPlaying]);

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setGameTime(prev => {
          const newTime = prev + 1;
          if (newTime >= selectedLevel.duration) {
            endGame();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, selectedLevel]);

  // BPM monitoring
  useEffect(() => {
    if (hrConnected && heartRate) {
      setCurrentBPM(heartRate);
      setBpmHistory(prev => [...prev.slice(-10), heartRate]);
      
      const inZone = heartRate >= selectedLevel.targetBPM.min && heartRate <= selectedLevel.targetBPM.max;
      setIsInZone(inZone);
    }
  }, [hrConnected, heartRate, selectedLevel]);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const startGame = () => {
    setIsPlaying(true);
    setGameTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectHits(0);
    setTotalClicks(0);
    initializeGame();
    
    toast({
      title: "🎮 Jeu démarré!",
      description: `Mode ${selectedLevel.name} - Cliquez sur les bulles au rythme!`,
    });
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setMaxCombo(Math.max(maxCombo, combo));
    
    const accuracy = totalClicks > 0 ? (perfectHits / totalClicks) * 100 : 0;
    const finalScore = score + (perfectHits * 50); // Bonus for perfect hits
    
    try {
      await supabase.from('bubble_beat_scores').insert({
        level: selectedLevel.id,
        score: finalScore,
        perfect_hits: perfectHits,
        total_clicks: totalClicks,
        accuracy: accuracy,
        max_combo: maxCombo,
        bpm_avg: bpmHistory.length > 0 ? bpmHistory.reduce((a, b) => a + b, 0) / bpmHistory.length : null
      });
    } catch (error) {
      console.error('Erreur sauvegarde score:', error);
    }

    triggerConfetti();
    toast({
      title: "🏆 Partie terminée!",
      description: `Score final: ${finalScore} • Précision: ${accuracy.toFixed(1)}%`,
    });
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectHits(0);
    setTotalClicks(0);
    setBubbles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Bubble Beat Pro
            </h1>
            <p className="text-muted-foreground">Jeu de rythme cardiaque interactif</p>
          </div>
          
          <div className="flex gap-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-bold">x{combo}</div>
                  <div className="text-xs text-muted-foreground">Combo</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Zone de jeu principale */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full h-full cursor-crosshair rounded-lg"
                    style={{ background: 'linear-gradient(45deg, #0f172a, #1e293b)' }}
                  />
                  
                  {/* Game UI Overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">
                          {gameTime >= selectedLevel.duration ? 'Partie Terminée!' : 'Bubble Beat'}
                        </h3>
                        {gameTime >= selectedLevel.duration && (
                          <div className="space-y-2 mb-6">
                            <div>Score final: <span className="font-bold text-yellow-400">{score}</span></div>
                            <div>Précision: <span className="font-bold">
                              {totalClicks > 0 ? ((perfectHits / totalClicks) * 100).toFixed(1) : 0}%
                            </span></div>
                            <div>Combo max: <span className="font-bold text-orange-400">x{maxCombo}</span></div>
                          </div>
                        )}
                        <Button onClick={startGame} size="lg" className="mr-4">
                          <Play className="h-5 w-5 mr-2" />
                          {gameTime >= selectedLevel.duration ? 'Rejouer' : 'Démarrer'}
                        </Button>
                        {gameTime > 0 && (
                          <Button onClick={resetGame} size="lg" variant="outline">
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Reset
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Pause overlay */}
                  {isPlaying && gameTime > 0 && (
                    <div className="absolute top-4 right-4">
                      <Button onClick={pauseGame} variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sélection de niveau */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Modes de Jeu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gameLevels.map(level => (
                  <div
                    key={level.id}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedLevel.id === level.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => !isPlaying && setSelectedLevel(level)}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {level.targetBPM.min}-{level.targetBPM.max} BPM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {level.duration}s
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats temps réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Stats Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hrConnected ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{currentBPM}</div>
                    <div className="text-sm text-muted-foreground">BPM Connecté</div>
                    <div className={`text-sm font-medium mt-1 ${isInZone ? 'text-green-600' : 'text-red-600'}`}>
                      {isInZone ? '✅ Dans la zone!' : '❌ Hors zone'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <div className="text-sm">Connectez un capteur cardiaque pour une expérience optimale</div>
                  </div>
                )}
                
                {isPlaying && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temps</span>
                      <span>{Math.max(0, selectedLevel.duration - gameTime)}s</span>
                    </div>
                    <Progress 
                      value={(gameTime / selectedLevel.duration) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Comment jouer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>🎯 Cliquez sur les bulles brillantes au bon moment</div>
                <div>💓 Maintenez votre BPM dans la zone cible</div>
                <div>⚡ Enchaînez les hits pour des combos</div>
                <div>🏆 Plus de précision = plus de points</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}