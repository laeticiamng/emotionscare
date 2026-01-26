import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Heart, Brain, Zap, Compass, Check, MessageSquare, Star, 
  ChevronRight, Sparkles, Users, Clock, ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const COACH_STATS_KEY = 'coach_personality_stats';

interface CoachPersonality {
  id: string;
  name: string;
  avatar: string;
  style: 'supportive' | 'motivational' | 'analytical' | 'empathetic';
  description: string;
  specialties: string[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  sampleResponses: string[];
  stats: {
    responseTime: string;
    satisfactionRate: number;
    sessionsCompleted: number;
  };
}

interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; scores: Record<string, number> }[];
}

interface CoachPersonalitySelectorProps {
  selectedPersonality?: string;
  onSelect: (personality: CoachPersonality) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    question: 'Comment préférez-vous recevoir du soutien?',
    options: [
      { text: 'Par des mots d\'encouragement chaleureux', scores: { emma: 2, maxime: 1 } },
      { text: 'Par des défis qui me poussent à m\'améliorer', scores: { alex: 2, sophie: 1 } },
      { text: 'Par des analyses et des données concrètes', scores: { sophie: 2, alex: 1 } },
      { text: 'Par une écoute patiente et sans jugement', scores: { maxime: 2, emma: 1 } },
    ],
  },
  {
    id: '2',
    question: 'Quand vous traversez une période difficile, vous préférez:',
    options: [
      { text: 'Qu\'on me comprenne et qu\'on valide mes émotions', scores: { emma: 2, maxime: 1 } },
      { text: 'Qu\'on me motive à passer à l\'action', scores: { alex: 2, sophie: 1 } },
      { text: 'Qu\'on m\'aide à analyser la situation', scores: { sophie: 2, maxime: 1 } },
      { text: 'Qu\'on me laisse le temps de traiter', scores: { maxime: 2, emma: 1 } },
    ],
  },
  {
    id: '3',
    question: 'Votre objectif principal avec le coaching:',
    options: [
      { text: 'Mieux gérer mes émotions au quotidien', scores: { emma: 2, maxime: 1 } },
      { text: 'Atteindre des objectifs ambitieux', scores: { alex: 2, sophie: 1 } },
      { text: 'Comprendre mes patterns comportementaux', scores: { sophie: 2, emma: 1 } },
      { text: 'Trouver plus d\'équilibre et de sérénité', scores: { maxime: 2, emma: 1 } },
    ],
  },
];

