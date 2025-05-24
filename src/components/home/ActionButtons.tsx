
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';
import { CURRENT_ROUTES } from '@/utils/routeUtils';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <Button
        onClick={() => navigate(CURRENT_ROUTES.B2C_LOGIN)}
        size="lg"
        className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
      >
        <Heart className="h-5 w-5" />
        Espace Personnel
      </Button>
      
      <Button
        onClick={() => navigate(CURRENT_ROUTES.B2B_SELECTION)}
        variant="outline"
        size="lg"
        className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3"
      >
        <Building2 className="h-5 w-5" />
        Espace Entreprise
      </Button>
    </div>
  );
};

export default ActionButtons;
