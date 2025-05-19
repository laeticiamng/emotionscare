
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const B2CForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@email.com" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full mb-4">Envoyer le lien de réinitialisation</Button>
          <Button variant="ghost" className="w-full" asChild>
            <a href="/b2c/login">Retour à la connexion</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2CForgotPasswordPage;
