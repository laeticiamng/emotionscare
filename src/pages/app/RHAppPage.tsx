/**
 * RHAppPage - Dashboard B2B RH/Manager (/app/rh)
 * Accès complet : personnel + collaboratif + outils RH
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  Shield,
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Download,
  Calendar,
  Target,
  Activity,
  Settings,
  HelpCircle,
  Building,
  Zap,
  Eye,
  Lock,
  UserCheck
} from 'lucide-react';

const RHAppPage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">EmotionsCare</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Manager RH
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Données anonymisées RGPD</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <section className="text-center py-6">
            <h2 className="text-2xl font-bold mb-2">
              Tableau de Bord RH Complet
            </h2>
            <p className="text-muted-foreground">
              Votre espace personnel + outils collaboratifs + vision RH anonymisée
            </p>
          </section>

          <Tabs defaultValue="rh" className="space-y-6">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
              <TabsTrigger value="rh">RH Dashboard</TabsTrigger>
              <TabsTrigger value="personal">Espace Perso</TabsTrigger>
              <TabsTrigger value="collab">Collaboratif</TabsTrigger>
              <TabsTrigger value="teams">Équipes</TabsTrigger>
            </TabsList>

            {/* DASHBOARD RH */}
            <TabsContent value="rh" className="space-y-6">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes équipes</SelectItem>
                      <SelectItem value="dev">Développement</SelectItem>
                      <SelectItem value="sales">Commercial</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="quarter">Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/b2b/admin/reports">Rapports détaillés</Link>
                  </Button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement Global</p>
                        <p className="text-2xl font-bold text-green-600">Élevé</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      +12% vs semaine précédente
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Stress Collectif</p>
                        <p className="text-2xl font-bold text-orange-600">Modéré</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Stable par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Participation</p>
                        <p className="text-2xl font-bold text-blue-600">Active</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      73% des collaborateurs actifs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Tendance Globale</p>
                        <p className="text-2xl font-bold text-primary">Positive</p>
                      </div>
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Amélioration continue
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Heatmap et Analytics */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Heatmap des Humeurs d'Équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-6 gap-2 text-sm">
                        <div className="font-medium">Équipe</div>
                        <div className="font-medium text-center">Lun</div>
                        <div className="font-medium text-center">Mar</div>
                        <div className="font-medium text-center">Mer</div>
                        <div className="font-medium text-center">Jeu</div>
                        <div className="font-medium text-center">Ven</div>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2 text-sm">
                        <div>Développement</div>
                        <div className="h-8 bg-green-200 rounded flex items-center justify-center">Bien</div>
                        <div className="h-8 bg-green-300 rounded flex items-center justify-center">Très bien</div>
                        <div className="h-8 bg-yellow-200 rounded flex items-center justify-center">Neutre</div>
                        <div className="h-8 bg-green-200 rounded flex items-center justify-center">Bien</div>
                        <div className="h-8 bg-green-300 rounded flex items-center justify-center">Très bien</div>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2 text-sm">
                        <div>Commercial</div>
                        <div className="h-8 bg-orange-200 rounded flex items-center justify-center">Stress</div>
                        <div className="h-8 bg-yellow-200 rounded flex items-center justify-center">Neutre</div>
                        <div className="h-8 bg-green-200 rounded flex items-center justify-center">Bien</div>
                        <div className="h-8 bg-green-200 rounded flex items-center justify-center">Bien</div>
                        <div className="h-8 bg-green-300 rounded flex items-center justify-center">Très bien</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alertes et Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-sm">Attention Équipe Commercial</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Niveau de stress élevé détecté lundi. Recommandation : organiser une session collective de détente.
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Succès Équipe Support</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellente progression cette semaine. L'initiative méditation collective fonctionne bien !
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Opportunité d'engagement</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          27% des collaborateurs n'ont pas encore essayé Flash Glow. Peut-être organiser une demo ?
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions RH */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions RH Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                      <Link to="/b2b/admin/reports">
                        <BarChart3 className="h-6 w-6" />
                        <span className="text-sm">Rapports</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                      <Link to="/b2b/admin/events">
                        <Calendar className="h-6 w-6" />
                        <span className="text-sm">Événements</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                      <Link to="/b2b/admin/teams">
                        <Users className="h-6 w-6" />
                        <span className="text-sm">Gestion Équipes</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                      <Link to="/b2b/admin/optimisation">
                        <TrendingUp className="h-6 w-6" />
                        <span className="text-sm">Optimisation</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ESPACE PERSONNEL - Identique aux autres rôles */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Mon Instant Glow Personnel</h3>
                        <p className="text-muted-foreground">Votre bien-être en tant qu'individu</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">Concentré(e)</div>
                      <div className="text-sm text-muted-foreground">Focus sur les objectifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes outils personnels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link to="/app/scan">
                          <Camera className="h-6 w-6" />
                          <span className="text-sm">Scan Émotionnel</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link to="/app/music">
                          <Music className="h-6 w-6" />
                          <span className="text-sm">Musicothérapie</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link to="/app/journal">
                          <Mic className="h-6 w-6" />
                          <span className="text-sm">Journal Vocal</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link to="/app/flash-glow">
                          <Zap className="h-6 w-6" />
                          <span className="text-sm">Flash Glow</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Mes Objectifs Personnels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Équilibre management</span>
                          <span>En progression</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Gestion du stress</span>
                          <span>Maîtrisé</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Leadership bienveillant</span>
                          <span>Excellent</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ESPACE COLLABORATIF */}
            <TabsContent value="collab" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Social Cocon Entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
                          <span className="text-sm font-medium">Équipe Innovation</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Super initiative sur la méditation ! Merci pour l'organisation 🙏"
                        </p>
                      </div>
                      
                      <Button className="w-full" asChild>
                        <Link to="/social-cocon">Modérer les discussions</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Actions de Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/b2b/admin/events">
                          <Calendar className="h-4 w-4 mr-2" />
                          Organiser un événement bien-être
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/b2b/admin/teams">
                          <Users className="h-4 w-4 mr-2" />
                          Gérer les équipes
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/b2b/admin/reports">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Générer un rapport
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ÉQUIPES */}
            <TabsContent value="teams" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Vision Équipes (Anonymisée)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Équipe Développement</div>
                            <div className="text-sm text-muted-foreground">Bien-être: Positif</div>
                          </div>
                        </div>
                        <Badge variant="secondary">8 membres</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium">Équipe Commercial</div>
                            <div className="text-sm text-muted-foreground">Bien-être: Attention requise</div>
                          </div>
                        </div>
                        <Badge variant="secondary">12 membres</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Confidentialité RH
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <h4 className="font-medium text-sm">✓ Données agrégées</h4>
                        <p className="text-xs text-muted-foreground">
                          Aucune donnée individuelle accessible
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <h4 className="font-medium text-sm">✓ Conformité RGPD</h4>
                        <p className="text-xs text-muted-foreground">
                          Anonymisation automatique
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                        <h4 className="font-medium text-sm">✓ Respect absolu</h4>
                        <p className="text-xs text-muted-foreground">
                          Privacy by design
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default RHAppPage;