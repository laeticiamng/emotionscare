import { useNavigate } from 'react-router-dom';
import { Brain, Target, Heart, Sparkles, Clock, Users, ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CoachProgramsPage() {
  const navigate = useNavigate();

  const programs = [
    {
      id: 'stress-management',
      title: 'Gestion du Stress',
      description: 'Apprenez à identifier et gérer votre stress quotidien',
      icon: Brain,
      duration: '4 semaines',
      sessions: 12,
      level: 'Débutant',
      color: 'bg-blue-500/10 text-blue-600',
      progress: 0,
      lessons: [
        'Comprendre le stress',
        'Techniques de respiration',
        'Méditation guidée',
        'Gestion des émotions',
      ],
    },
    {
      id: 'emotional-intelligence',
      title: 'Intelligence Émotionnelle',
      description: 'Développez votre conscience émotionnelle et empathie',
      icon: Heart,
      duration: '6 semaines',
      sessions: 18,
      level: 'Intermédiaire',
      color: 'bg-pink-500/10 text-pink-600',
      progress: 35,
      lessons: [
        'Reconnaissance des émotions',
        'Communication non-violente',
        'Empathie et écoute active',
        'Régulation émotionnelle',
      ],
    },
    {
      id: 'goal-setting',
      title: 'Atteinte des Objectifs',
      description: 'Définissez et atteignez vos objectifs personnels',
      icon: Target,
      duration: '8 semaines',
      sessions: 24,
      level: 'Avancé',
      color: 'bg-green-500/10 text-green-600',
      progress: 0,
      lessons: [
        'Définir des objectifs SMART',
        'Planification stratégique',
        'Surmonter les obstacles',
        'Maintenir la motivation',
      ],
    },
    {
      id: 'mindfulness',
      title: 'Pleine Conscience',
      description: 'Cultivez la présence et la sérénité au quotidien',
      icon: Sparkles,
      duration: '6 semaines',
      sessions: 15,
      level: 'Tous niveaux',
      color: 'bg-purple-500/10 text-purple-600',
      progress: 60,
      lessons: [
        'Introduction à la pleine conscience',
        'Méditation quotidienne',
        'Pleine conscience au travail',
        'Pratiques avancées',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/coach')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au coach
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Programmes de Coaching</h1>
              <p className="text-muted-foreground">
                Découvrez nos programmes structurés pour votre développement personnel
              </p>
            </div>
          </div>
        </header>

        {/* Programs Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((program) => {
            const Icon = program.icon;
            const isStarted = program.progress > 0;
            
            return (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${program.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{program.level}</Badge>
                  </div>
                  <CardTitle className="mt-4">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{program.sessions} sessions</span>
                    </div>
                  </div>

                  {isStarted && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Contenu du programme :</p>
                    <ul className="space-y-1">
                      {program.lessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={isStarted ? 'default' : 'outline'}
                    onClick={() => navigate(`/app/coach/programs/${program.id}`)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isStarted ? 'Continuer' : 'Commencer'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Comment fonctionnent les programmes ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nos programmes sont conçus pour vous accompagner de manière progressive dans votre développement personnel.
              Chaque programme est structuré en sessions thématiques avec des exercices pratiques et des conseils personnalisés.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">1. Choisissez</p>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez un programme adapté à vos besoins
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">2. Progressez</p>
                <p className="text-xs text-muted-foreground">
                  Suivez les sessions à votre rythme
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">3. Évoluez</p>
                <p className="text-xs text-muted-foreground">
                  Mesurez vos progrès et atteignez vos objectifs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
