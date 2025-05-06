
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface DashboardKpi {
  key: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface DashboardShortcut {
  label: string;
  icon: LucideIcon;
  to: string;
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
  
  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-h1 text-primary-700 dark:text-primary-300 mb-1">
            Bonjour, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre journée
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
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 mr-4">
                  <Icon className="w-6 h-6 text-primary-500 dark:text-primary-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  <div className="text-h3 text-foreground font-semibold">
                    {isLoading ? "—" : kpi.value}
                  </div>
                  {kpi.trend && (
                    <div className={`text-xs flex items-center ${
                      kpi.trend.direction === 'up' 
                        ? 'text-success-600 dark:text-success-400' 
                        : kpi.trend.direction === 'down' 
                          ? 'text-destructive-600 dark:text-destructive-400' 
                          : 'text-muted-foreground'
                    }`}>
                      {kpi.trend.direction === 'up' && '↑ '}
                      {kpi.trend.direction === 'down' && '↓ '}
                      {kpi.trend.direction === 'neutral' && '• '}
                      {kpi.trend.value}%
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
