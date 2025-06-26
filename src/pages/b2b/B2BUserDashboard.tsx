
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TeamMoodWidget } from '@/components/dashboard/b2b/widgets/TeamMoodWidget';
import { TeamObjectivesWidget } from '@/components/dashboard/b2b/widgets/TeamObjectivesWidget';
import { EmotionalStatsWidget } from '@/components/dashboard/b2c/widgets/EmotionalStatsWidget';
import { QuickActionsWidget } from '@/components/dashboard/b2c/widgets/QuickActionsWidget';
import { MoodTrendWidget } from '@/components/dashboard/b2c/widgets/MoodTrendWidget';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  Bell,
  BarChart3,
  Shield
} from 'lucide-react';

const B2BUserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de Bord Collaborateur
            </h1>
            <p className="text-muted-foreground mt-2">
              Votre bien-être personnel et celui de votre équipe
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                TechCorp - Équipe Marketing
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                12 collaborateurs
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planning
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alertes RH
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Mon Score</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Score Équipe</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Engagement</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Mon Espace Personnel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmotionalStatsWidget />
                <QuickActionsWidget />
              </div>
            </div>
            
            <MoodTrendWidget />
          </div>

          {/* Team Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Équipe Marketing
              </h2>
              <TeamMoodWidget />
            </div>
            
            <TeamObjectivesWidget />
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-sm">Nouvelle enquête bien-être</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Participez à notre enquête mensuelle - 2 minutes
                  </p>
                  <Button size="sm" className="mt-2">Participer</Button>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-sm">Atelier gestion du stress</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inscrivez-vous pour la session du 15 mars
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">S'inscrire</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparaison Anonyme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre score vs équipe</span>
                  <Badge variant="secondary">+7 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre score vs département</span>
                  <Badge variant="secondary">+3 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre score vs entreprise</span>
                  <Badge variant="secondary">+5 points</Badge>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Données complètement anonymisées
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
