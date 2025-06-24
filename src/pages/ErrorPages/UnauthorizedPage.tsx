
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/transitions/PageTransition';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition mode="fade">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-sm border border-amber-200 dark:border-amber-800">
              <strong>Action requise :</strong> Connectez-vous avec un compte autorisé.
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/b2c/login')} className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
              
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Code d'erreur : 401 - Non autorisé
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default UnauthorizedPage;
