
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    navigate('/b2b/user/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Building className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Inscription - Espace Entreprise</CardTitle>
          <CardDescription>Demandez un accès à votre espace professionnel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
                <Input id="firstName" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
                <Input id="lastName" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email professionnel</label>
              <Input id="email" placeholder="prenom.nom@entreprise.com" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Entreprise</label>
              <Input id="company" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">Poste occupé</label>
              <Input id="position" required />
            </div>
            <Button type="submit" className="w-full">Demander un accès</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" type="button" onClick={() => navigate('/b2b/user/login')}>
            J'ai déjà un compte
          </Button>
          <Button variant="ghost" className="w-full" type="button" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2BUserRegister;
