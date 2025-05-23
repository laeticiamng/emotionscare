
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const B2BAdminAnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" />
          Exporter le rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans émotionnels</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+15.2% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">+0.8 par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
            <CardDescription>
              Évolution du bien-être de l'équipe sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Graphique des tendances à venir</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par équipe</CardTitle>
            <CardDescription>
              Comparaison des scores de bien-être par département
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Développement</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">8.1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marketing</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-3/5 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">7.2</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RH</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">8.3</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Support</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-2/5 h-full bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">6.1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
