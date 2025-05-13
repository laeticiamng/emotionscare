
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
        <div className="max-w-4xl mx-auto bg-primary/10 rounded-xl shadow-xl p-8 mb-12 border-2 border-primary/20 animate-pulse">
          <h2 className="text-4xl font-bold tracking-tight mb-8 text-center text-primary">
            Choisissez votre accès
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300 border-4 border-primary hover:scale-105 transform">
              <h3 className="text-2xl font-bold mb-4 text-primary">Particulier</h3>
              <p className="mb-6 text-lg text-muted-foreground">Accédez à votre espace personnel</p>
              <Button 
                onClick={() => navigate('/login')}
                size="lg" 
                className="w-full text-lg py-6"
              >
                Espace Personnel
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300 border-4 border-secondary hover:scale-105 transform">
              <h3 className="text-2xl font-bold mb-4 text-secondary">Entreprise</h3>
              <p className="mb-6 text-lg text-muted-foreground">Solutions pour votre organisation</p>
              <Button 
                onClick={() => navigate('/business')}
                variant="secondary"
                size="lg" 
                className="w-full text-lg py-6"
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
