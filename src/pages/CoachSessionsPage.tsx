import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, Clock, CheckCircle, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CoachSessionsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const sessions = [
    {
      id: '1',
      title: 'Comprendre vos émotions',
      program: 'Gestion du Stress',
      date: new Date(2025, 9, 1),
      duration: 30,
      status: 'completed',
      type: 'video',
      notes: 'Excellente session, beaucoup appris sur la reconnaissance émotionnelle.',
    },
    {
      id: '2',
      title: 'Techniques de respiration',
      program: 'Gestion du Stress',
      date: new Date(2025, 9, 3),
      duration: 25,
      status: 'completed',
      type: 'audio',
      notes: 'La technique 4-7-8 fonctionne très bien pour moi.',
    },
    {
      id: '3',
      title: 'Méditation guidée matinale',
      program: 'Pleine Conscience',
      date: new Date(2025, 9, 5),
      duration: 20,
      status: 'upcoming',
      type: 'video',
      notes: null,
    },
    {
      id: '4',
      title: 'Gestion des pensées négatives',
      program: 'Intelligence Émotionnelle',
      date: new Date(2025, 9, 8),
      duration: 35,
      status: 'upcoming',
      type: 'chat',
      notes: null,
    },
    {
      id: '5',
      title: 'Définir vos objectifs SMART',
      program: 'Atteinte des Objectifs',
      date: new Date(2025, 9, 10),
      duration: 40,
      status: 'upcoming',
      type: 'video',
      notes: null,
    },
  ];

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length;

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-5xl space-y-6">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Mes Sessions</h1>
                <p className="text-muted-foreground">
                  Historique et prochaines sessions de coaching
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sessions totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{sessions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Complétées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{completedCount}</p>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                À venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{upcomingCount}</p>
                <PlayCircle className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Toutes ({sessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Complétées ({completedCount})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              À venir ({upcomingCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-10">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-center text-muted-foreground">
                  Aucune session dans cette catégorie
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{session.title}</CardTitle>
                        {session.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <CardDescription>{session.program}</CardDescription>
                    </div>
                    <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                      {session.status === 'completed' ? 'Complétée' : 'À venir'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(session.date, 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="capitalize">{session.type}</span>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{session.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {session.status === 'completed' ? (
                      <>
                        <Button variant="outline" className="flex-1">
                          Revoir la session
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Modifier les notes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="flex-1">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Commencer
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Reporter
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* CTA Card */}
        <Card>
          <CardHeader>
            <CardTitle>Planifier une nouvelle session</CardTitle>
            <CardDescription>
              Choisissez un programme et réservez votre prochaine session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/app/coach/programs')}>
              Explorer les programmes
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
