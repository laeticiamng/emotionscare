
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const B2CLoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre espace particulier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@email.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <a href="/b2c/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublié?
              </a>
            </div>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full mb-4">Se connecter</Button>
          <p className="text-sm text-center text-muted-foreground">
            Pas encore inscrit?{" "}
            <a href="/b2c/register" className="text-primary hover:underline">
              Créer un compte
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2CLoginPage;
