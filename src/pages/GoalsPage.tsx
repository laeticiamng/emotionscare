import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GoalsPage() {
  const navigate = useNavigate();
  const { goals, stats, isLoading, error } = useGoals();

  // Filter active goals only
  const activeGoals = goals.filter((g) => g.status === 'active');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6" data-testid="page-root">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement de vos objectifs...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Error alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Actifs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGoals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalGoals} au total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.successRate)}%</div>
              <p className="text-xs text-muted-foreground">
                Basé sur {stats.totalGoals} objectifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedGoals}</div>
              <p className="text-xs text-muted-foreground">
                Complétés avec succès
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <Card>
          <CardHeader>
            <CardTitle>Objectifs en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            {activeGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun objectif actif</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre premier objectif pour suivre votre progression
                </p>
                <Button onClick={() => navigate('/app/goals/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un objectif
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="space-y-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/goals/${goal.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge variant="secondary">{goal.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} />
                      {goal.target_value && goal.current_value !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {goal.current_value} / {goal.target_value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
