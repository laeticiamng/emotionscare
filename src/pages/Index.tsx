
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import AccessSection from '@/components/home/AccessSection';
import HeroSection from '@/components/home/HeroSection';
import CtaSection from '@/components/home/CtaSection';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
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
  
  console.log("Rendering Index page, isAuthenticated:", isAuthenticated, "user:", user?.name);

  return (
    <Shell>
      <div className="container px-4 py-8 mx-auto">
        <HeroSection />
        
        {/* Connection Options - Highlighted with prominent styling */}
        <div className="max-w-3xl mx-auto bg-primary/5 rounded-xl shadow-lg p-8 mb-12 border-2 border-primary/20 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
            Choisissez votre accès
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-primary hover:scale-105">
              <h3 className="text-xl font-bold mb-3">Particulier</h3>
              <p className="mb-4 text-muted-foreground">Accédez à votre espace personnel</p>
              <Button 
                onClick={() => navigate('/login')}
                size="lg" 
                className="w-full"
              >
                Espace Personnel
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-secondary hover:scale-105">
              <h3 className="text-xl font-bold mb-3">Entreprise</h3>
              <p className="mb-4 text-muted-foreground">Solutions pour votre organisation</p>
              <Button 
                onClick={() => navigate('/business')}
                variant="secondary"
                size="lg" 
                className="w-full"
              >
                Espace Entreprise
              </Button>
            </div>
          </div>
        </div>
        
        <AccessSection />
        <CtaSection />
      </div>
    </Shell>
  );
};

export default Index;
