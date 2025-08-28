
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building2, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-pink-500 mr-3" />
            <h1 className="text-4xl font-bold">EmotionsCare</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Comment souhaitez-vous utiliser EmotionsCare ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* B2C Mode */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-pink-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-pink-500" />
              </div>
              <CardTitle className="text-2xl">Usage Personnel</CardTitle>
              <CardDescription className="text-base">
                Pour votre bien-être personnel au quotidien
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Scan émotionnel personnel
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Coach IA personnalisé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Musicothérapie adaptée
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Journal émotionnel privé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Communauté de soutien
                </li>
              </ul>
              <div className="space-y-2 pt-4">
                <Link to={routes.auth.b2cLogin()} className="block">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">
                    Se connecter
                  </Button>
                </Link>
                <Link to={routes.auth.b2cRegister()} className="block">
                  <Button variant="outline" className="w-full border-pink-500 text-pink-500 hover:bg-pink-50">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* B2B Mode */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Building2 className="h-16 w-16 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Usage Professionnel</CardTitle>
              <CardDescription className="text-base">
                Pour les entreprises et leurs collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Espace collaborateur sécurisé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Tableau de bord RH
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Analyses d'équipe anonymisées
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Conformité RGPD
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Support prioritaire
                </li>
              </ul>
              <div className="pt-4">
                <Link to={routes.special.b2bSelection()} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Accéder à l'espace B2B
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to={routes.public.home()}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Besoin d'aide ? Contactez notre équipe support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
