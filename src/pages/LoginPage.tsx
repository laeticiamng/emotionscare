
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Building, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-muted-foreground mt-2">
            Choisissez votre mode de connexion
          </p>
        </div>

        <div className="space-y-4">
          {/* B2C Login */}
          <Card className="hover:border-blue-300 transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Particulier</CardTitle>
              <CardDescription>
                Accès personnel à la plateforme de bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/b2c/login">
                  Se connecter - Particulier
                </Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Pas encore de compte ?{' '}
                <Link to="/b2c/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* B2B Selection */}
          <Card className="hover:border-purple-300 transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Entreprise</CardTitle>
              <CardDescription>
                Solutions pour entreprises et organisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/b2b/selection">
                  Accès Entreprise
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Connexion sécurisée - Données protégées RGPD</span>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-center gap-4">
            <Link to="/about" className="hover:text-primary">
              À propos
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              Confidentialité
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
