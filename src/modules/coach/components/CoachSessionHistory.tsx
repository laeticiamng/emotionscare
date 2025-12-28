/**
 * CoachSessionHistory - Historique des sessions de coaching
 */

import { memo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { History, Clock, MessageSquare, Star, ChevronRight } from 'lucide-react';

interface CoachSessionRecord {
  id: string;
  created_at: string;
  updated_at: string;
  coach_personality: string | null;
  session_duration: number | null;
  messages_count: number | null;
  user_satisfaction: number | null;
  session_notes: string | null;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return `${seconds}s`;
  return `${mins} min`;
}

function personalityLabel(p: string | null): string {
  const map: Record<string, string> = {
    empathetic: 'Empathique',
    analytical: 'Analytique',
    motivational: 'Motivant',
    zen: 'Zen',
    energetic: 'Énergique',
  };
  return p ? map[p] ?? p : 'Standard';
}

export const CoachSessionHistory = memo(function CoachSessionHistory() {
  const [selectedSession, setSelectedSession] = useState<CoachSessionRecord | null>(null);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['coach-sessions-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ai_coach_sessions')
        .select('id, created_at, updated_at, coach_personality, session_duration, messages_count, user_satisfaction, session_notes')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data ?? []) as CoachSessionRecord[];
    },
    staleTime: 60_000,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          Historique
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Sessions passées
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : !sessions?.length ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Aucune session passée. Démarre une conversation pour commencer !
            </div>
          ) : selectedSession ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSession(null)}
                className="mb-2"
              >
                ← Retour à la liste
              </Button>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {format(new Date(selectedSession.created_at), 'PPP à HH:mm', { locale: fr })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Personnalité</span>
                    <Badge variant="secondary">{personalityLabel(selectedSession.coach_personality)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(selectedSession.session_duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Messages</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {selectedSession.messages_count ?? 0}
                    </span>
                  </div>
                  {selectedSession.user_satisfaction && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Satisfaction</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {selectedSession.user_satisfaction}/5
                      </span>
                    </div>
                  )}
                  {selectedSession.session_notes && (
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="mt-1 text-sm">{selectedSession.session_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="w-full rounded-lg border bg-card p-3 text-left transition hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {format(new Date(session.created_at), 'PPP', { locale: fr })}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(session.session_duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messages_count ?? 0} msg
                    </span>
                    {session.user_satisfaction && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {session.user_satisfaction}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});
