
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Brain, Target, TrendingUp, Star, Calendar, User } from 'lucide-react';
import CoachChatContainer from '@/components/coach/CoachChatContainer';
import ConversationHistory from '@/components/coach/ConversationHistory';
import { useToast } from '@/hooks/use-toast';

const CoachPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Mock coach stats
  const coachStats = {
    totalConversations: 28,
    averageSessionLength: '12 min',
    helpfulnessRating: 4.8,
    streakDays: 14
  };

  // Mock recommended exercises
  const recommendedExercises = [
    {
      id: '1',
      title: 'Respiration 4-7-8',
      description: 'Technique pour réduire le stress instantanément',
      duration: '5 min',
      difficulty: 'Facile',
      category: 'Respiration'
    },
    {
      id: '2',
      title: 'Méditation guidée du matin',
      description: 'Commencez votre journée avec sérénité',
      duration: '10 min',
      difficulty: 'Débutant',
      category: 'Méditation'
    },
    {
      id: '3',
      title: 'Journal de gratitude',
      description: 'Notez 3 choses positives de votre journée',
      duration: '5 min',
      difficulty: 'Facile',
      category: 'Réflexion'
    }
  ];

  // Mock progress tracking
  const progressData = [
    { week: 'Sem 1', score: 65 },
    { week: 'Sem 2', score: 72 },
    { week: 'Sem 3', score: 78 },
    { week: 'Sem 4', score: 82 },
  ];

  const handleStartExercise = (exerciseId: string) => {
    const exercise = recommendedExercises.find(ex => ex.id === exerciseId);
    toast({
      title: 'Exercice démarré',
      description: `Début de "${exercise?.title}"`,
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    toast({
      title: 'Conversation chargée',
      description: 'Reprise de votre conversation précédente.',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach IA Personnel</h1>
          <p className="text-muted-foreground">
            Votre accompagnateur intelligent pour le bien-être émotionnel
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            En ligne
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat">Discussion</TabsTrigger>
          <TabsTrigger value="exercises">Exercices</TabsTrigger>
          <TabsTrigger value="progress">Progrès</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <CoachChatContainer />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conseils Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Gérer le stress
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Confiance en soi
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Planifier ma journée
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Conversations</span>
                    <span className="font-medium">{coachStats.totalConversations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Durée moyenne</span>
                    <span className="font-medium">{coachStats.averageSessionLength}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Évaluation</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-medium">{coachStats.helpfulnessRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Exercices Recommandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendedExercises.map((exercise) => (
                  <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{exercise.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {exercise.duration}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleStartExercise(exercise.id)}
                        className="w-full"
                        size="sm"
                      >
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coachStats.totalConversations}</div>
                <p className="text-xs text-muted-foreground">
                  Total depuis le début
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coachStats.averageSessionLength}</div>
                <p className="text-xs text-muted-foreground">
                  Par session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coachStats.helpfulnessRating}/5</div>
                <p className="text-xs text-muted-foreground">
                  Évaluation moyenne
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Série</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{coachStats.streakDays} jours</div>
                <p className="text-xs text-muted-foreground">
                  Utilisation quotidienne
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.map((week, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-16">{week.week}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${week.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{week.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ConversationHistory onSelectConversation={handleSelectConversation} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Insights Personnalisés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Patterns identifiés</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Vous consultez le coach principalement en fin d'après-midi</li>
                    <li>• Vos sujets récurrents: gestion du stress et confiance</li>
                    <li>• Meilleure réceptivité aux exercices de respiration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Pour optimiser votre bien-être</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Planifiez une session matinale pour commencer la journée</li>
                    <li>• Intégrez les exercices de respiration dans votre routine</li>
                    <li>• Explorez les techniques de méditation guidée</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachPage;
