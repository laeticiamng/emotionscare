import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

export default function WeeklyReportPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Rapport Hebdomadaire</h1>
          <p className="text-muted-foreground">Semaine du 20 au 26 Oct 2025</p>
        </div>
        <Button>Télécharger le rapport</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-green-500">+20% vs semaine dernière</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Target className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Objectifs atteints</p>
            <p className="text-3xl font-bold">8/10</p>
            <p className="text-xs text-green-500">+2 vs semaine dernière</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            <TrendingDown className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Temps moyen/session</p>
            <p className="text-3xl font-bold">25min</p>
            <p className="text-xs text-orange-500">-5min vs semaine dernière</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score bien-être</p>
            <p className="text-3xl font-bold">8.2/10</p>
            <p className="text-xs text-green-500">+0.5 vs semaine dernière</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Résumé de la semaine</h3>
        <p className="text-muted-foreground">
          Excellente semaine ! Vous avez augmenté votre activité de 20% avec 12 sessions complétées. 
          Vous avez atteint 8 de vos 10 objectifs hebdomadaires. Votre score de bien-être a progressé 
          de 0.5 point pour atteindre 8.2/10. Continuez sur cette lancée ! 🎉
        </p>
      </Card>
    </div>
  );
}
