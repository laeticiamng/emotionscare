
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ResetPasswordPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Réinitialiser le mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" />
          </div>
          <Button className="w-full">Envoyer le lien de réinitialisation</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
