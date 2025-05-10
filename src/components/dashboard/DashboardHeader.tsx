
import React from 'react';
import { User } from '@/types';
import { Separator } from '@/components/ui/separator';
import AutoRefreshControl from '@/components/dashboard/AutoRefreshControl';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface DashboardHeaderProps {
  user: User | null;
  isAdmin?: boolean;
  onRefresh?: () => Promise<any>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  user, 
  isAdmin = false,
  onRefresh = async () => { return null; } 
}) => {
  const {
    enabled: autoRefreshEnabled,
    interval: autoRefreshInterval,
    refreshing,
    toggleAutoRefresh,
    changeInterval
  } = useAutoRefresh({
    onRefresh,
    defaultEnabled: false,
    defaultInterval: 60000 // 1 minute default
  });
  
  return (
    <>
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1>
              {isAdmin ? (
                <>Tableau de bord <span className="font-semibold">Direction</span></>
              ) : (
                <>Bienvenue, <span className="font-semibold">{user?.name || 'utilisateur'}</span></>
              )}
            </h1>
            <h2 className="text-muted-foreground mt-2">
              {isAdmin ? 'Métriques globales et anonymisées' : 'Votre espace bien-être personnel'}
            </h2>
          </div>
          
          <div className="mt-4 md:mt-0">
            <AutoRefreshControl
              enabled={autoRefreshEnabled}
              interval={autoRefreshInterval}
              refreshing={refreshing}
              onToggle={toggleAutoRefresh}
              onIntervalChange={changeInterval}
            />
          </div>
        </div>
      </div>
      
      <Separator className="mb-8" />
    </>
  );
};

export default DashboardHeader;
