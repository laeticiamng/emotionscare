import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, History, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import PageRoot from '@/components/common/PageRoot';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { routes } from '@/lib/routes';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  fetchEmotionSessions,
  type EmotionPlanRecord,
  type EmotionSessionRecord,
} from '@/features/emotion-sessions/emotionSessionApi';
import { emotionWheelOptions } from '@/features/emotion-sessions/EmotionWheel';

const toDisplayIntensity = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—';
  return Math.round(value * 10);
};

export default function EmotionSessionHistoryPage() {
  usePageSEO({
    title: 'Historique des sessions émotionnelles',
    description: 'Consultez vos sessions émotionnelles passées et leurs recommandations.',
  });

  const [sessions, setSessions] = useState<EmotionSessionRecord[]>([]);
  const [plans, setPlans] = useState<EmotionPlanRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchEmotionSessions();
        if (!isMounted) return;
        setSessions(data.sessions);
        setPlans(data.plans);
        setSelectedId(data.sessions[0]?.id ?? null);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Impossible de charger vos sessions.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSessions = useMemo(() => {
    if (selectedFilter === 'all') return sessions;
    return sessions.filter(session => session.primary_emotion === selectedFilter);
  }, [sessions, selectedFilter]);

  const selectedSession = useMemo(
    () => filteredSessions.find(session => session.id === selectedId) ?? null,
    [filteredSessions, selectedId],
  );

  const sessionPlan = useMemo(
    () => plans.find(plan => plan.session_id === selectedSession?.id) ?? null,
    [plans, selectedSession],
  );

  return (
    <PageRoot>
      <section className="container mx-auto px-4 py-10 space-y-8" aria-labelledby="emotion-history-heading">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <History className="h-7 w-7 text-primary" aria-hidden="true" />
            <div>
              <h1 id="emotion-history-heading" className="text-3xl font-semibold">
                Historique des sessions
              </h1>
              <p className="text-sm text-muted-foreground">
                Retrouvez vos analyses et plans personnalisés.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to={routes.b2c.emotionSessionsNew()}>Nouvelle session</Link>
          </Button>
        </header>

        {errorMessage && (
          <Alert variant="destructive" role="alert">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filtrer par émotion :</span>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {emotionWheelOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune session enregistrée pour ce filtre.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Vos sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[420px]">
                  <div className="space-y-2 p-4">
                    {filteredSessions.map(session => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => setSelectedId(session.id)}
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          selectedId === session.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold capitalize">
                            {session.primary_emotion ?? 'non défini'}
                          </span>
                          <Badge variant="secondary">{toDisplayIntensity(session.intensity)}/10</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" aria-hidden="true" />
                          {format(new Date(session.created_at), 'dd MMM yyyy · HH:mm')}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détail de la session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedSession ? (
                  <div className="rounded-lg border border-dashed border-muted-foreground/40 p-6 text-sm text-muted-foreground">
                    Sélectionnez une session pour afficher le détail complet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="capitalize">{selectedSession.primary_emotion ?? 'non défini'}</Badge>
                      <Badge variant="secondary">{toDisplayIntensity(selectedSession.intensity)}/10</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(selectedSession.created_at), 'dd MMM yyyy · HH:mm')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Émotions détectées</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {selectedSession.detected_emotions.map(emotion => (
                          <li key={emotion.label} className="flex items-center justify-between">
                            <span className="capitalize">{emotion.label}</span>
                            <span>{Math.round(emotion.intensity * 100)}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {sessionPlan && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Plan personnalisé</h3>
                        <div className="space-y-3">
                          {sessionPlan.recommendations.map((rec, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{rec.title ?? rec.type}</span>
                                {rec.priority && (
                                  <Badge variant="secondary">Priorité {rec.priority}</Badge>
                                )}
                              </div>
                              {rec.description && (
                                <p className="text-sm text-muted-foreground mt-2">{rec.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Contexte</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedSession.context_tags ?? []).length === 0 ? (
                          <span className="text-sm text-muted-foreground">Aucun contexte renseigné.</span>
                        ) : (
                          selectedSession.context_tags.map(tag => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </PageRoot>
  );
}
