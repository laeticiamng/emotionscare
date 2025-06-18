
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

/**
 * Page de gestion des équipes (Admin)
 */
const TeamsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Gestion des Équipes
        </h1>
        <p className="text-gray-600">
          Gérez vos équipes et leur bien-être
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interface de Gestion d'Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de gestion d'équipes en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamsPage;
