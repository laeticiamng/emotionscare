// @ts-nocheck
/**
 * B2BTeamsPage - Gestion d'équipes B2B
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/routerV2';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Settings, 
  BarChart3, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';

const B2BTeamsPage: React.FC = () => {
  const teams = [
    {
      id: 1,
      name: 'Équipe Marketing',
      members: 12,
      lead: 'Sarah Martin',
      email: 'sarah.martin@company.com',
      avgWellness: 78,
      status: 'active' as const,
      lastActivity: '2024-01-15'
    },
    {
      id: 2,
      name: 'Équipe Développement',
      members: 8,
      lead: 'Thomas Dubois',
      email: 'thomas.dubois@company.com',
      avgWellness: 85,
      status: 'active' as const,
      lastActivity: '2024-01-14'
    },
    {
      id: 3,
      name: 'Équipe Support',
      members: 6,
      lead: 'Marie Leroy',
      email: 'marie.leroy@company.com',
      avgWellness: 72,
      status: 'needs-attention' as const,
      lastActivity: '2024-01-13'
    }
  ];

  const getStatusBadge = (status: string, wellness: number) => {
    if (status === 'needs-attention' || wellness < 75) {
      return <Badge variant="destructive">Attention requise</Badge>;
    }
    return <Badge variant="default">Actif</Badge>;
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Équipes
            </h1>
            <p className="text-gray-600">
              Suivez le bien-être et la performance de vos équipes
            </p>
          </div>
          
          <Button className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Nouvelle équipe</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Équipes</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Membres Total</p>
                  <p className="text-2xl font-bold">
                    {teams.reduce((sum, team) => sum + team.members, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Bien-être Moyen</p>
                  <p className="text-2xl font-bold">
                    {Math.round(teams.reduce((sum, team) => sum + team.avgWellness, 0) / teams.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Équipes Actives</p>
                  <p className="text-2xl font-bold">
                    {teams.filter(team => team.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {team.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {team.members} membres
                    </p>
                  </div>
                  {getStatusBadge(team.status, team.avgWellness)}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Team Lead */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{team.lead}</p>
                      <p className="text-sm text-gray-600">Chef d'équipe</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{team.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Dernière activité: {new Date(team.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Wellness Score */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Bien-être de l'équipe</span>
                      <span className={`text-lg font-bold ${getWellnessColor(team.avgWellness)}`}>
                        {team.avgWellness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          team.avgWellness >= 80 ? 'bg-green-500' :
                          team.avgWellness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${team.avgWellness}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Gérer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to={routes.adminReports?.() || '/admin/reports'}>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir les rapports
                  </Button>
                </Link>

                <Link to={routes.adminEvents?.() || '/admin/events'}>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Organiser un événement
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BTeamsPage;