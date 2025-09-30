// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardHeaderProps {
  onRefresh?: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { user } = useAuth();

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          {user ? `Bienvenue, ${user.name}` : 'Aperçu de votre bien-être'}
        </p>
      </div>
      
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
