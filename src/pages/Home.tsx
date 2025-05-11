
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  
  const handleUserAccess = () => {
    // For personal/B2C users
    setUserMode('b2c');
    navigate('/dashboard');
    toast({
      title: "Accès personnel",
      description: "Bienvenue dans votre espace personnel"
    });
  };
  
  const handleBusinessAccess = () => {
    // Redirect to business selection page
    navigate('/business');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bienvenue sur EmotionsCare
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Votre plateforme de bien-être émotionnel
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button onClick={handleUserAccess} className="bg-primary text-white px-6 py-2">
            Accès Personnel
          </Button>
          <Button onClick={handleBusinessAccess} variant="outline" className="px-6 py-2">
            Accès Entreprise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
