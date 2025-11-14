import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  Play,
  BookOpen,
  Target,
  Sparkles,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getProgramById } from '@/data/coachPrograms';
import { useToast } from '@/hooks/use-toast';

export default function CoachProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const program = programId ? getProgramById(programId) : undefined;

  if (!program) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Programme introuvable</h1>
          <Button onClick={() => navigate('/app/coach/programs')}>
            Retour aux programmes
          </Button>
        </div>
      </main>
    );
  }

  const Icon = program.icon;
  const completedLessons = program.lessons.filter(l => l.completed).length;
  const progressPercentage = Math.round((completedLessons / program.lessons.length) * 100);

  const handleStartLesson = (lessonId: string) => {
    toast({
      title: 'Leçon en cours de chargement',
      description: 'La leçon va démarrer dans un instant...',
    });
    // TODO: Navigate to lesson detail page
  };

  const handleEnroll = () => {
    toast({
      title: 'Inscription réussie !',
      description: `Vous êtes maintenant inscrit au programme "${program.title}".`,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/coach/programs')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tous les programmes
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${program.color}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold">{program.title}</h1>
                  <Badge variant="outline">{program.level}</Badge>
                </div>
                <p className="max-w-2xl text-muted-foreground">
                  {program.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{program.lessons.length} leçons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{program.sessions} sessions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={handleEnroll} className="w-full md:w-auto">
                <Play className="mr-2 h-5 w-5" />
                {program.progress > 0 ? 'Continuer' : 'Commencer'}
              </Button>
              <Button variant="outline" size="lg" className="w-full md:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Télécharger le plan
              </Button>
            </div>
          </div>

          {/* Progress */}
          {program.progress > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Votre progression</span>
                    <span className="text-muted-foreground">
                      {completedLessons} / {program.lessons.length} leçons complétées
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Vous avez complété {progressPercentage}% du programme
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="lessons">Leçons</TabsTrigger>
            <TabsTrigger value="benefits">Bénéfices</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>À propos de ce programme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {program.longDescription}
                </p>

                {program.prerequisites && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex gap-2">
                      <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          Prérequis
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-200">
                          {program.prerequisites}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ce que vous allez apprendre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {program.lessons.slice(0, 6).map((lesson) => (
                    <div key={lesson.id} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programme des leçons</CardTitle>
                <CardDescription>
                  {program.lessons.length} leçons pour maîtriser {program.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {program.lessons.map((lesson, index) => (
                    <AccordionItem key={lesson.id} value={lesson.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Leçon {index + 1}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {lesson.duration}
                              </Badge>
                            </div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-8 space-y-4 border-l-2 border-primary/20 pl-6">
                          {/* Introduction */}
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {lesson.content.introduction}
                            </p>
                          </div>

                          {/* Objectives */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Objectifs</h4>
                            <ul className="space-y-1">
                              {lesson.content.objectives.map((obj, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                  <span className="text-muted-foreground">{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Activities */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Activités</h4>
                            <div className="space-y-2">
                              {lesson.content.activities.map((activity, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg border bg-card/50 p-3"
                                >
                                  <div className="mb-1 flex items-center justify-between">
                                    <p className="text-sm font-medium">{activity.title}</p>
                                    <Badge variant="outline" className="text-xs">
                                      {activity.duration}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Reflection */}
                          <div className="rounded-lg bg-primary/5 p-4">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Réflexion
                            </h4>
                            <p className="text-sm italic text-muted-foreground">
                              {lesson.content.reflection}
                            </p>
                          </div>

                          {/* Resources */}
                          {lesson.content.resources && (
                            <div>
                              <h4 className="mb-2 text-sm font-semibold">Ressources</h4>
                              <ul className="space-y-1">
                                {lesson.content.resources.map((resource, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">{resource}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <Button
                            onClick={() => handleStartLesson(lesson.id)}
                            className="w-full"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            {lesson.completed ? 'Revoir la leçon' : 'Commencer cette leçon'}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bénéfices de ce programme</CardTitle>
                <CardDescription>
                  Ce que vous gagnerez en complétant ce programme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {program.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border bg-card/50 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <p className="font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Témoignages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-card/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-semibold text-primary">MJ</span>
                    </div>
                    <div>
                      <p className="font-medium">Marie J.</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 semaines</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Ce programme m'a vraiment aidé à mieux comprendre mes émotions et à développer des stratégies concrètes. Je me sens beaucoup plus sereine au quotidien."
                  </p>
                </div>

                <div className="rounded-lg border bg-card/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-semibold text-primary">TL</span>
                    </div>
                    <div>
                      <p className="font-medium">Thomas L.</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 mois</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Les exercices pratiques sont excellents et faciles à intégrer dans ma routine quotidienne. Je recommande vivement ce programme !"
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
