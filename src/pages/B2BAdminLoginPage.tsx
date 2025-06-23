
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const B2BAdminLoginPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email administrateur</Label>
            <Input id="email" type="email" placeholder="admin@entreprise.com" />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">Accès Admin</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminLoginPage;
