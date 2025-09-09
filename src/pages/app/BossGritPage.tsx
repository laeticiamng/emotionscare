import React, { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle, RotateCcw, Target, Zap, Coffee, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number; // en secondes
  category: 'hydration' | 'writing' | 'movement' | 'mindfulness';
  color: string;
}

const BossGritPage = () => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const challenges: Challenge[] = [
    {
      id: 'hydrate',
      title: 'Hydratation Flash',
      description: 'Buvez un verre d\'eau lentement',
      icon: Coffee,
      duration: 60,
      category: 'hydration',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'walk',
      title: 'Marche Express',
      description: '100 pas autour de vous',
      icon: Footprints,
      duration: 120,
      category: 'movement',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'write',
      title: 'Note Rapide',
      description: 'Écrivez 3 choses positives',
      icon: Target,
      duration: 90,
      category: 'writing',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'breathe',
      title: 'Respir Flash',
      description: '5 respirations profondes',
      icon: Zap,
      duration: 45,
      category: 'mindfulness',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Timer du défi
  useEffect(() => {
    if (!challengeStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeChallenge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeStarted, timeRemaining]);

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setTimeRemaining(challenge.duration);
    setChallengeStarted(true);
    
    toast.success(`Défi "${challenge.title}" lancé !`, {
      description: challenge.description,
      duration: 2000
    });
  };

  const completeChallenge = () => {
    if (!activeChallenge) return;

    setChallengeStarted(false);
    setCompletedToday(prev => [...prev, activeChallenge.id]);
    
    toast.success('Défi réussi !', {
      description: 'Félicitations pour cette belle action ! 🎉',
      duration: 3000
    });

    setActiveChallenge(null);
    setTimeRemaining(0);
  };

  const abandonChallenge = () => {
    if (!activeChallenge) return;

    setChallengeStarted(false);
    
    toast.success('Déjà un pas fait.', {
      description: 'L\'intention compte aussi ! Réessayez quand vous voulez.',
      duration: 2000
    });

    setActiveChallenge(null);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChallengeProgress = () => {
    if (!activeChallenge) return 0;
    const elapsed = activeChallenge.duration - timeRemaining;
    return (elapsed / activeChallenge.duration) * 100;
  };

  const getMotivationalMessage = () => {
    const messages = [
      'Vous pouvez le faire !',
      'Un petit pas, un grand effet !',
      'Prendre soin de soi, c\'est important !',
      'Chaque geste compte !',
      'Vous êtes sur la bonne voie !',
      'Continuez, c\'est parfait !'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Boss Grit
          </h1>
          <p className="text-muted-foreground">
            Mini-défis bienveillants pour booster votre journée
          </p>
          {completedToday.length > 0 && (
            <p className="text-sm text-primary mt-2">
              🏆 {completedToday.length} défi{completedToday.length > 1 ? 's' : ''} relevé{completedToday.length > 1 ? 's' : ''} aujourd'hui !
            </p>
          )}
        </div>

        {activeChallenge ? (
          /* Défi actif */
          <div className="space-y-6">
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-muted">
              <div className="space-y-6">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${activeChallenge.color} rounded-full flex items-center justify-center`}>
                  <activeChallenge.icon className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">{activeChallenge.title}</h2>
                  <p className="text-muted-foreground mb-4">{activeChallenge.description}</p>
                  
                  {challengeStarted && (
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {formatTime(timeRemaining)}
                      </div>
                      <Progress value={getChallengeProgress()} className="w-full max-w-md mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {getMotivationalMessage()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  {challengeStarted ? (
                    <>
                      <Button onClick={completeChallenge} size="lg">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Terminé !
                      </Button>
                      <Button onClick={abandonChallenge} variant="outline" size="lg">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Arrêter
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => startChallenge(activeChallenge)} size="lg">
                      <Clock className="w-5 h-5 mr-2" />
                      Commencer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Sélection de défi */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Choisissez votre défi</h2>
              <p className="text-muted-foreground">
                Des actions simples pour prendre soin de vous
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 bg-card/30 backdrop-blur-sm border-muted hover:border-primary/50 transition-colors cursor-pointer">
                  <button 
                    onClick={() => startChallenge(challenge)}
                    className="w-full text-left"
                    disabled={completedToday.includes(challenge.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <challenge.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          {completedToday.includes(challenge.id) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(challenge.duration)}</span>
                          {completedToday.includes(challenge.id) && (
                            <span className="text-green-600 font-medium ml-2">✓ Complété</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </Card>
              ))}
            </div>

            {/* Conseils */}
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Conseils Boss Grit
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Choisissez le défi qui vous parle le plus à l'instant T</li>
                <li>• Pas de pression : l'intention compte autant que la réalisation</li>
                <li>• Vous pouvez refaire les mêmes défis plusieurs fois par jour</li>
                <li>• Célébrez chaque petite victoire, elle compte vraiment !</li>
                <li>• En cas d'abandon : pas de jugement, juste de la bienveillance</li>
              </ul>
            </Card>

            {/* Bénéfices */}
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4">Pourquoi ces micro-défis ?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Hydratation :</strong> Réveil du corps et de l'esprit</li>
                <li>• <strong>Mouvement :</strong> Activation douce de l'énergie</li>
                <li>• <strong>Écriture :</strong> Reconnexion avec le positif</li>
                <li>• <strong>Respiration :</strong> Ancrage dans l'instant présent</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BossGritPage;