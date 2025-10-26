// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Heart, Brain } from 'lucide-react';

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const session = {
    id,
    type: 'Méditation Guidée',
    duration: '15 min',
    date: '2025-10-26',
    time: '10:30',
    score: 8.5,
    mood: 'Calme',
    energy: 7.5,
    notes: 'Session très apaisante, bonne concentration',
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/sessions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <header>
          <h1 className="text-3xl font-bold">{session.type}</h1>
          <p className="text-muted-foreground">Session du {session.date} à {session.time}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Durée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{session.duration}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Score Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{session.score}/10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Humeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{session.mood}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Énergie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{session.energy}/10</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notes de Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{session.notes}</p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/app/coach/sessions')} className="flex-1">
            Refaire cette Session
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/sessions')} className="flex-1">
            Voir Toutes les Sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
