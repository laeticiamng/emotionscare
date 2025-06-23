
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const B2BUserLoginPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion Collaborateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email professionnel</Label>
            <Input id="email" type="email" placeholder="votre@entreprise.com" />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">Se connecter</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserLoginPage;
