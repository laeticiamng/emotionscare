import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, Shield, BarChart3, Heart, ArrowRight } from 'lucide-react';

const B2BEntreprisePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bien-être émotionnel pour vos équipes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Découvrez EmotionsCare B2B : une plateforme complète pour accompagner 
            le bien-être mental de vos collaborateurs avec anonymat garanti et insights RH.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup?segment=b2b">
                Demander une démo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login?segment=b2b">Accès équipe</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Une solution complète pour l'entreprise
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Gestion d'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tableaux de bord RH avec données anonymisées et insights d'équipe.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Anonymat garanti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Données individuelles protégées, seules les tendances d'équipe sont visibles.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Analytics avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Heatmaps, rapports de bien-être et métriques d'engagement équipe.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Bien-être collectif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Outils collaboratifs et défis d'équipe pour renforcer la cohésion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Impact mesurable sur votre organisation
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Réduction de l'absentéisme</h3>
                    <p className="text-muted-foreground">
                      Détection précoce des signaux de stress et burnout
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Amélioration de l'engagement</h3>
                    <p className="text-muted-foreground">
                      Outils de bien-être accessibles et gamifiés
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Conformité RGPD native</h3>
                    <p className="text-muted-foreground">
                      Respect total de la vie privée des collaborateurs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Pour les Collaborateurs</h3>
                  <p className="text-muted-foreground">
                    Accès aux mêmes outils que la version B2C : Flash Glow, musicothérapie, 
                    journal vocal, VR et coaching IA personnalisé.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Pour les Managers RH</h3>
                  <p className="text-muted-foreground">
                    Dashboards anonymisés, heatmaps d'équipe, rapports de tendances 
                    et recommandations d'actions préventives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer le bien-être de vos équipes ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Démarrez avec une démonstration personnalisée de la plateforme.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup?segment=b2b">
              Planifier une démo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BEntreprisePage;