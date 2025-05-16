
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-slate-900">
      <h1 className="text-4xl font-bold mb-12 text-center">Accès Espace Entreprise</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/b2b/user/login')}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Espace Collaborateur</h2>
            <p className="text-muted-foreground">
              Accédez à votre espace personnel au sein de l'entreprise pour suivre votre bien-être et vos émotions.
            </p>
            <Button className="w-full">Connexion Collaborateur</Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/b2b/admin/login')}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Espace Administrateur</h2>
            <p className="text-muted-foreground">
              Visualisez les données agrégées et anonymisées de votre organisation et planifiez des actions ciblées.
            </p>
            <Button variant="outline" className="w-full">Connexion Administrateur</Button>
          </div>
        </Card>
      </div>

      <Button variant="ghost" className="mt-8" onClick={() => navigate('/')}>
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default B2BSelection;
