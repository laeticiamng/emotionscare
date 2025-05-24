
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, AlertTriangle, Activity, Heart, Shield } from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const stats = [
    {
      title: "Collaborateurs actifs",
      value: "145",
      change: "+12%",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Score bien-être moyen",
      value: "82%",
      change: "+5%",
      icon: Heart,
      color: "text-green-500"
    },
    {
      title: "Alertes en cours",
      value: "3",
      change: "-2",
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      title: "Participation",
      value: "94%",
      change: "+8%",
      icon: Activity,
      color: "text-purple-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tableau de bord Administrateur - EmotionsCare</title>
        <meta name="description" content="Dashboard administrateur RH EmotionsCare" />
      </Helmet>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord RH
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble du bien-être de vos équipes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-red-500" />
            <span className="text-sm font-medium">Mode Administrateur</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Graphique d'évolution du bien-être
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par département</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { dept: "Développement", score: 85, color: "bg-blue-500" },
                  { dept: "Marketing", score: 78, color: "bg-green-500" },
                  { dept: "RH", score: 92, color: "bg-purple-500" },
                  { dept: "Commercial", score: 76, color: "bg-orange-500" }
                ].map((dept) => (
                  <div key={dept.dept} className="flex items-center space-x-3">
                    <div className="w-16 text-sm">{dept.dept}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${dept.color} h-2 rounded-full`}
                        style={{ width: `${dept.score}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium">{dept.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Marie Dubois",
                  action: "a effectué un scan émotionnel",
                  time: "Il y a 5 minutes",
                  status: "positive"
                },
                {
                  user: "Thomas Martin",
                  action: "a marqué un niveau de stress élevé",
                  time: "Il y a 15 minutes",
                  status: "warning"
                },
                {
                  user: "Sophie Leclerc",
                  action: "a terminé sa session de méditation",
                  time: "Il y a 30 minutes",
                  status: "positive"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'positive' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default B2BAdminDashboardPage;
