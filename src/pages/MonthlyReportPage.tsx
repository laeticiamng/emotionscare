import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

export default function MonthlyReportPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Rapport Mensuel</h1>
          <p className="text-muted-foreground">Octobre 2025</p>
        </div>
        <Button>Télécharger le rapport</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Calendar className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jours actifs</p>
            <p className="text-3xl font-bold">28/31</p>
            <p className="text-xs text-green-500">90% de régularité</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Target className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Objectifs mensuels</p>
            <p className="text-3xl font-bold">15/18</p>
            <p className="text-xs text-green-500">83% de réussite</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Award className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Badges débloqués</p>
            <p className="text-3xl font-bold">5</p>
            <p className="text-xs text-green-500">Nouveau record!</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-primary" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progression globale</p>
            <p className="text-3xl font-bold">+35%</p>
            <p className="text-xs text-green-500">Excellent mois!</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Bilan du mois</h3>
        <div className="space-y-3 text-muted-foreground">
          <p>
            🎉 <strong>Mois exceptionnel!</strong> Vous avez été actif 28 jours sur 31, 
            atteignant 90% de régularité.
          </p>
          <p>
            🎯 Vous avez complété 15 de vos 18 objectifs mensuels, soit un taux de réussite 
            de 83%. C'est votre meilleur score depuis 3 mois!
          </p>
          <p>
            🏆 Vous avez débloqué 5 nouveaux badges ce mois-ci, dont le badge "Régularité 
            Diamant" pour 28 jours consécutifs.
          </p>
          <p>
            📈 Votre progression globale est de +35% par rapport au mois dernier. Continuez 
            comme ça!
          </p>
        </div>
      </Card>
    </div>
  );
}
