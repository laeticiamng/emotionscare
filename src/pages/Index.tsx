
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import AccessSection from '@/components/home/AccessSection';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      toast.error("Vous devez vous connecter pour accéder au tableau de bord");
      navigate('/login');
    }
  };
  
  return (
    <Shell>
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Bienvenue sur EmotionsCare
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Votre plateforme de bien-être émotionnel
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {isAuthenticated ? (
              <Button size="lg" onClick={handleDashboardClick} className="px-6">
                Accéder à mon tableau de bord
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={handleLoginClick} className="px-6">
                  Se connecter
                </Button>
                <Button variant="outline" size="lg" onClick={handleRegisterClick} className="px-6">
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
        
        <AccessSection />
      </div>
    </Shell>
  );
};

export default Index;
