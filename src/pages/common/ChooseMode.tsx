
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Briefcase, Building, Building2 } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const ChooseMode: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleSelectMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/selection');
    } else {
      navigate('/b2b/selection');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription className="text-lg mt-2">
            Choisissez comment vous souhaitez utiliser notre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <Button
            onClick={() => handleSelectMode('b2c')}
            variant="outline"
            className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Particulier</h3>
              <p className="text-sm text-muted-foreground">
                Accédez à toutes les fonctionnalités personnalisables pour votre bien-être émotionnel
              </p>
            </div>
          </Button>
          
          <Button
            onClick={() => handleSelectMode('b2b_user')}
            variant="outline"
            className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Collaborateur</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez EmotionsCare dans le cadre de votre entreprise ou organisation
              </p>
            </div>
          </Button>
          
          <Button
            onClick={() => handleSelectMode('b2b_admin')}
            variant="outline"
            className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Administration</h3>
              <p className="text-sm text-muted-foreground">
                Gérez EmotionsCare pour votre entreprise et accédez aux tableaux de bord
              </p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChooseMode;
