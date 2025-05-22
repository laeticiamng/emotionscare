
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Video, CheckCircle, Play, AlertCircle } from 'lucide-react';

const DocFlamePage = () => {
  const [activeTab, setActiveTab] = useState('fiches');
  
  // Mock data
  const fiches = [
    {
      id: 1,
      title: "Les bases de la musicothérapie",
      category: "Musicothérapie",
      difficulty: "Débutant",
      progress: 100,
      completed: true,
      time: "10 min"
    },
    {
      id: 2,
      title: "Comprendre les émotions négatives",
      category: "Psychologie",
      difficulty: "Intermédiaire",
      progress: 60,
      completed: false,
      time: "15 min"
    },
    {
      id: 3,
      title: "Techniques de relaxation express",
      category: "Bien-être",
      difficulty: "Débutant",
      progress: 0,
      completed: false,
      time: "8 min"
    },
    {
      id: 4,
      title: "L'impact de la musique sur le cerveau",
      category: "Neurosciences",
      difficulty: "Avancé",
      progress: 25,
      completed: false,
      time: "20 min"
    }
  ];
  
  const videos = [
    {
      id: 1,
      title: "Introduction à la musicothérapie",
      category: "Musicothérapie",
      thumbnail: "https://picsum.photos/300/200",
      duration: "8:32",
      viewed: true
    },
    {
      id: 2,
      title: "Exercices de respiration pour la gestion du stress",
      category: "Bien-être",
      thumbnail: "https://picsum.photos/301/200",
      duration: "12:15",
      viewed: false
    },
    {
      id: 3,
      title: "Comment la musique affecte nos émotions",
      category: "Neurosciences",
      thumbnail: "https://picsum.photos/302/200",
      duration: "15:47",
      viewed: false
    }
  ];
  
  const quizzes = [
    {
      id: 1,
      title: "Bases de la musicothérapie",
      category: "Musicothérapie",
      questions: 10,
      completed: true,
      score: 8
    },
    {
      id: 2,
      title: "Reconnaître les émotions",
      category: "Psychologie",
      questions: 15,
      completed: false,
      score: null
    },
    {
      id: 3,
      title: "Techniques de relaxation",
      category: "Bien-être",
      questions: 8,
      completed: false,
      score: null
    }
  ];
  
  const renderBadgeForCategory = (category) => {
    switch (category) {
      case 'Musicothérapie':
        return <Badge className="bg-blue-500">Musicothérapie</Badge>;
      case 'Psychologie':
        return <Badge className="bg-purple-500">Psychologie</Badge>;
      case 'Bien-être':
        return <Badge className="bg-green-500">Bien-être</Badge>;
      case 'Neurosciences':
        return <Badge className="bg-amber-500">Neurosciences</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">DocFlame</h1>
        <p className="text-muted-foreground mb-6">Centre de ressources et d'apprentissage</p>
        
        <Tabs defaultValue="fiches" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="fiches">Fiches</TabsTrigger>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fiches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fiches.map((fiche) => (
                <Card key={fiche.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{fiche.title}</CardTitle>
                        <CardDescription className="mt-1">{fiche.time} de lecture</CardDescription>
                      </div>
                      {renderBadgeForCategory(fiche.category)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-muted-foreground">Difficulté: {fiche.difficulty}</span>
                      <span className="flex items-center">
                        {fiche.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500">Complété</span>
                          </>
                        ) : (
                          `${fiche.progress}% complété`
                        )}
                      </span>
                    </div>
                    <Progress value={fiche.progress} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button variant={fiche.completed ? "outline" : "default"} className="w-full">
                      {fiche.progress > 0 && !fiche.completed ? "Continuer" : "Lire"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-0.5 px-2 rounded">
                      {video.duration}
                    </div>
                    {video.viewed && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/80 text-primary">Visionné</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{renderBadgeForCategory(video.category)}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {video.viewed ? "Revoir" : "Regarder"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription className="mt-1">{quiz.questions} questions</CardDescription>
                      </div>
                      {renderBadgeForCategory(quiz.category)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {quiz.completed ? (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-green-500">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Quiz complété
                        </span>
                        <Badge variant="outline" className="text-lg">
                          {quiz.score}/{quiz.questions}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Vous n'avez pas encore tenté ce quiz
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant={quiz.completed ? "outline" : "default"} className="w-full">
                      {quiz.completed ? "Refaire le quiz" : "Démarrer"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default DocFlamePage;
