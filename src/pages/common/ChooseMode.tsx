
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { User, Buildings, Shield } from 'lucide-react';

const ChooseMode: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUserMode } = useUserMode();
  
  const handleSelectMode = (mode: 'b2c' | 'b2b-user' | 'b2b-admin') => {
    setUserMode(mode);
    
    switch(mode) {
      case 'b2b-admin':
        navigate('/b2b/admin/dashboard');
        break;
      case 'b2b-user':
        navigate('/b2b/user/dashboard');
        break;
      case 'b2c':
      default:
        navigate('/b2c/dashboard');
        break;
    }
  };
  
  // Check if user has admin permissions
  const isAdmin = user?.role === 'b2b_admin' || user?.role === 'admin';
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Sélectionnez un mode</h1>
        <p className="text-center text-muted-foreground mb-8">
          {user?.name ? `Bienvenue, ${user.name}. ` : ''}
          Choisissez comment vous souhaitez utiliser EmotionsCare aujourd'hui.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Particulier</CardTitle>
              <CardDescription>Mode personnel pour votre bien-être individuel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleSelectMode('b2c')} className="w-full">
                Sélectionner
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
                <Buildings className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>Mode professionnel pour le bien-être au travail</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleSelectMode('b2b-user')} variant="outline" className="w-full">
                Sélectionner
              </Button>
            </CardContent>
          </Card>
          
          {isAdmin && (
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-purple-500/10 p-3 rounded-full w-fit mb-4">
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Administration</CardTitle>
                <CardDescription>Gérez les équipes et accédez aux rapports</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleSelectMode('b2b-admin')} variant="outline" className="w-full">
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseMode;
