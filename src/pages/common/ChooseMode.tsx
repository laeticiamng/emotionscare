
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import Shell from '@/Shell';

const ChooseMode: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleChoose = (mode: 'b2c' | 'b2b-user' | 'b2b-admin') => {
    setUserMode(mode);
    
    switch(mode) {
      case 'b2b-admin':
        navigate('/b2b/admin/dashboard');
        break;
      case 'b2b-user':
        navigate('/b2b/user/dashboard');
        break;
      default:
        navigate('/b2c/dashboard');
        break;
    }
  };
  
  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choisissez un mode d'utilisation</h1>
            <p className="text-muted-foreground">
              Comment souhaitez-vous utiliser EmotionsCare aujourd'hui?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => handleChoose('b2c')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Personnel</CardTitle>
                <CardDescription>Usage individuel</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline">Choisir</Button>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => handleChoose('b2b-user')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-2">
                  <Building className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Professionnel</CardTitle>
                <CardDescription>Usage en entreprise</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline">Choisir</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ChooseMode;
