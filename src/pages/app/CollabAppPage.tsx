/**
 * CollabAppPage - Dashboard B2B User (/app/collab)
 * Espace collaborateur avec accès personnel + modules entreprise
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  Briefcase,
  Users,
  Shield,
  MessageSquare,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  Building,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';

const CollabAppPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">EmotionsCare</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Collaborateur
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Données privées protégées</span>
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
              Bienvenue dans votre espace collaborateur
            </h2>
            <p className="text-muted-foreground">
              Accédez à votre espace personnel ET aux outils d'équipe de votre entreprise
            </p>
          </section>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="personal">Espace Perso</TabsTrigger>
              <TabsTrigger value="collab">Collaboratif</TabsTrigger>
              <TabsTrigger value="teams">Équipes</TabsTrigger>
            </TabsList>

            {/* ESPACE PERSONNEL - Identique au B2C */}
            <TabsContent value="personal" className="space-y-6">
              {/* Instant Glow Widget */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Mon Instant Glow</h3>
                        <p className="text-muted-foreground">Votre état émotionnel personnel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">Équilibré(e)</div>
                      <div className="text-sm text-muted-foreground">Journée sereine en vue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Outils personnels */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mes outils bien-être</CardTitle>
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

                  {/* Objectifs personnels */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Mes Objectifs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Équilibre travail-vie</span>
                            <span>En cours</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Gestion du stress</span>
                            <span>Excellent</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Expression émotionnelle</span>
                            <span>Active</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats personnelles */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Mon Suivi Personnel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sessions cette semaine</span>
                          <span className="font-semibold">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Humeur moyenne</span>
                          <span className="font-semibold text-green-600">Stable</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Streak méditation</span>
                          <span className="font-semibold">7 jours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Progression</span>
                          <span className="font-semibold text-primary">+15%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Suggestions personnelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">💙 Pause détente</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            Une séance Screen-Silk avant la réunion ?
                          </p>
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/app/screen-silk">Démarrer</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                          <span className="text-sm font-medium">Équipe Marketing</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Excellente séance de team building hier ! L'ambiance était au top 🚀"
                        </p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full"></div>
                          <span className="text-sm font-medium">Support Client</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Qui veut rejoindre le défi bien-être de cette semaine ?"
                        </p>
                      </div>

                      <Button className="w-full" asChild>
                        <Link to="/social-cocon">Voir tous les messages</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Activités d'équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Méditation collective</div>
                          <div className="text-xs text-muted-foreground">Demain 12h30</div>
                        </div>
                        <Button size="sm" variant="outline">Rejoindre</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Challenge Flash Glow</div>
                          <div className="text-xs text-muted-foreground">En cours</div>
                        </div>
                        <Button size="sm" variant="outline">Participer</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Atelier bien-être</div>
                          <div className="text-xs text-muted-foreground">Vendredi 16h</div>
                        </div>
                        <Button size="sm" variant="outline">S'inscrire</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Climat d'équipe (anonymisé) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atmosphère d'équipe (données anonymisées)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Positive</div>
                      <div className="text-sm text-muted-foreground">Humeur générale</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">Active</div>
                      <div className="text-sm text-muted-foreground">Participation</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">Stable</div>
                      <div className="text-sm text-muted-foreground">Tendance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ÉQUIPES */}
            <TabsContent value="teams" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Mes Équipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Équipe Développement</div>
                            <div className="text-sm text-muted-foreground">8 membres</div>
                          </div>
                        </div>
                        <Badge variant="secondary">Membre</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Task Force Innovation</div>
                            <div className="text-sm text-muted-foreground">5 membres</div>
                          </div>
                        </div>
                        <Badge variant="secondary">Membre</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Événements d'équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                        <div className="font-medium text-sm">Réunion bien-être</div>
                        <div className="text-xs text-muted-foreground">Aujourd'hui 14h30</div>
                        <div className="text-xs text-muted-foreground">Salle de conférence A</div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <div className="font-medium text-sm">Formation gestion stress</div>
                        <div className="text-xs text-muted-foreground">Mercredi 10h</div>
                        <div className="text-xs text-muted-foreground">En visio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Confidentialité et bien-être
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Vos données personnelles</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Scan émotionnel : 100% privé</li>
                        <li>✓ Journal vocal : Chiffré bout-en-bout</li>
                        <li>✓ Historique : Accessible par vous seul</li>
                        <li>✓ Analyses : Jamais partagées individuellement</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Partage d'équipe</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Données agrégées et anonymisées</li>
                        <li>✓ Participation volontaire aux activités</li>
                        <li>✓ Respect total de votre intimité</li>
                        <li>✓ Contrôle de vos partages</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CollabAppPage;