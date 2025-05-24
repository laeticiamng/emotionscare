
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Shield, BarChart3, Heart, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Collaborateurs actifs',
      value: '24/32',
      description: 'Utilisateurs connectés cette semaine',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Score de bien-être moyen',
      value: '7.2/10',
      description: '+0.8 par rapport au mois dernier',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Engagement',
      value: '85%',
      description: 'Taux de participation aux analyses',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Progression générale',
      value: '+12%',
      description: 'Amélioration du bien-être global',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord RH</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être de vos équipes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Données anonymisées</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <stat.icon className={`mr-2 h-5 w-5 ${stat.color}`} />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Tendances hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Graphique des tendances en développement...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Répartition émotionnelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Analyse émotionnelle globale en développement...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            Protection des données personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Conformité RGPD :</strong> Toutes les données affichées ici sont anonymisées et agrégées. 
              Aucune information individuelle n'est accessible. Les statistiques ne sont visibles que si 
              un minimum de 5 participants garantit l'anonymat complet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminDashboardPage;
