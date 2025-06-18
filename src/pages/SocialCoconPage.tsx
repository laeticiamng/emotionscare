
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

/**
 * Page du cocon social
 */
const SocialCoconPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Users className="h-8 w-8 text-pink-600" />
          Cocon Social
        </h1>
        <p className="text-gray-600">
          Connectez-vous avec votre communauté de bien-être
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Espace Communautaire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de cocon social en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialCoconPage;
