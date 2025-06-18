
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const UnifiedActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center max-w-lg mx-auto px-2 sm:px-4">
      <Button
        onClick={() => navigate(UNIFIED_ROUTES.B2C_LOGIN)}
        size="lg"
        className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
        <span className="truncate">Espace Personnel</span>
      </Button>
      
      <Button
        onClick={() => navigate(UNIFIED_ROUTES.B2B_SELECTION)}
        variant="outline"
        size="lg"
        className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold rounded-full transition-all duration-300"
      >
        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
        <span className="truncate">Espace Entreprise</span>
      </Button>
    </div>
  );
};

export default UnifiedActionButtons;
