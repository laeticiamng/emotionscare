
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, AlertTriangle, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();

  const teams = [
    {
      name: 'Équipe Marketing',
      members: 12,
      wellbeingScore: 6.2,
      trend: -0.8,
      status: 'warning',
      alerts: 2,
      lastActivity: '2 heures'
    },
    {
      name: 'Équipe Développement',
      members: 18,
      wellbeingScore: 8.1,
      trend: +0.5,
      status: 'good',
      alerts: 0,
      lastActivity: '30 minutes'
    },
    {
      name: 'Équipe Ventes',
      members: 8,
      wellbeingScore: 7.5,
      trend: +0.3,
      status: 'good',
      alerts: 0,
      lastActivity: '1 heure'
    },
    {
      name: 'Équipe Support',
      members: 6,
      wellbeingScore: 7.8,
      trend: +0.1,
      status: 'good',
      alerts: 1,
      lastActivity: '45 minutes'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des équipes</h1>
            <p className="text-gray-600">Supervisez le bien-être de vos équipes</p>
          </div>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card key={index} className={`border-2 ${getStatusColor(team.status)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  {team.alerts > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {team.alerts}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{team.members} membres</span>
                  </div>
                  <span className="text-xs text-gray-500">Il y a {team.lastActivity}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score de bien-être</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">{team.wellbeingScore}/10</span>
                      <TrendingUp className={`h-4 w-4 ${team.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-xs ${team.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {team.trend > 0 ? '+' : ''}{team.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${team.status === 'warning' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(team.wellbeingScore / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Détails
                  </Button>
                  {team.status === 'warning' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Intervention
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/events')}>
                  Planifier une session
                </Button>
                <Button variant="outline" onClick={() => navigate('/reports')}>
                  Générer un rapport
                </Button>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Paramètres d'équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
