
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/types/userMode';

export interface DashboardKpi {
  key: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  } | number;
}

export interface DashboardShortcut {
  label: string;
  name?: string; // Made optional for compatibility
  icon: LucideIcon;
  to: string;
  description?: string;
}

interface DashboardHeroProps {
  userName: string;
  kpis: DashboardKpi[];
  shortcuts: DashboardShortcut[];
  isLoading?: boolean;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ 
  userName, 
  kpis, 
  shortcuts,
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  
  // Helper function to determine trend direction
  const getTrendDirection = (trend: number | { value: number; direction: 'up' | 'down' | 'neutral' }) => {
    if (typeof trend === 'number') {
      return trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
    }
    return trend.direction;
  };
  
  // Helper function to get trend value
  const getTrendValue = (trend: number | { value: number; direction: 'up' | 'down' | 'neutral' }) => {
    if (typeof trend === 'number') {
      return Math.abs(trend);
    }
    return trend.value;
  };

  // Get greeting based on user mode
  const getGreeting = () => {
    const normalizedMode = normalizeUserMode(userMode);
    
    switch(normalizedMode) {
      case 'b2b-admin':
      case 'b2b_admin':
        return "Tableau RH";
      case 'b2b-user':
      case 'b2b_user':
        return "Bonjour";
      case 'b2c':
        return "Bienvenue";
      default:
        return "Bonjour";
    }
  };
  
  // Check if it's B2B mode
  const isB2BMode = () => {
    const normalizedMode = normalizeUserMode(userMode);
    return normalizedMode === 'b2b-admin' || 
           normalizedMode === 'b2b_admin' || 
           normalizedMode === 'b2b-user' || 
           normalizedMode === 'b2b_user';
  };

  // Check if it's B2B Admin mode
  const isB2BAdmin = () => {
    const normalizedMode = normalizeUserMode(userMode);
    return normalizedMode === 'b2b-admin' || normalizedMode === 'b2b_admin';
  };
  
  // Check if it's B2B User mode
  const isB2BUser = () => {
    const normalizedMode = normalizeUserMode(userMode);
    return normalizedMode === 'b2b-user' || normalizedMode === 'b2b_user';
  };
  
  return (
    <div className={`p-6 rounded-2xl mb-8 animate-fade-in ${
      isB2BUser() ? 'bg-blue-50 dark:bg-blue-900/20' : 
      isB2BAdmin() ? 'bg-purple-50 dark:bg-purple-900/20' : 
      'bg-primary-50 dark:bg-primary-900/20'
    }`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Welcome message */}
        <div>
          <h1 className={`text-h1 mb-1 ${
            isB2BUser() ? 'text-blue-700 dark:text-blue-300' : 
            isB2BAdmin() ? 'text-purple-700 dark:text-purple-300' : 
            'text-primary-700 dark:text-primary-300'
          }`}>
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            {isB2BAdmin() 
              ? "Aperçu du bien-être collectif de l'équipe"
              : "Voici un aperçu de votre journée"}
          </p>
        </div>
        
        {/* Quick shortcuts */}
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Button
                key={shortcut.to}
                variant="outline"
                size="sm"
                onClick={() => navigate(shortcut.to)}
                className="shadow-sm hover:shadow-md"
                aria-label={shortcut.label}
              >
                <Icon size={16} className="mr-2" />
                {shortcut.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.key} className="border border-primary-100 dark:border-primary-800 transition-all duration-300 hover:shadow-md">
              <CardContent className="flex items-center p-4">
                <div className={`p-2 rounded-full mr-4 ${
                  isB2BUser() ? 'bg-blue-100 dark:bg-blue-800/50' : 
                  isB2BAdmin() ? 'bg-purple-100 dark:bg-purple-800/50' : 
                  'bg-primary-100 dark:bg-primary-800/50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isB2BUser() ? 'text-blue-500 dark:text-blue-300' : 
                    isB2BAdmin() ? 'text-purple-500 dark:text-purple-300' : 
                    'text-primary-500 dark:text-primary-300'
                  }`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  <div className="text-h3 text-foreground font-semibold">
                    {isLoading ? "—" : kpi.value}
                  </div>
                  {kpi.trend && (
                    <div className={`text-xs flex items-center ${
                      getTrendDirection(kpi.trend) === 'up' 
                        ? 'text-success-600 dark:text-success-400' 
                        : getTrendDirection(kpi.trend) === 'down' 
                          ? 'text-destructive-600 dark:text-destructive-400' 
                          : 'text-muted-foreground'
                    }`}>
                      {getTrendDirection(kpi.trend) === 'up' && '↑ '}
                      {getTrendDirection(kpi.trend) === 'down' && '↓ '}
                      {getTrendDirection(kpi.trend) === 'neutral' && '• '}
                      {getTrendValue(kpi.trend)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHero;
