
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Users, Shield, ArrowRight } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Choisissez votre espace
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez l'espace qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* B2C Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10 text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Espace Personnel</CardTitle>
              <CardDescription className="text-lg">
                Pour les particuliers et professionnels de santé
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Scan émotionnel personnalisé</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Coach IA disponible 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Musicothérapie adaptative</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Journal émotionnel privé</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/b2c/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/b2c/register" className="block">
                  <Button variant="outline" className="w-full">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10 text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Espace Entreprise</CardTitle>
              <CardDescription className="text-lg">
                Solutions B2B pour organisations et équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Tableaux de bord d'équipe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Rapports et analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Gestion multi-utilisateurs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Outils collaboratifs</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/b2b/selection" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Choisir mon rôle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
