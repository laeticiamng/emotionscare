
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';
import Shell from '@/Shell';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserMode('b2c');
    navigate('/dashboard');
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="email@exemple.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Mot de passe</label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default LoginPage;
