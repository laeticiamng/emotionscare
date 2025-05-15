
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode, UserModeType } from '@/types/userMode';
import { compareRoles } from '@/utils/roleUtils';

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
  const normalizedUserMode = normalizeUserMode(userMode);
  
  // Helper function to determine trend direction
  const getTrendDirection = (trend: number | { value: number; direction: 'up' | 'down' | 'neutral' }) => {
    if (typeof trend === 'number') {
      return trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
    }
    return trend?.direction || 'neutral';
  };

  // Helper function to determine if it's a B2B user mode
  const isB2BUserMode = () => {
    return normalizedUserMode === 'b2b-user' || normalizedUserMode === 'b2b_user';
  };

  // Helper function to determine if it's a B2B admin mode
  const isB2BAdminMode = () => {
    return normalizedUserMode === 'b2b-admin' || normalizedUserMode === 'b2b_admin';
  };

  // Helper function for determining shortcuts based on user mode
  const getFilteredShortcuts = () => {
    // For B2B users, filter out certain shortcuts
    if (isB2BUserMode()) {
      return shortcuts.filter(shortcut => !shortcut.to.includes('/marketplace'));
    }
    
    // For B2B admins, show admin specific shortcuts
    if (isB2BAdminMode()) {
      return shortcuts.filter(shortcut => 
        !shortcut.to.includes('/marketplace') && 
        !shortcut.to.includes('/personal')
      );
    }
    
    // For B2C users, show all shortcuts
    return shortcuts;
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Bonjour";
    } else if (hour < 18) {
      return "Bon après-midi";
    } else {
      return "Bonsoir";
    }
  };

  // Get custom title based on user mode
  const getTitle = () => {
    if (isB2BUserMode()) {
      return "Tableau de bord professionnel";
    } else if (isB2BAdminMode()) {
      return "Gestion d'équipe";
    } else {
      return "Votre espace personnel";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground">
          {getTitle()}
        </p>
      </div>
      
      {/* KPIs section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.key}>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="text-2xl font-bold mt-2">{kpi.value}</div>
              
              {kpi.trend && (
                <div className={`text-xs mt-1 flex items-center ${
                  getTrendDirection(kpi.trend) === 'up' ? 'text-green-600' : 
                  getTrendDirection(kpi.trend) === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {typeof kpi.trend === 'number' ? 
                    `${kpi.trend > 0 ? '+' : ''}${kpi.trend}%` : 
                    `${kpi.trend.value > 0 ? '+' : ''}${kpi.trend.value}%`
                  }
                  {' depuis la dernière semaine'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Shortcuts section */}
      <div>
        <h2 className="text-lg font-medium mb-3">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getFilteredShortcuts().map((shortcut) => (
            <Button
              key={shortcut.to}
              variant="outline"
              className="h-auto p-4 justify-start text-left flex flex-col items-start gap-1"
              onClick={() => navigate(shortcut.to)}
            >
              <div className="flex items-center gap-2">
                <shortcut.icon className="h-5 w-5" />
                <span>{shortcut.label}</span>
              </div>
              
              {shortcut.description && (
                <span className="text-xs text-muted-foreground">{shortcut.description}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
