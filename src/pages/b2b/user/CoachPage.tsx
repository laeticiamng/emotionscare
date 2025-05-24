
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const B2BUserCoachPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
      <Card>
        <CardHeader>
          <CardTitle>Assistant personnel</CardTitle>
          <CardDescription>Votre coach IA pour le bien-être émotionnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 border rounded-lg p-4 bg-gray-50">
              <p className="text-center text-muted-foreground">Conversation avec le coach IA</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Tapez votre message..." className="flex-1" />
              <Button>Envoyer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserCoachPage;
