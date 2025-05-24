
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';
import { CURRENT_ROUTES } from '@/utils/routeUtils';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto px-4">
      <Button
        onClick={() => navigate(CURRENT_ROUTES.B2C_LOGIN)}
        size="lg"
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Espace Personnel</span>
      </Button>
      
      <Button
        onClick={() => navigate(CURRENT_ROUTES.B2B_SELECTION)}
        variant="outline"
        size="lg"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 sm:px-8 py-3 sm:py-4 text-base font-semibold rounded-full transition-all duration-300"
      >
        <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Espace Entreprise</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
