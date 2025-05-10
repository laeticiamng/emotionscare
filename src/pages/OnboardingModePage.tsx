
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, User } from 'lucide-react';
import { UserMode, useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';

const OnboardingModePage: React.FC = () => {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();
  const { user } = useAuth();
  
  // If user already has a mode selected, redirect to dashboard
  useEffect(() => {
    if (userMode && user) {
      navigate('/dashboard');
    }
  }, [userMode, user, navigate]);

  const handleModeSelection = (mode: UserMode) => {
    setUserMode(mode);
    
    // After setting the user mode, redirect to the appropriate onboarding or dashboard
    if (mode === 'b2b-admin' || mode === 'b2b-collaborator') {
      navigate('/onboarding?mode=business');
    } else {
      navigate('/onboarding?mode=personal');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-background dark:from-primary-900/20 dark:to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription className="text-lg mt-2">
            Choisissez comment vous souhaitez utiliser notre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <Button
            onClick={() => handleModeSelection('b2c')}
            variant="outline"
            className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <User size={48} className="text-primary" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Particulier</h3>
              <p className="text-sm text-muted-foreground">
                Accédez à toutes les fonctionnalités personnalisables pour votre bien-être émotionnel
              </p>
            </div>
          </Button>
          
          <Button
            onClick={() => handleModeSelection('b2b-collaborator')}
            variant="outline"
            className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Briefcase size={48} className="text-primary" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Professionnel</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez EmotionsCare dans le cadre de votre organisation (entreprise, école, structure de santé)
              </p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingModePage;
