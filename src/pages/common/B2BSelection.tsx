
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, ShieldCheck } from 'lucide-react';
import Shell from '@/Shell';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Espace Entreprise</h1>
            <p className="text-xl text-muted-foreground">
              Veuillez choisir votre profil pour continuer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => navigate('/b2b/user/login')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Collaborateur</CardTitle>
                <CardDescription>Accès collaborateur</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-sm">Améliorez votre bien-être et vos performances au travail</p>
                <Button variant="outline">Accéder</Button>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => navigate('/b2b/admin/login')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Administration</CardTitle>
                <CardDescription>Accès RH / Direction</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-sm">Pilotez le bien-être de vos équipes et analysez les données</p>
                <Button variant="outline">Accéder</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default B2BSelection;
