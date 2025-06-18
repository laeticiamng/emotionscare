
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Glasses } from 'lucide-react';

/**
 * Page des expériences VR
 */
const VRPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Glasses className="h-8 w-8 text-cyan-600" />
          Expériences VR
        </h1>
        <p className="text-gray-600">
          Immergez-vous dans des expériences de réalité virtuelle apaisantes
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions VR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module VR en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRPage;
