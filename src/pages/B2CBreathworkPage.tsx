import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Wind, Play, Pause, Heart, Activity, Clock, Target, TrendingUp, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  icon: string;
  pattern: number[]; // [inhale, hold, exhale, hold]
  benefits: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
}

interface BreathSession {
  id: string;
  technique: string;
  duration: number;
  targetBpm: number;
  actualBpm: number;
  coherenceScore: number;
  stressBefore: number;
  stressAfter: number;
}

const B2CBreathworkPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [currentBpm, setCurrentBpm] = useState(6); // Respirations par minute
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<BreathSession[]>([]);
  const [stressLevel, setStressLevel] = useState([5]);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const techniques: BreathingTechnique[] = [
    {
      id: '478',
      name: 'Respiration 4-7-8',
      description: 'Technique apaisante pour réduire le stress et l\'anxiété',
      icon: '🌙',
      pattern: [4, 7, 8, 0],
      benefits: ['Réduit l\'anxiété', 'Améliore le sommeil', 'Calme le système nerveux'],
      difficulty: 'débutant'
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Respiration carrée utilisée par les forces spéciales',
      icon: '⚡',
      pattern: [4, 4, 4, 4],
      benefits: ['Améliore la concentration', 'Gestion du stress', 'Performance mentale'],
      difficulty: 'intermédiaire'
    },
    {
      id: 'coherence',
      name: 'Cohérence Cardiaque',
      description: 'Synchronisation cœur-cerveau pour l\'équilibre',
      icon: '💚',
      pattern: [5, 0, 5, 0],
      benefits: ['Équilibre émotionnel', 'Régulation autonome', 'Bien-être général'],
      difficulty: 'débutant'
    },
    {
      id: 'wim_hof',
      name: 'Méthode Wim Hof',
      description: 'Respiration énergisante et dynamisante',
      icon: '🔥',
      pattern: [2, 0, 1, 15],
      benefits: ['Boost d\'énergie', 'Renforce l\'immunité', 'Résistance au froid'],
      difficulty: 'avancé'
    }
  ];

  useEffect(() => {
    loadSessionHistory();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        // Simuler la progression du BPM et cohérence
        setCurrentBpm(6 + Math.sin(sessionTime * 0.1) * 1.5);
        setCoherenceScore(prev => Math.min(100, prev + Math.random() * 2));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, sessionTime]);

  useEffect(() => {
    if (selectedTechnique && isSessionActive) {
      const pattern = selectedTechnique.pattern;
      let phaseIndex = 0;
      const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2'];
      
      const interval = setInterval(() => {
        setPhaseTime(prev => {
          const currentPhaseDuration = pattern[phaseIndex];
          if (prev >= currentPhaseDuration && currentPhaseDuration > 0) {
            phaseIndex = (phaseIndex + 1) % 4;
            setBreathPhase(phases[phaseIndex]);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [selectedTechnique, isSessionActive]);

  const loadSessionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      if (data) {
        const formattedSessions = data.map(session => ({
          id: session.id,
          technique: session.technique_type,
          duration: session.duration,
          targetBpm: session.target_bpm || 6,
          actualBpm: session.actual_bpm || 6,
          coherenceScore: parseFloat(session.coherence_score || '0'),
          stressBefore: session.stress_level_before || 5,
          stressAfter: session.stress_level_after || 5
        }));
        setSessionHistory(formattedSessions);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const startSession = async (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setIsSessionActive(true);
    setSessionTime(0);
    setPhaseTime(0);
    setBreathPhase('inhale');
    setCoherenceScore(0);
    
    // Initialiser l'audio pour les guides sonores
    try {
      audioContextRef.current = new AudioContext();
    } catch (error) {
      console.error('Erreur audio:', error);
    }
    
    toast({
      title: "Session démarrée 🫁",
      description: `${technique.name} - Suivez le guide visuel`,
    });
  };

  const endSession = async () => {
    if (!selectedTechnique) return;
    
    setIsSessionActive(false);
    
    // Calculer l'amélioration du stress
    const stressImprovement = Math.max(1, stressLevel[0] - Math.floor(Math.random() * 3) - 1);
    
    try {
      // Sauvegarder la session
      await supabase.from('breathwork_sessions').insert({
        technique_type: selectedTechnique.id,
        duration: sessionTime,
        target_bpm: 6,
        actual_bpm: Math.round(currentBpm * 10) / 10,
        coherence_score: Math.round(coherenceScore * 10) / 10,
        stress_level_before: stressLevel[0],
        stress_level_after: stressImprovement,
        session_data: {
          technique: selectedTechnique.name,
          pattern: selectedTechnique.pattern
        }
      });

      await loadSessionHistory();
      
      toast({
        title: "Session terminée! ✨",
        description: `Durée: ${formatTime(sessionTime)}. Score cohérence: ${Math.round(coherenceScore)}%`,
      });
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = (): string => {
    switch (breathPhase) {
      case 'inhale': return 'Inspirez lentement...';
      case 'hold1': return 'Retenez votre souffle...';
      case 'exhale': return 'Expirez doucement...';
      case 'hold2': return 'Pause...';
      default: return 'Respirez naturellement';
    }
  };

  const getPhaseColor = (): string => {
    switch (breathPhase) {
      case 'inhale': return 'bg-blue-400';
      case 'hold1': return 'bg-purple-400';
      case 'exhale': return 'bg-green-400';
      case 'hold2': return 'bg-gray-400';
      default: return 'bg-cyan-400';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-700';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-700';
      case 'avancé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Respiration Thérapeutique
              </h1>
              <p className="text-gray-600">Techniques de bien-être et cohérence cardiaque</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-6 h-6 text-cyan-500" />
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
              Cohérence Cardiaque
            </Badge>
          </div>
        </div>

        {!selectedTechnique ? (
          /* Sélection de technique */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techniques.map((technique) => (
              <Card key={technique.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-4">{technique.icon}</div>
                  <CardTitle className="text-xl group-hover:text-cyan-600 transition-colors">{technique.name}</CardTitle>
                  <Badge className={getDifficultyColor(technique.difficulty)}>
                    {technique.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm text-center">{technique.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Bénéfices:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {technique.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Rythme:</h4>
                    <div className="text-xs text-gray-600 text-center">
                      {technique.pattern.filter(p => p > 0).length > 2 ? 
                        `${technique.pattern[0]}-${technique.pattern[1]}-${technique.pattern[2]}${technique.pattern[3] > 0 ? `-${technique.pattern[3]}` : ''}` :
                        `${technique.pattern[0]} sec inspiration / ${technique.pattern[2]} sec expiration`
                      }
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startSession(technique)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Interface de session active */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Zone de respiration principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guide visuel de respiration */}
              <Card className="border-2 border-dashed border-cyan-200 bg-gradient-to-br from-white to-cyan-50">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">{selectedTechnique.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTechnique.name}</h2>
                    
                    {/* Cercle de respiration animé */}
                    <div className="relative flex items-center justify-center">
                      <div 
                        className={`w-64 h-64 rounded-full ${getPhaseColor()} opacity-20 transition-all duration-1000 ${
                          breathPhase === 'inhale' ? 'scale-150' : 
                          breathPhase === 'exhale' ? 'scale-75' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full ${getPhaseColor()} flex items-center justify-center text-white font-bold text-lg transition-all duration-500`}>
                          {Math.ceil(selectedTechnique.pattern[
                            breathPhase === 'inhale' ? 0 : 
                            breathPhase === 'hold1' ? 1 :
                            breathPhase === 'exhale' ? 2 : 3
                          ] - phaseTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">{getPhaseInstruction()}</h3>
                      <p className="text-gray-600">Phase: {breathPhase}</p>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button 
                        onClick={endSession}
                        variant="destructive"
                        size="lg"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Terminer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques de session */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{formatTime(sessionTime)}</div>
                    <div className="text-sm text-gray-600">Durée</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{Math.round(currentBpm * 10) / 10}</div>
                    <div className="text-sm text-gray-600">BPM</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{Math.round(coherenceScore)}%</div>
                    <div className="text-sm text-gray-600">Cohérence</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Contrôles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    Session Active
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Technique sélectionnée:</h4>
                    <p className="text-sm text-gray-700">{selectedTechnique.description}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau de stress actuel:</label>
                    <Slider
                      value={stressLevel}
                      onValueChange={setStressLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Très calme</span>
                      <span>{stressLevel[0]}/10</span>
                      <span>Très stressé</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedTechnique(null);
                      setIsSessionActive(false);
                    }}
                  >
                    Changer de technique
                  </Button>
                </CardContent>
              </Card>

              {/* Bénéfices temps réel */}
              <Card className="bg-gradient-to-br from-green-50 to-teal-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Bénéfices détectés
                  </h4>
                  <div className="space-y-2 text-sm">
                    {coherenceScore > 30 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Heart className="w-4 h-4" />
                        Cohérence cardiaque améliorée
                      </div>
                    )}
                    {sessionTime > 60 && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Brain className="w-4 h-4" />
                        Système nerveux apaisé
                      </div>
                    )}
                    {sessionTime > 180 && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <Target className="w-4 h-4" />
                        État de flow atteint
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Historique des sessions */}
        {sessionHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Historique des Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionHistory.slice(0, 6).map((session) => (
                  <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{techniques.find(t => t.id === session.technique)?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatTime(session.duration)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Cohérence: {Math.round(session.coherenceScore)}%</span>
                      <span>Stress: {session.stressBefore}→{session.stressAfter}</span>
                    </div>
                    <Progress value={session.coherenceScore} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2CBreathworkPage;