// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';

export default function GoalsPage() {
  const navigate = useNavigate();
  const [goals] = useState([
    { id: 1, title: 'Méditer 5 fois par semaine', progress: 60, deadline: '2025-11-30', category: 'Bien-être' },
    { id: 2, title: 'Améliorer score émotionnel', progress: 75, deadline: '2025-12-15', category: 'Émotions' },
    { id: 3, title: 'Compléter 10 sessions VR', progress: 40, deadline: '2025-11-20', category: 'Immersion' },
  ]);

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mes Objectifs</h1>
            <p className="text-muted-foreground">Suivez votre progression</p>
          </div>
          <Button onClick={() => navigate('/app/goals/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Objectif
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Actifs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Objectifs en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="space-y-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => navigate(`/app/goals/${goal.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">Échéance: {goal.deadline}</p>
                    </div>
                    <Badge variant="secondary">{goal.category}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
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
