import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-muted-foreground">Accédez à votre espace bien-être</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Email" className="pl-9" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="Mot de passe" className="pl-9" />
          </div>
        </div>

        <Button className="w-full">Se connecter</Button>
      </div>
    </div>
  );
};

export default LoginPage;