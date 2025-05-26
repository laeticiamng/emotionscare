
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Collaborateur
            </h1>
            <p className="text-gray-600">
              Bienvenue {user?.name || user?.email}
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes données personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Accédez à vos analyses personnelles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Participez aux activités d'équipe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
