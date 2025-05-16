
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2CCoachChat: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Coach Chat</h1>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Discussion avec votre coach IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Votre conversation avec votre coach personnel sera affichée ici.
          </p>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p>Contenu du chat à implémenter...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CCoachChat;
