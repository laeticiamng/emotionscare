
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeHero from '@/components/home/WelcomeHero';
import ModulesSection from '@/components/home/ModulesSection';
import { Shell } from '@/components/Shell';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Shell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WelcomeHero userName={user?.name} />
        
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
                  <Link to="/dashboard">
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
    </Shell>
  );
};

export default Index;
