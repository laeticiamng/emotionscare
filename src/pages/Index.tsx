
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';
import WelcomeHero from '@/components/home/WelcomeHero';
import ModulesSection from '@/components/home/ModulesSection';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <WelcomeHero userName={user?.name} />
      
      {/* Boutons de connexion plus visibles */}
      {!isAuthenticated && (
        <div className="my-8 bg-muted rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Accédez à votre espace</h2>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour accéder à toutes les fonctionnalités de l'application
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full">
              <Link to="/login" className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Espace Utilisateur
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/admin-login" className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Espace Direction
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="my-8 bg-primary/10 rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Votre espace personnel</h2>
            <p className="text-muted-foreground mt-2">
              Accédez à votre tableau de bord pour explorer toutes les fonctionnalités
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full">
              <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center justify-center gap-2">
                {isAdmin ? (
                  <>
                    <Shield className="h-5 w-5" />
                    Dashboard Administration
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    Mon tableau de bord
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      <div className="my-16">
        <ModulesSection showHeading={true} />
      </div>
      
      <div className="my-16 bg-card rounded-3xl p-8 shadow-sm">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Prêt à commencer votre voyage vers le bien-être ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {isAuthenticated 
              ? "Continuez votre expérience en accédant à votre tableau de bord personnalisé."
              : "Créez un compte ou connectez-vous pour accéder à toutes nos fonctionnalités et commencer à suivre votre bien-être émotionnel."}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="gap-2">
                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  Accéder au tableau de bord
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/register">
                    Créer un compte
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">
                    Se connecter
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
