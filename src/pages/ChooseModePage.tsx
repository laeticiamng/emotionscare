
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choisissez votre
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
              mode d'accès
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            EmotionsCare s'adapte à vos besoins, que vous soyez un particulier ou une entreprise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* B2C Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Particulier</CardTitle>
                  <CardDescription className="text-base">
                    Accès personnel et familial
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Scanner émotionnel personnel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Musicothérapie adaptative</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Coach IA 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Journal émotionnel privé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Communauté Social Cocon</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full group" size="lg" asChild>
                  <Link to="/b2c/login">
                    Accéder en tant que particulier
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Pas encore de compte ?{' '}
                  <Link to="/b2c/register" className="text-primary hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden border-primary/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
              Recommandé
            </div>
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Entreprise</CardTitle>
                  <CardDescription className="text-base">
                    Solutions pour équipes et organisations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Tableau de bord RH complet</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Analytics d'équipe avancées</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Gestion multi-utilisateurs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Rapports de conformité RGPD</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Support prioritaire</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full group" size="lg" variant="outline" asChild>
                  <Link to="/b2b/selection">
                    Accéder aux solutions entreprise
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Découvrez nos formules adaptées à votre organisation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Besoin d'aide pour choisir ? Notre équipe est là pour vous accompagner
          </p>
          <Button variant="ghost" asChild>
            <Link to="/feedback">
              Contactez-nous
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
