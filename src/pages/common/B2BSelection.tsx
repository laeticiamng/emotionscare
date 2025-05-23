
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleUserSelection = () => {
    setUserMode('b2b_user');
    navigate('/b2b/user/login');
  };
  
  const handleAdminSelection = () => {
    setUserMode('b2b_admin');
    navigate('/b2b/admin/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Mode Professionnel</CardTitle>
          <CardDescription>Choisissez votre type d'accès</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline"
            onClick={handleUserSelection}
            className="w-full justify-start h-auto p-4"
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium mb-1">Collaborateur</h3>
                <p className="text-sm text-muted-foreground">
                  Accédez à votre espace collaborateur
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleAdminSelection}
            className="w-full justify-start h-auto p-4"
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium mb-1">Administrateur</h3>
                <p className="text-sm text-muted-foreground">
                  Accédez à l'interface d'administration
                </p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="w-full mt-4"
          >
            Retour à la sélection du mode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BSelection;