const CoachPersonalitySelector: React.FC<CoachPersonalitySelectorProps> = ({
  selectedPersonality,
  onSelect
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [recommendedCoach, setRecommendedCoach] = useState<string | null>(null);
  const [_showPreview, _setShowPreview] = useState<string | null>(null);
  const [coachStats, setCoachStats] = useState<Record<string, { sessions: number; rating: number }>>({});

  const personalities: CoachPersonality[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '/avatars/emma.jpg',
      style: 'empathetic',
      description: 'Douce et compréhensive, Emma excelle dans l\'écoute active et le soutien émotionnel.',
      specialties: ['Gestion des émotions', 'Stress', 'Anxiété', 'Relations'],
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      icon: <Heart className="h-5 w-5" />,
      sampleResponses: [
        'Je comprends que tu traverses un moment difficile. C\'est tout à fait normal de ressentir ça.',
        'Tes émotions sont valides. Prends le temps qu\'il te faut pour les explorer.',
      ],
      stats: { responseTime: '< 1 sec', satisfactionRate: 94, sessionsCompleted: 12500 },
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '/avatars/alex.jpg',
      style: 'motivational',
      description: 'Énergique et inspirant, Alex vous pousse à dépasser vos limites et atteindre vos objectifs.',
      specialties: ['Motivation', 'Objectifs', 'Performance', 'Confiance en soi'],
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      icon: <Zap className="h-5 w-5" />,
      sampleResponses: [
        'Tu as en toi tout ce qu\'il faut pour réussir! Voyons comment transformer ce défi en opportunité.',
        'Chaque jour est une chance de devenir meilleur. Qu\'est-ce qu\'on attaque aujourd\'hui?',
      ],
      stats: { responseTime: '< 1 sec', satisfactionRate: 91, sessionsCompleted: 9800 },
    },
    {
      id: 'sophie',
      name: 'Sophie',
      avatar: '/avatars/sophie.jpg',
      style: 'analytical',
      description: 'Méthodique et structurée, Sophie utilise des données pour personnaliser votre parcours.',
      specialties: ['Analyse comportementale', 'Habitudes', 'Productivité', 'Planification'],
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      icon: <Brain className="h-5 w-5" />,
      sampleResponses: [
        'D\'après tes données, je remarque un pattern intéressant. Analysons ça ensemble.',
        'Créons un plan structuré avec des objectifs SMART pour maximiser tes progrès.',
      ],
      stats: { responseTime: '< 1 sec', satisfactionRate: 89, sessionsCompleted: 8200 },
    },
    {
      id: 'maxime',
      name: 'Maxime',
      avatar: '/avatars/maxime.jpg',
      style: 'supportive',
      description: 'Bienveillant et patient, Maxime vous accompagne à votre rythme sans jugement.',
      specialties: ['Développement personnel', 'Méditation', 'Mindfulness', 'Équilibre'],
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      icon: <Compass className="h-5 w-5" />,
      sampleResponses: [
        'Prenons le temps qu\'il faut. Il n\'y a pas de bonne ou mauvaise vitesse.',
        'L\'important n\'est pas la destination, mais le chemin. Comment te sens-tu sur ce chemin?',
      ],
      stats: { responseTime: '< 1 sec', satisfactionRate: 96, sessionsCompleted: 10500 },
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem(COACH_STATS_KEY);
    if (stored) setCoachStats(JSON.parse(stored));
  }, []);

  const handleQuizAnswer = (scores: Record<string, number>) => {
    const newScores = { ...quizScores };
    Object.entries(scores).forEach(([coach, score]) => {
      newScores[coach] = (newScores[coach] || 0) + score;
    });
    setQuizScores(newScores);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Quiz complete - find recommended coach
      const recommended = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setRecommendedCoach(recommended);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScores({});
    setRecommendedCoach(null);
    setShowQuiz(false);
  };

  const handleSelect = (personality: CoachPersonality) => {
    // Update stats
    const newStats = {
      ...coachStats,
      [personality.id]: {
        sessions: (coachStats[personality.id]?.sessions || 0) + 1,
        rating: coachStats[personality.id]?.rating || 0,
      }
    };
    setCoachStats(newStats);
    localStorage.setItem(COACH_STATS_KEY, JSON.stringify(newStats));
    
    onSelect(personality);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Choisissez votre coach personnel</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez la personnalité qui correspond le mieux à vos besoins
        </p>
        
        {/* Quiz button */}
        <Button 
          variant="outline" 
          onClick={() => setShowQuiz(true)}
          className="mt-2 gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Trouver mon coach idéal (quiz)
        </Button>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Trouvez votre coach idéal
            </DialogTitle>
            <DialogDescription>
              Répondez à quelques questions pour découvrir le coach qui vous correspond
            </DialogDescription>
          </DialogHeader>
          
          {!recommendedCoach ? (
            <div className="space-y-6">
              <Progress value={((quizStep + 1) / QUIZ_QUESTIONS.length) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Question {quizStep + 1} sur {QUIZ_QUESTIONS.length}
              </p>
              
              <div className="space-y-4">
                <h4 className="font-medium">{QUIZ_QUESTIONS[quizStep].question}</h4>
                <RadioGroup onValueChange={(val) => {
                  const scores = QUIZ_QUESTIONS[quizStep].options[parseInt(val)].scores;
                  handleQuizAnswer(scores);
                }}>
                  {QUIZ_QUESTIONS[quizStep].options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                      <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl">🎉</div>
              <h4 className="text-lg font-semibold">Votre coach idéal est...</h4>
              {(() => {
                const coach = personalities.find(p => p.id === recommendedCoach);
                if (!coach) return null;
                return (
                  <Card className={`${coach.bgColor} border-2`}>
                    <CardContent className="pt-6">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={coach.avatar} alt={coach.name} />
                        <AvatarFallback className={coach.bgColor}>
                          {coach.icon}
                        </AvatarFallback>
                      </Avatar>
                      <h5 className="text-xl font-bold">{coach.name}</h5>
                      <p className="text-sm text-muted-foreground mt-2">{coach.description}</p>
                      <Button 
                        className="mt-4 w-full" 
                        onClick={() => {
                          handleSelect(coach);
                          resetQuiz();
                        }}
                      >
                        Choisir {coach.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })()}
              <Button variant="ghost" onClick={resetQuiz}>
                Refaire le quiz
              </Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Coach grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality) => {
          const isSelected = selectedPersonality === personality.id;
          const isRecommended = recommendedCoach === personality.id;
          const userStats = coachStats[personality.id];
          
          return (
            <motion.div
              key={personality.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'ring-2 ring-primary border-primary shadow-lg' 
                    : 'hover:border-muted-foreground/30 hover:shadow-md'
                } ${isRecommended && !isSelected ? 'ring-1 ring-yellow-500' : ''}`}
                onClick={() => handleSelect(personality)}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 text-white gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Recommandé
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className={`h-14 w-14 ring-2 ring-offset-2 ring-offset-background ${isSelected ? 'ring-primary' : 'ring-transparent'}`}>
                      <AvatarImage src={personality.avatar} alt={personality.name} />
                      <AvatarFallback className={personality.bgColor}>
                        {personality.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {personality.name}
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </CardTitle>
                      <Badge variant="secondary" className={`text-xs ${personality.bgColor} ${personality.color}`}>
                        {personality.style === 'empathetic' && 'Empathique'}
                        {personality.style === 'motivational' && 'Motivant'}
                        {personality.style === 'analytical' && 'Analytique'}
                        {personality.style === 'supportive' && 'Bienveillant'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {personality.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {personality.stats.satisfactionRate}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {(personality.stats.sessionsCompleted / 1000).toFixed(1)}k sessions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {personality.stats.responseTime}
                    </div>
                  </div>
                  
                  {/* Specialties */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Spécialités :</p>
                    <div className="flex flex-wrap gap-1">
                      {personality.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Preview button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full gap-2" onClick={(e) => e.stopPropagation()}>
                        <MessageSquare className="h-4 w-4" />
                        Voir un aperçu
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={personality.bgColor}>
                              {personality.icon}
                            </AvatarFallback>
                          </Avatar>
                          Aperçu de {personality.name}
                        </DialogTitle>
                        <DialogDescription>
                          Voici comment {personality.name} pourrait vous répondre
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {personality.sampleResponses.map((response, i) => (
                          <div key={i} className={`p-4 rounded-lg ${personality.bgColor}`}>
                            <p className="text-sm">{response}</p>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => handleSelect(personality)} className="w-full">
                        Choisir {personality.name}
                      </Button>
                    </DialogContent>
                  </Dialog>
                  
                  {/* User's history with this coach */}
                  {userStats && userStats.sessions > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Vous avez eu {userStats.sessions} session{userStats.sessions > 1 ? 's' : ''} avec {personality.name}
                      </p>
                    </div>
                  )}
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2 bg-primary/10 rounded-md"
                    >
                      <p className="text-xs text-primary font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Coach sélectionné
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Vous pourrez changer de coach à tout moment dans vos paramètres.
        </p>
      </div>
    </div>
  );
};

export default CoachPersonalitySelector;
