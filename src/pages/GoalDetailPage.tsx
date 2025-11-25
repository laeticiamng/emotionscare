import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Target, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { useGoals, type Goal } from '@/hooks/useGoals';

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchGoalById, completeGoal } = useGoals();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadGoal = async () => {
      setIsLoading(true);
      const result = await fetchGoalById(id);
      if (!result) {
        setError("Objectif introuvable ou inaccessible.");
        setGoal(null);
      } else {
        setGoal(result);
        setError(null);
      }
      setIsLoading(false);
    };

    void loadGoal();
  }, [id, fetchGoalById]);

  const handleComplete = async () => {
    if (!goal?.id) return;
    const updated = await completeGoal(goal.id);
    if (updated) {
      setGoal(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6" data-testid="page-root">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement de l'objectif...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-background p-6" data-testid="page-root">
        <div className="max-w-4xl mx-auto space-y-4">
          <Button variant="ghost" onClick={() => navigate('/app/goals')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Alert variant="destructive">
            <AlertDescription>{error ?? "Aucun objectif trouvé."}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
            <Badge variant="secondary">{goal.category ?? 'Non catégorisé'}</Badge>
          </div>
          {goal.description && <p className="text-muted-foreground">{goal.description}</p>}
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{goal.progress}%</span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {goal.target_date
                  ? new Date(goal.target_date).toLocaleDateString('fr-FR')
                  : 'Aucune échéance définie'}
              </span>
            </div>
            <Progress value={goal.progress} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Valeur actuelle</p>
                <p className="font-semibold">{goal.current_value ?? 0}{goal.unit ? ` ${goal.unit}` : ''}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Objectif cible</p>
                <p className="font-semibold">{goal.target_value ?? 'Non défini'}{goal.unit ? ` ${goal.unit}` : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Détails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Statut</span>
              <Badge variant={goal.completed ? 'secondary' : 'outline'}>
                {goal.completed ? 'Terminé' : 'En cours'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Créé le</span>
              <span className="font-medium">{new Date(goal.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dernière mise à jour</span>
              <span className="font-medium">{new Date(goal.updated_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4">
          {!goal.completed && (
            <Button onClick={handleComplete} className="flex-1 min-w-[180px]">
              Marquer comme terminé
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/app/goals')} className="flex-1 min-w-[180px]">
            Voir tous les objectifs
          </Button>
        </div>
      </div>
    </div>
  );
}
