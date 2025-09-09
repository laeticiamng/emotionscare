import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  active: boolean;
  missed: boolean;
}

const BubbleBeatPage = () => {
  const [gameActive, setGameActive] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tempo, setTempo] = useState(120); // BPM
  const [nextBubbleId, setNextBubbleId] = useState(0);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600', 
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600'
  ];

  const encouragements = [
    'Bien calé !',
    'Excellent rythme !',
    'Vous y êtes !',
    'Parfait !',
    'Encore mieux !',
    'Superbe timing !',
    'En plein dans le mille !',
    'Magnifique !',
    'Continuez comme ça !'
  ];

  // Créer une nouvelle bulle
  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: nextBubbleId,
      x: Math.random() * 60 + 20, // 20-80% de largeur
      y: Math.random() * 60 + 20, // 20-80% de hauteur
      size: Math.random() * 40 + 60, // 60-100px
      color: colors[Math.floor(Math.random() * colors.length)],
      active: true,
      missed: false
    };

    setBubbles(prev => [...prev, newBubble]);
    setNextBubbleId(prev => prev + 1);

    // Supprimer la bulle après 3 secondes si pas cliquée
    setTimeout(() => {
      setBubbles(prev => 
        prev.map(bubble => 
          bubble.id === newBubble.id && bubble.active
            ? { ...bubble, missed: true, active: false }
            : bubble
        )
      );
      
      // Nettoyer après animation
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 500);
    }, 3000);
  }, [nextBubbleId]);

  // Démarrer le jeu
  const startGame = () => {
    setGameActive(true);
    setSessionTime(0);
    setHits(0);
    setStreak(0);
    setBubbles([]);
    setEncouragementMessage('');
    
    toast.success('Bubble Beat lancé !', {
      description: 'Cliquez sur les bulles au bon rythme'
    });
  };

  // Arrêter le jeu
  const stopGame = () => {
    setGameActive(false);
    setBubbles([]);
    toast.success('Session terminée !', {
      description: 'Vous avez trouvé votre rythme intérieur'
    });
  };

  // Cliquer sur une bulle
  const hitBubble = (bubbleId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setBubbles(prev => 
      prev.map(bubble => 
        bubble.id === bubbleId && bubble.active
          ? { ...bubble, active: false }
          : bubble
      )
    );

    setHits(prev => prev + 1);
    setStreak(prev => prev + 1);
    
    // Message d'encouragement
    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    setEncouragementMessage(message);
    
    toast.success(message, {
      duration: 1000
    });

    // Effacer le message après 2 secondes
    setTimeout(() => setEncouragementMessage(''), 2000);

    // Nettoyer la bulle
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    }, 300);
  };

  // Gestion du tempo (création de bulles)
  useEffect(() => {
    if (!gameActive) return;

    const interval = (60 / tempo) * 1000; // Convertir BPM en ms
    const bubbleTimer = setInterval(createBubble, interval);

    return () => clearInterval(bubbleTimer);
  }, [gameActive, tempo, createBubble]);

  // Timer de session
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Gestion clavier (espace pour hit global)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        // Trouver la bulle la plus proche du centre
        const centerX = 50;
        const centerY = 50;
        const activeBubbles = bubbles.filter(b => b.active);
        
        if (activeBubbles.length > 0) {
          const closestBubble = activeBubbles.reduce((closest, bubble) => {
            const distance = Math.sqrt(
              Math.pow(bubble.x - centerX, 2) + Math.pow(bubble.y - centerY, 2)
            );
            const closestDistance = Math.sqrt(
              Math.pow(closest.x - centerX, 2) + Math.pow(closest.y - centerY, 2)
            );
            return distance < closestDistance ? bubble : closest;
          });
          
          hitBubble(closestBubble.id, {} as React.MouseEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive, bubbles]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Bubble Beat
          </h1>
          <p className="text-slate-300">
            Tapez au rythme, libérez votre stress
          </p>
          {gameActive && (
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="text-cyan-300">Temps: {formatTime(sessionTime)}</span>
              <span className="text-purple-300">Bulles: {hits}</span>
              <span className="text-pink-300">Série: {streak}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Zone de jeu */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-600 min-h-[500px] relative overflow-hidden">
              {gameActive ? (
                <div className="relative w-full h-full min-h-[450px]">
                  {/* Message d'encouragement */}
                  {encouragementMessage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold animate-bounce">
                        {encouragementMessage}
                      </div>
                    </div>
                  )}

                  {/* Bulles */}
                  {bubbles.map(bubble => (
                    <button
                      key={bubble.id}
                      onClick={(e) => hitBubble(bubble.id, e)}
                      disabled={!bubble.active}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 hover:scale-110 ${
                        bubble.active 
                          ? 'animate-pulse cursor-pointer' 
                          : bubble.missed 
                            ? 'opacity-50 scale-75' 
                            : 'scale-125 opacity-75'
                      }`}
                      style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                      }}
                    >
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} shadow-lg`} />
                    </button>
                  ))}

                  {/* Instructions */}
                  {bubbles.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Les bulles vont apparaître...</p>
                        <p className="text-sm mt-2">Cliquez dessus ou appuyez sur Espace</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[450px]">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Prêt à jouer ?
                    </h3>
                    <p className="text-slate-300 mb-6">
                      Cliquez sur les bulles colorées qui apparaissent au rythme de la musique.
                      Parfait pour évacuer le stress tout en s'amusant !
                    </p>
                    <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                      <Play className="w-5 h-5 mr-2" />
                      Commencer
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-4">
            {/* Contrôles */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-600">
              <div className="space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Contrôles
                </h3>
                
                {gameActive ? (
                  <Button onClick={stopGame} variant="destructive" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Terminer
                  </Button>
                ) : (
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                    <Play className="w-4 h-4 mr-2" />
                    Jouer
                  </Button>
                )}
              </div>
            </Card>

            {/* Tempo */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-600">
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Tempo</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Rythme</span>
                    <span className="text-cyan-300">{tempo} BPM</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setTempo(90)} 
                      disabled={gameActive}
                      variant={tempo === 90 ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                    >
                      Lent
                    </Button>
                    <Button 
                      onClick={() => setTempo(120)} 
                      disabled={gameActive}
                      variant={tempo === 120 ? "default" : "outline"}
                      size="sm" 
                      className="flex-1"
                    >
                      Normal
                    </Button>
                    <Button 
                      onClick={() => setTempo(150)} 
                      disabled={gameActive}
                      variant={tempo === 150 ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                    >
                      Rapide
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-600">
              <h3 className="font-semibold text-white mb-3">Comment jouer</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Cliquez sur les bulles colorées</li>
                <li>• Ou appuyez sur Espace</li>
                <li>• Suivez le rythme musical</li>
                <li>• Pas de score, juste du plaisir !</li>
                <li>• Laissez-vous porter par le flow</li>
              </ul>
            </Card>

            {/* Bénéfices */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-600">
              <h3 className="font-semibold text-white mb-3">Bénéfices</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Réduction du stress</li>
                <li>• Amélioration de la concentration</li>
                <li>• Coordination œil-main</li>
                <li>• Moment de détente ludique</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleBeatPage;