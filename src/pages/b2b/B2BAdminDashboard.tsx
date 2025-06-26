
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdvancedAnalyticsWidget } from '@/components/dashboard/admin/widgets/AdvancedAnalyticsWidget';
import { UserManagementWidget } from '@/components/dashboard/admin/widgets/UserManagementWidget';
import { OrganizationStats } from '@/components/admin/OrganizationStats';
import { UserActivityChart } from '@/components/admin/UserActivityChart';
import { EmotionalHealthOverview } from '@/components/admin/EmotionalHealthOverview';
import { NewUsersCard } from '@/components/admin/NewUsersCard';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Settings,
  Bell,
  Download,
  Shield,
  BarChart3,
  Calendar,
  Mail
} from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Administration RH
            </h1>
            <p className="text-muted-foreground mt-2">
              Pilotage du bien-être organisationnel chez TechCorp
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                TechCorp Solutions
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                78 collaborateurs
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Conforme RGPD
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Rapport
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alertes
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Config
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Score Global</p>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-green-200 text-xs">+5% ce mois</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Participation</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-blue-200 text-xs">+12% ce mois</p>
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
                  <p className="text-purple-200 text-xs">+8% ce mois</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Alertes</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-orange-200 text-xs">-2 cette semaine</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AdvancedAnalyticsWidget />
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Globales</CardTitle>
              </CardHeader>
              <CardContent>
                <OrganizationStats />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionalHealthOverview />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Management & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UserManagementWidget />
          
          <Card>
            <CardHeader>
              <CardTitle>Activité Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <UserActivityChart />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <NewUsersCard />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Générer Rapport Mensuel
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer Enquête Équipe
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter Données RGPD
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Planifier Intervention
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-sm">Département Finance</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Score en baisse - Organiser un team building
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-sm">Équipe Marketing</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Excellente dynamique - Continuer les efforts
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-medium text-sm">Absentéisme</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Légère hausse - Surveiller la tendance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
