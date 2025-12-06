import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const EmailDigestComposer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionnaire de digest email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Configuration des emails de digest à venir.</p>
      </CardContent>
    </Card>
  );
};

export default EmailDigestComposer;
