
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

/**
 * Page du coach IA
 */
const CoachPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Bot className="h-8 w-8 text-green-600" />
          Coach IA
        </h1>
        <p className="text-gray-600">
          Votre assistant personnel pour le bien-être émotionnel
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interface Coach IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de coach IA en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
