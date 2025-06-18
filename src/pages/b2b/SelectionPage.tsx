
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const SelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Espace Entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Choisissez votre profil d'accès
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(UNIFIED_ROUTES.B2B_USER_LOGIN)}
              className="w-full"
              variant="outline"
            >
              Collaborateur
            </Button>
            <Button 
              onClick={() => navigate(UNIFIED_ROUTES.B2B_ADMIN_LOGIN)}
              className="w-full"
            >
              Administration RH
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectionPage;
