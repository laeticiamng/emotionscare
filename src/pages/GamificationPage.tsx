
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Target, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GamificationPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gamification</h1>
        <Button>
          <Gift className="w-4 h-4 mr-2" />
          Réclamer récompense
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points totaux</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+156 cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges obtenus</CardTitle>
            <Trophy className="h-4 w-4 text-gold-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Sur 45 disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectifs atteints</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/20</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau actuel</CardTitle>
            <Gift className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Expert bien-être</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badges récents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium">Méditant assidu</p>
                  <p className="text-sm text-muted-foreground">7 jours consécutifs</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Nouveau</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Scanner expert</p>
                  <p className="text-sm text-muted-foreground">100 scans réalisés</p>
                </div>
              </div>
              <Badge variant="outline">Obtenu</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Objectif mensuel</p>
                  <p className="text-sm text-muted-foreground">Tous les défis complétés</p>
                </div>
              </div>
              <Badge variant="outline">Obtenu</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Défis en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Challenge bien-être</h4>
                <Badge variant="secondary">2 jours restants</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Utilisez 3 modules différents dans la journée
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">2/3 modules utilisés</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Série méditation</h4>
                <Badge variant="outline">5 jours</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Méditez 5 jours consécutifs
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">5/5 jours complétés ✓</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classement communautaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Classement et compétitions amicales en cours de développement
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPage;
