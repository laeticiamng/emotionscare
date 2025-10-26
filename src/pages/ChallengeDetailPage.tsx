// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Users, Calendar, Trophy } from 'lucide-react';

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const challenge = {
    id,
    title: '7 Jours de Méditation',
    description: 'Méditez chaque jour pendant 7 jours consécutifs',
    participants: 234,
    progress: 42,
    endDate: '2025-11-05',
    joined: true,
    leaderboard: [
      { rank: 1, name: 'Alice', score: 100 },
      { rank: 2, name: 'Bob', score: 95 },
      { rank: 3, name: 'Charlie', score: 90 },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/challenges')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <Badge variant="default">Actif</Badge>
          </div>
          <p className="text-muted-foreground">{challenge.description}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{challenge.participants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fin</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{challenge.endDate}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votre Rang</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#42</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Votre Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={challenge.progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {challenge.progress}% complété • 3 jours sur 7
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {challenge.leaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      #{entry.rank}
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <Badge variant="secondary">{entry.score} pts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {challenge.joined ? (
          <Button className="w-full" onClick={() => navigate('/app/meditation')}>
            Continuer le Défi
          </Button>
        ) : (
          <Button className="w-full">
            Rejoindre le Défi
          </Button>
        )}
      </div>
    </div>
  );
}
