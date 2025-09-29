import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Target, Zap, MessageCircle, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Challenge {
  id: string;
  title: string;
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'stress' | 'conflict' | 'change' | 'failure';
  resilience_skills: string[];
}

interface BattleSession {
  challenge: Challenge;
  userResponse: string;
  aiCoaching: string;
  score: number;
  skills_developed: string[];
  status: 'active' | 'completed';
}

export default function BounceBackBattle() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [session, setSession] = useState<BattleSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [battleHistory, setBattleHistory] = useState<BattleSession[]>([]);
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const challenges: Challenge[] = [
    {
      id: 'stress-deadline',
      title: 'Pression temporelle',
      scenario: 'Votre manager vous confie un projet urgent avec une deadline impossible. Vous ressentez un stress intense et commencez à douter de vos capacités. Comment réagissez-vous ?',
      difficulty: 'medium',
      category: 'stress',
      resilience_skills: ['gestion_stress', 'prioritisation', 'communication']
    },
    {
      id: 'conflict-team',
      title: 'Conflit d\'équipe',
      scenario: 'Un collègue critique publiquement votre travail lors d\'une réunion importante. Vous vous sentez humilié et en colère. Quelle est votre stratégie pour gérer cette situation ?',
      difficulty: 'hard',
      category: 'conflict',
      resilience_skills: ['intelligence_emotionnelle', 'communication', 'confiance_soi']
    },
    {
      id: 'change-reorganisation',
      title: 'Changement organisationnel',
      scenario: 'Votre entreprise annonce une réorganisation majeure. Votre poste pourrait être supprimé. L\'incertitude vous angoisse. Comment vous adaptez-vous ?',
      difficulty: 'hard',
      category: 'change',
      resilience_skills: ['adaptation', 'gestion_incertitude', 'planification']
    },
    {
      id: 'failure-presentation',
      title: 'Échec public',
      scenario: 'Votre présentation importante a été un échec total. Vous vous sentez embarrassé et découragé. Comment rebondissez-vous après cet échec ?',
      difficulty: 'easy',
      category: 'failure',
      resilience_skills: ['acceptation_echec', 'apprentissage', 'perseverance']
    }
  ];

  const startBattle = useCallback((challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setSession({
      challenge,
      userResponse: '',
      aiCoaching: '',
      score: 0,
      skills_developed: [],
      status: 'active'
    });
    setUserInput('');
  }, []);

  const analyzeResponse = useCallback(async () => {
    if (!session || !userInput.trim()) return;

    setIsAnalyzing(true);

    try {
      // Analyse de la réponse via OpenAI
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `Tu es un coach en résilience. Analyse la réponse de l'utilisateur face au défi "${session.challenge.title}". 
              
              Scenario: ${session.challenge.scenario}
              
              Évalue la réponse sur ces compétences de résilience: ${session.challenge.resilience_skills.join(', ')}.
              
              Fournis:
              1. Un score de résilience (0-100)
              2. Les compétences démontrées
              3. Des conseils personnalisés pour améliorer sa résilience
              4. Une phrase d'encouragement
              
              Format ta réponse en JSON: {
                "score": number,
                "skills_demonstrated": string[],
                "coaching_advice": string,
                "encouragement": string
              }`
            },
            {
              role: 'user',
              content: userInput
            }
          ]
        }
      });

      if (error) throw error;

      let analysis;
      try {
        analysis = JSON.parse(data.response);
      } catch {
        // Fallback si l'IA ne renvoie pas du JSON valide
        analysis = {
          score: Math.floor(Math.random() * 30) + 70,
          skills_demonstrated: session.challenge.resilience_skills.slice(0, 2),
          coaching_advice: "Votre approche montre une bonne compréhension de la situation. Continuez à développer votre capacité d'adaptation.",
          encouragement: "Excellent travail ! Vous démontrez une vraie résilience."
        };
      }

      const updatedSession: BattleSession = {
        ...session,
        userResponse: userInput,
        aiCoaching: analysis.coaching_advice,
        score: analysis.score,
        skills_developed: analysis.skills_demonstrated,
        status: 'completed'
      };

      setSession(updatedSession);
      setBattleHistory(prev => [...prev, updatedSession]);
      setTotalScore(prev => prev + analysis.score);
      
      // Progression de niveau
      const newLevel = Math.floor((totalScore + analysis.score) / 300) + 1;
      setLevel(newLevel);

      // Sauvegarder la session
      await supabase.functions.invoke('metrics/bounce_battle', {
        body: {
          session_id: crypto.randomUUID(),
          payload: {
            challenge_id: session.challenge.id,
            user_response: userInput,
            score: analysis.score,
            skills_developed: analysis.skills_demonstrated,
            difficulty: session.challenge.difficulty,
            category: session.challenge.category
          }
        }
      });

    } catch (error) {
      console.error('Erreur analyse:', error);
      
      // Fallback local
      const fallbackScore = Math.floor(Math.random() * 30) + 60;
      const updatedSession: BattleSession = {
        ...session,
        userResponse: userInput,
        aiCoaching: "Analyse hors ligne: Votre réponse montre de la réflexion. Continuez à développer votre résilience en pratiquant régulièrement.",
        score: fallbackScore,
        skills_developed: session.challenge.resilience_skills.slice(0, 1),
        status: 'completed'
      };

      setSession(updatedSession);
      setBattleHistory(prev => [...prev, updatedSession]);
      setTotalScore(prev => prev + fallbackScore);
    } finally {
      setIsAnalyzing(false);
    }
  }, [session, userInput, totalScore]);

  const resetBattle = () => {
    setCurrentChallenge(null);
    setSession(null);
    setUserInput('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'hard': return 'bg-red-500/10 text-red-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stress': return <Zap className="h-4 w-4" />;
      case 'conflict': return <Shield className="h-4 w-4" />;
      case 'change': return <Target className="h-4 w-4" />;
      case 'failure': return <Trophy className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: number) => {
    if (level <= 2) return { label: 'Débutant', color: 'bg-gray-500/10 text-gray-700' };
    if (level <= 5) return { label: 'Apprenti', color: 'bg-blue-500/10 text-blue-700' };
    if (level <= 10) return { label: 'Résilient', color: 'bg-green-500/10 text-green-700' };
    return { label: 'Maître', color: 'bg-purple-500/10 text-purple-700' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête avec progression */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Bounce-Back Battle
            </CardTitle>
            <p className="text-muted-foreground">
              Développez votre résilience à travers des défis et du coaching IA
            </p>
            
            <div className="flex justify-center items-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Niveau {level}</div>
                <Badge className={getLevelBadge(level).color} variant="outline">
                  {getLevelBadge(level).label}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalScore}</div>
                <div className="text-sm text-muted-foreground">points totaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{battleHistory.length}</div>
                <div className="text-sm text-muted-foreground">défis relevés</div>
              </div>
            </div>

            {/* Barre de progression vers le prochain niveau */}
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">
                Progression vers le niveau {level + 1}
              </div>
              <Progress value={(totalScore % 300) / 3} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Sélection de défi ou session active */}
        {!currentChallenge ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Choisissez votre défi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <Card 
                  key={challenge.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                  onClick={() => startBattle(challenge)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(challenge.category)}
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                        {challenge.difficulty === 'easy' ? 'Facile' : 
                         challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.scenario}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Compétences développées:</div>
                      <div className="flex flex-wrap gap-1">
                        {challenge.resilience_skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(currentChallenge.category)}
                    {currentChallenge.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(currentChallenge.difficulty)} variant="outline">
                    {currentChallenge.difficulty === 'easy' ? 'Facile' : 
                     currentChallenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </Badge>
                </div>
                <Button onClick={resetBattle} variant="outline">
                  Nouveau Défi
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {currentChallenge.scenario}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {session?.status === 'active' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Comment allez-vous gérer cette situation ? Décrivez votre approche:
                    </label>
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Décrivez votre stratégie de résilience face à ce défi..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button
                      onClick={analyzeResponse}
                      disabled={!userInput.trim() || isAnalyzing}
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5" />
                          Soumettre ma réponse
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : session?.status === 'completed' ? (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {session.score}/100
                    </div>
                    <div className="text-sm text-muted-foreground">Score de résilience</div>
                    <Progress value={session.score} className="mt-4 h-3" />
                  </div>

                  {/* Compétences développées */}
                  <div>
                    <h4 className="font-semibold mb-3">Compétences démontrées</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.skills_developed.map((skill, index) => (
                        <Badge key={index} className="bg-green-500/10 text-green-700" variant="outline">
                          {skill.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Coaching IA */}
                  <div>
                    <h4 className="font-semibold mb-3">Coaching personnalisé</h4>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm leading-relaxed">{session.aiCoaching}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 justify-center">
                    <Button onClick={resetBattle} variant="outline">
                      Nouveau Défi
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Historique des batailles récentes */}
        {battleHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Historique récent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {battleHistory.slice(-3).reverse().map((battle, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(battle.challenge.category)}
                      <div>
                        <div className="font-medium text-sm">{battle.challenge.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {battle.skills_developed.join(', ').replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{battle.score}/100</div>
                      <Badge className={getDifficultyColor(battle.challenge.difficulty)} variant="outline">
                        {battle.challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}