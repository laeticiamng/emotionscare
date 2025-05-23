
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Building, ArrowLeft, Brain } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-3xl font-bold">Accès Entreprise</h1>
          <p className="text-muted-foreground text-lg">
            Choisissez votre type d'accès pour continuer
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collaborateur Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Collaborateur</CardTitle>
              <CardDescription>
                Accédez à votre espace personnel de bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fonctionnalités incluses :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Scan émotionnel personnel</li>
                  <li>• Coach IA personnalisé</li>
                  <li>• Musicothérapie adaptée</li>
                  <li>• Suivi de progression</li>
                  <li>• Sessions d'équipe</li>
                </ul>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/b2b/user/login')}
                >
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2b/user/register')}
                >
                  Créer un compte
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Administrateur Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Administrateur</CardTitle>
              <CardDescription>
                Gérez et administrez le bien-être de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fonctionnalités avancées :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tableau de bord analytique</li>
                  <li>• Gestion des utilisateurs</li>
                  <li>• Rapports détaillés</li>
                  <li>• Alertes et notifications</li>
                  <li>• Configuration d'organisation</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  Accès Administrateur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <Building className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Vous représentez une entreprise ? Contactez-nous pour découvrir nos solutions sur mesure.
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="mt-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix du mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
