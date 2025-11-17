import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft, Play, Sparkles, Filter, Search, Star, Check, Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coachPrograms } from '@/data/coachPrograms';

const LEVEL_COLORS: Record<string, string> = {
  'Débutant': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'Intermédiaire': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'Avancé': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
};

export default function CoachProgramsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredPrograms = (coachPrograms || []).filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const activePrograms = (coachPrograms || []).filter((p) => p.progress > 0);
  const completedPrograms = (coachPrograms || []).filter((p) => p.progress === 100);

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/coach')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au coach
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Programmes de Coaching</h1>
              <p className="text-muted-foreground">
                Découvrez nos programmes structurés pour votre développement personnel
              </p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Programmes totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(coachPrograms || []).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                En cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activePrograms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Complétés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedPrograms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Progression moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(((coachPrograms || []).reduce((sum, p) => sum + p.progress, 0) / ((coachPrograms || []).length || 1)))}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un programme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel('all')}
            >
              <Filter className="w-3 h-3 mr-1" />
              Tous les niveaux
            </Button>
            {['Débutant', 'Intermédiaire', 'Avancé'].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous les programmes</TabsTrigger>
            <TabsTrigger value="active">En cours ({activePrograms.length})</TabsTrigger>
            <TabsTrigger value="completed">Complétés ({completedPrograms.length})</TabsTrigger>
          </TabsList>

          {/* Tous les programmes */}
          <TabsContent value="all">
            {filteredPrograms.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPrograms.map((program) => {
                  const Icon = program.icon;
                  const isStarted = program.progress > 0;
                  const isCompleted = program.progress === 100;

                  return (
                    <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${program.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && <Check className="w-5 h-5 text-green-600" />}
                            <Badge className={LEVEL_COLORS[program.level] || 'bg-slate-200'}>
                              {program.level}
                            </Badge>
                          </div>
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
                          {program.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{program.rating}</span>
                            </div>
                          )}
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
                            {program.lessons?.slice(0, 3).map((lesson) => (
                              <li key={lesson.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                                <span>{lesson.title}</span>
                              </li>
                            ))}
                            {program.lessons?.length > 3 && (
                              <li className="text-sm text-muted-foreground">
                                + {program.lessons.length - 3} autres leçons
                              </li>
                            )}
                          </ul>
                        </div>

                        <Button
                          className="w-full"
                          variant={isStarted ? 'default' : 'outline'}
                          onClick={() => navigate(`/app/coach/programs/${program.id}`)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {isCompleted ? 'Revoir' : isStarted ? `Continuer (${program.progress}%)` : 'Commencer'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Aucun programme ne correspond à votre recherche
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Programmes en cours */}
          <TabsContent value="active">
            {activePrograms.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {activePrograms.map((program) => {
                  const Icon = program.icon;
                  return (
                    <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${program.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge className={LEVEL_COLORS[program.level] || 'bg-slate-200'}>
                            {program.level}
                          </Badge>
                        </div>
                        <CardTitle className="mt-4">{program.title}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{program.progress}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" />
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => navigate(`/app/coach/programs/${program.id}`)}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Continuer le programme
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-600 dark:text-slate-400">
                    Aucun programme en cours. Commencez-en un!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Programmes complétés */}
          <TabsContent value="completed">
            {completedPrograms.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {completedPrograms.map((program) => {
                  const Icon = program.icon;
                  return (
                    <Card key={program.id} className="overflow-hidden border-green-200 dark:border-green-800">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${program.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <CardTitle className="mt-4">{program.title}</CardTitle>
                        <CardDescription>Complété le 15 novembre 2025</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full">
                          📊 Voir le certificat
                        </Button>
                        <Button variant="outline" className="w-full">
                          Revoir le programme
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-600 dark:text-slate-400">
                    Aucun programme complété. Commencez votre parcours!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

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
