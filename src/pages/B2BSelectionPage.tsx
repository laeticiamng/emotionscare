
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowLeft, Building2 } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/choose-mode" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au choix de mode
            </Link>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Building2 className="h-16 w-16 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Espace Entreprise
            </h1>
            <p className="text-xl text-muted-foreground">
              Choisissez votre type d'accès professionnel
            </p>
          </div>

          {/* Access Type Selection */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Collaborateur */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Accès employé avec outils de bien-être et suivi personnel
                </p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Outils de bien-être personnels</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Scanner d'émotions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Coach virtuel</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Partage en équipe optionnel</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/b2b/user/login" className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/b2b/user/register" className="block">
                    <Button variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Administrateur RH */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                    <Shield className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Administrateur RH</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Accès complet avec tableau de bord et gestion d'équipe
                </p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Dashboard RH complet</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Analyse du climat émotionnel</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Gestion des équipes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Rapports et statistiques</span>
                  </div>
                </div>

                <Link to="/b2b/admin/login" className="block">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Accès Administrateur
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Vous n'avez pas encore d'accès ?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Contactez votre administrateur RH ou notre équipe commerciale pour configurer votre organisation.
                </p>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  Contacter l'équipe commerciale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
