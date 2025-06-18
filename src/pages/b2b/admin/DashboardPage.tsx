
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Calendar, 
  Settings, 
  FileText, 
  Target,
  AlertCircle,
  TrendingUp,
  Clock,
  Heart,
  Award
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-950 dark:to-blue-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Administrateur RH
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Interface de gestion - TechCorp Inc.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Administrateur Principal
            </Badge>
            <Badge variant="outline">
              127 collaborateurs actifs
            </Badge>
          </div>
        </div>

        {/* Alert importante */}
        <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  3 collaborateurs nécessitent une attention particulière
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Scores de bien-être en baisse significative cette semaine
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être global</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.6/10</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +0.4 vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <Progress value={82} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risque turnover</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12%</div>
              <p className="text-xs text-muted-foreground">
                15 collaborateurs à risque
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs atteints</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18/25</div>
              <Progress value={72} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Outils de gestion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Outils d'administration</CardTitle>
              <CardDescription>Accès rapide aux fonctionnalités de gestion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Gestion équipes</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Rapports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Événements</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  <span>Optimisation</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertes et notifications</CardTitle>
              <CardDescription>Situations nécessitant votre attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Équipe Dev - Stress élevé</p>
                  <p className="text-xs text-gray-600">Score moyen: 4.2/10 - Action recommandée</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Rapport mensuel dû</p>
                  <p className="text-xs text-gray-600">Échéance: Dans 3 jours</p>
                </div>
                <Badge variant="secondary">Rappel</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Objectif atteint - Équipe Sales</p>
                  <p className="text-xs text-gray-600">100% de participation cette semaine</p>
                </div>
                <Badge variant="secondary">Félicitations</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Données détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par équipe</CardTitle>
              <CardDescription>Bien-être et engagement par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Équipe Marketing</p>
                    <p className="text-xs text-gray-600">23 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">8.4/10</p>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                </div>
                <Progress value={84} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Équipe Développement</p>
                    <p className="text-xs text-gray-600">31 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">4.2/10</p>
                    <Badge variant="destructive">Attention</Badge>
                  </div>
                </div>
                <Progress value={42} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Équipe Ventes</p>
                    <p className="text-xs text-gray-600">19 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">7.8/10</p>
                    <Badge variant="secondary">Bon</Badge>
                  </div>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions récentes</CardTitle>
              <CardDescription>Historique des interventions RH</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session de formation bien-être</p>
                    <p className="text-xs text-gray-600">Aujourd'hui 14:00 - 45 participants</p>
                  </div>
                  <Badge variant="outline">Planifié</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Entretien individuel - J. Dupont</p>
                    <p className="text-xs text-gray-600">Hier 16:30 - Suivi personnalisé</p>
                  </div>
                  <Badge variant="outline">Complété</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Campagne sensibilisation stress</p>
                    <p className="text-xs text-gray-600">Cette semaine - 89% participation</p>
                  </div>
                  <Badge variant="outline">En cours</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rapport mensuel généré</p>
                    <p className="text-xs text-gray-600">Lundi - Envoyé à la direction</p>
                  </div>
                  <Badge variant="outline">Archivé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BAdminDashboardPage;
