// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Users, Clock, Plus } from 'lucide-react';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const [challenges] = useState([
    { id: 1, title: '7 Jours de Méditation', participants: 234, progress: 42, endDate: '2025-11-05', active: true },
    { id: 2, title: 'Challenge Bien-être', participants: 89, progress: 65, endDate: '2025-11-10', active: true },
    { id: 3, title: 'Maître VR', participants: 156, progress: 20, endDate: '2025-11-20', active: false },
  ]);

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Défis Communautaires</h1>
            <p className="text-muted-foreground">Participez et progressez ensemble</p>
          </div>
          <Button onClick={() => navigate('/app/challenges/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un Défi
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Actifs</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{challenges.filter(c => c.active).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">479</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Complétés</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Défis Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="space-y-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => navigate(`/app/challenges/${challenge.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {challenge.title}
                        {challenge.active && <Badge variant="default">Actif</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-1" />
                        {challenge.participants} participants • Fin: {challenge.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Votre progression</span>
                      <span className="font-medium">{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
