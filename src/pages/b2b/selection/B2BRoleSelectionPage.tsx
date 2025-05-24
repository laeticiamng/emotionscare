
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Shield, Users, ArrowLeft } from 'lucide-react';

const B2BRoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold">EmotionsCare B2B</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Choisissez votre type d'accès
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collaborateur */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Users className="h-16 w-16 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-base">
                Accédez à votre espace personnel de bien-être au travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Scan émotionnel personnalisé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Coach IA pour le bien-être professionnel
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Musicothérapie adaptée au travail
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Journal de réflexion professionnel
                </li>
              </ul>
              <Link to="/b2b/user/login" className="block">
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Accès Collaborateur
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Administrateur RH */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-400">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Shield className="h-16 w-16 text-slate-600" />
              </div>
              <CardTitle className="text-2xl">Administrateur RH</CardTitle>
              <CardDescription className="text-base">
                Gérez le bien-être de vos équipes avec des outils analytiques avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                  Tableau de bord des équipes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                  Analyses du climat émotionnel
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                  Rapports de bien-être anonymisés
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                  Gestion des utilisateurs
                </li>
              </ul>
              <Link to="/b2b/admin/login" className="block">
                <Button className="w-full mt-6 bg-slate-600 hover:bg-slate-700">
                  Accès Administrateur
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/choose-mode">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au choix de mode
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            EmotionsCare B2B - Solution professionnelle pour le bien-être au travail
          </p>
          <p className="mt-1">
            Vos données sont sécurisées et respectent le RGPD
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BRoleSelectionPage;
