
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Heart, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être de votre organisation
          </p>
        </div>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" />
          Générer un rapport
        </Button>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de bien-être</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8/10</div>
            <p className="text-xs text-muted-foreground">
              +0.5 par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              +3% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Situations à surveiller
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendances récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
            <CardDescription>
              Évolution du bien-être sur les 7 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Graphique des tendances</p>
            </div>
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes récentes</CardTitle>
            <CardDescription>
              Situations nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Équipe Marketing</p>
                <p className="text-xs text-muted-foreground">
                  Baisse du score de bien-être (-15% cette semaine)
                </p>
                <Badge variant="outline" className="mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  Il y a 2h
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Support Client</p>
                <p className="text-xs text-muted-foreground">
                  Augmentation du stress détectée
                </p>
                <Badge variant="outline" className="mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  Il y a 4h
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Équipe Développement</p>
                <p className="text-xs text-muted-foreground">
                  Excellent score de bien-être maintenu
                </p>
                <Badge variant="outline" className="mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  Il y a 1 jour
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Outils et raccourcis pour gérer votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gérer les utilisateurs
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Voir les analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Créer un rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminDashboardPage;
