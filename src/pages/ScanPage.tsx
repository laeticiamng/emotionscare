
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from 'lucide-react';

/**
 * Page de scan des émotions
 */
const ScanPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Scan className="h-8 w-8 text-blue-600" />
          Scanner d'Émotions
        </h1>
        <p className="text-gray-600">
          Analysez vos émotions en temps réel grâce à notre technologie avancée
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner Émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de scan des émotions en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
