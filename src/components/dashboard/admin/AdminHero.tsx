// @ts-nocheck

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface AdminKpi {
  key: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface AdminAction {
  label: string;
  icon: LucideIcon;
  to: string;
  variant?: 'default' | 'secondary' | 'outline';
}

interface AdminHeroProps {
  kpis: AdminKpi[];
  actions: AdminAction[];
  isLoading?: boolean;
}

const AdminHero: React.FC<AdminHeroProps> = ({ 
  kpis, 
  actions,
  isLoading = false 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status?: 'success' | 'warning' | 'error' | 'info') => {
    switch (status) {
      case 'success': return 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300';
      case 'warning': return 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300';
      case 'error': return 'bg-destructive-50 text-destructive-700 dark:bg-destructive-900/30 dark:text-destructive-300';
      case 'info': return 'bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-300';
      default: return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300';
    }
  };
  
  return (
    <div className="bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-2xl mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-h1 text-secondary-700 dark:text-secondary-300 mb-1">
            Tableau de bord Direction
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des métriques organisationnelles
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.to}
                variant={action.variant || "default"}
                size="sm"
                onClick={() => navigate(action.to)}
                className="shadow-sm hover:shadow-md"
              >
                <Icon size={16} className="mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.key} className="border border-secondary-100 dark:border-secondary-800 transition-all duration-300 hover:shadow-md">
              <CardContent className="flex items-center p-4">
                {isLoading ? (
                  <div className="flex gap-4 w-full items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800/50 mr-4">
                      <Icon className="w-6 h-6 text-secondary-600 dark:text-secondary-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1 flex justify-between items-center">
                        <span>{kpi.label}</span>
                        {kpi.status && (
                          <Badge variant="outline" className={`ml-2 ${getStatusColor(kpi.status)}`}>
                            {kpi.status}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-h3 text-foreground font-semibold">
                          {kpi.value}
                        </div>
                        {kpi.change && (
                          <div className={`text-xs ml-2 ${kpi.change.isPositive ? 'text-success-600 dark:text-success-400' : 'text-destructive-600 dark:text-destructive-400'}`}>
                            {kpi.change.isPositive ? '+' : ''}{kpi.change.value}%
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHero;
