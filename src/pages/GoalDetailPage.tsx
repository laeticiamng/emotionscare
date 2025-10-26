// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Target, Calendar, TrendingUp } from 'lucide-react';

export default function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goal = {
    id,
    title: 'Méditer 5 fois par semaine',
    description: 'Pratiquer la méditation guidée au moins 5 fois par semaine pour améliorer mon bien-être mental',
    progress: 60,
    deadline: '2025-11-30',
    category: 'Bien-être',
    startDate: '2025-10-01',
    milestones: [
      { date: '2025-10-15', label: 'Premier mois', completed: true },
      { date: '2025-11-01', label: 'Deuxième mois', completed: false },
      { date: '2025-11-30', label: 'Objectif final', completed: false },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/goals')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{goal.title}</h1>
            <Badge variant="secondary">{goal.category}</Badge>
          </div>
          <p className="text-muted-foreground">{goal.description}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression Globale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{goal.progress}%</span>
              <span className="text-sm text-muted-foreground">
                Début: {goal.startDate} • Échéance: {goal.deadline}
              </span>
            </div>
            <Progress value={goal.progress} className="h-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Jalons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goal.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    milestone.completed ? 'bg-success/10 border-success' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-success text-success-foreground' : 'bg-muted'
                    }`}>
                      {milestone.completed ? '✓' : index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{milestone.label}</p>
                      <p className="text-sm text-muted-foreground">{milestone.date}</p>
                    </div>
                  </div>
                  {milestone.completed && (
                    <Badge variant="secondary">Complété</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/app/scan')} className="flex-1">
            Continuer la Progression
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/goals')} className="flex-1">
            Voir Tous les Objectifs
          </Button>
        </div>
      </div>
    </div>
  );
}
