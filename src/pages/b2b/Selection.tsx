
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building } from 'lucide-react';
import Shell from '@/Shell';

const Selection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur EmotionsCare</h1>
            <p className="text-xl text-muted-foreground">
              Choisissez votre profil pour continuer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card 
              className="hover:shadow-lg transition-shadow transform hover:scale-105 cursor-pointer border-2 border-blue-200 dark:border-blue-800" 
              onClick={() => navigate('/b2b/user/login')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Collaborateur</CardTitle>
                <CardDescription>Accès collaborateur</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-sm">Accédez à votre espace personnel de bien-être émotionnel professionnel</p>
                <Button className="w-full">Je suis un collaborateur</Button>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow transform hover:scale-105 cursor-pointer border-2 border-emerald-200 dark:border-emerald-800" 
              onClick={() => navigate('/b2b/admin/login')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>RH / Manager</CardTitle>
                <CardDescription>Accès administrateur</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-sm">Gérez le bien-être émotionnel de vos équipes et de votre organisation</p>
                <Button variant="outline" className="w-full">Je suis RH ou manager</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Selection;
