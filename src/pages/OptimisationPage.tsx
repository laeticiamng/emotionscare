
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

/**
 * Page d'optimisation RH (Admin)
 */
const OptimisationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Target className="h-8 w-8 text-orange-600" />
          Optimisation RH
        </h1>
        <p className="text-gray-600">
          Optimisez la performance et le bien-être de vos équipes
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Outils d'Optimisation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module d'optimisation RH en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimisationPage;
