
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would register the user
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Nom complet</label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Mot de passe</label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password">Confirmer le mot de passe</label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit" className="w-full">S'inscrire</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
