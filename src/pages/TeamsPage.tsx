
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Filter, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const teams = [
    {
      id: 1,
      name: 'Équipe Marketing',
      manager: 'Sophie Martin',
      members: 12,
      wellnessScore: 78,
      status: 'good',
      lastScan: '2024-12-15',
      riskLevel: 'low'
    },
    {
      id: 2,
      name: 'Développement',
      manager: 'Thomas Dubois',
      members: 8,
      wellnessScore: 65,
      status: 'warning',
      lastScan: '2024-12-14',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'Ressources Humaines',
      manager: 'Marie Chen',
      members: 5,
      wellnessScore: 85,
      status: 'excellent',
      lastScan: '2024-12-15',
      riskLevel: 'low'
    },
    {
      id: 4,
      name: 'Ventes',
      manager: 'Pierre Laurent',
      members: 15,
      wellnessScore: 52,
      status: 'alert',
      lastScan: '2024-12-13',
      riskLevel: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Équipes</h1>
          <p className="text-muted-foreground">
            Surveillez le bien-être de vos équipes et identifiez les risques
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle équipe
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Équipes</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Moyen</p>
                <p className="text-2xl font-bold">70</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risque Élevé</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(team.status)}
                    {team.name}
                  </CardTitle>
                  <CardDescription>
                    Managé par {team.manager} • {team.members} membres
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(team.status)}>
                  {team.status === 'excellent' && 'Excellent'}
                  {team.status === 'good' && 'Bon'}
                  {team.status === 'warning' && 'Attention'}
                  {team.status === 'alert' && 'Alerte'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Wellness Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Score de bien-être</span>
                  <span className="text-sm font-bold">{team.wellnessScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      team.wellnessScore >= 80 ? 'bg-green-500' :
                      team.wellnessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${team.wellnessScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Niveau de risque</span>
                <Badge variant={team.riskLevel === 'high' ? 'destructive' : team.riskLevel === 'medium' ? 'secondary' : 'default'}>
                  {team.riskLevel === 'high' && 'Élevé'}
                  {team.riskLevel === 'medium' && 'Moyen'}
                  {team.riskLevel === 'low' && 'Faible'}
                </Badge>
              </div>

              {/* Last Scan */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Dernier scan</span>
                <span>{new Date(team.lastScan).toLocaleDateString('fr-FR')}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  Voir détails
                </Button>
                <Button size="sm" className="flex-1">
                  Analyser équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recommandations d'Actions</CardTitle>
          <CardDescription>
            Actions prioritaires basées sur l'analyse des équipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Attention requise - Équipe Ventes</h4>
                <p className="text-sm text-red-800">Score de bien-être en baisse (52/100). Recommandé: session d'écoute individuelle.</p>
                <Button size="sm" variant="destructive" className="mt-2">
                  Planifier intervention
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Suivi recommandé - Équipe Développement</h4>
                <p className="text-sm text-yellow-800">Score modéré (65/100). Proposer des activités de team building.</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Planifier activité
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Bonne pratique - Équipe RH</h4>
                <p className="text-sm text-green-800">Excellent score (85/100). Partager les bonnes pratiques avec autres équipes.</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Documenter pratiques
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPage;
