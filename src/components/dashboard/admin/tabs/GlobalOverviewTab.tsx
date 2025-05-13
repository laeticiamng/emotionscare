
import React, { useState, useEffect } from 'react';
import GdprDisclaimer from './overview/GdprDisclaimer';
import DraggableKpiCardsGrid from '../DraggableKpiCardsGrid';
import ChartSwitcher from '../../charts/ChartSwitcher';
import { ChartData, DashboardStats, GamificationData } from './overview/types';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import WidgetSettings, { widgetCatalog } from '../WidgetSettings';
import { toast } from "sonner";
import LoadingAnimation from '@/components/ui/loading-animation';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardWidgetConfig } from '@/types/dashboard';

interface GlobalOverviewTabProps {
  absenteeismChartData: ChartData[];
  emotionalScoreTrend: ChartData[];
  dashboardStats: DashboardStats;
  gamificationData: GamificationData;
  isLoading?: boolean;
}

// Default KPI card widget configurations
const defaultKpiWidgets: DashboardWidgetConfig[] = [
  {
    id: "absenteeism-card",
    type: "absenteeism-card",
    position: { x: 0, y: 0, w: 1, h: 1 },
    settings: { title: "Taux d'absentéisme", value: "4.2%", trend: "+0.5%" }
  },
  {
    id: "emotional-health-card",
    type: "emotional-health-card",
    position: { x: 1, y: 0, w: 1, h: 1 },
    settings: { title: "Santé émotionnelle", value: "82", trend: "+5%" }
  },
  {
    id: "productivity-card",
    type: "productivity-card",
    position: { x: 0, y: 1, w: 1, h: 1 },
    settings: { title: "Productivité", value: "87%", trend: "+3.2%" }
  },
  {
    id: "turnover-risk-card",
    type: "turnover-risk-card",
    position: { x: 1, y: 1, w: 1, h: 1 },
    settings: { title: "Risque de turnover", value: "8.5%", trend: "-1.5%" }
  }
];

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ 
  absenteeismChartData, 
  emotionalScoreTrend,
  dashboardStats,
  gamificationData,
  isLoading = false
}) => {
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [kpiWidgets, setKpiWidgets] = useState<DashboardWidgetConfig[]>(defaultKpiWidgets);
  
  // Load user widget preferences
  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem('dashboard.enabledWidgets');
      if (savedWidgets) {
        setEnabledWidgets(JSON.parse(savedWidgets));
      } else {
        // Default to all widgets
        setEnabledWidgets(widgetCatalog.filter(w => w.default).map(w => w.key));
      }

      // Try to load saved KPI widget configuration
      const savedKpiWidgets = localStorage.getItem('dashboard.kpiWidgets');
      if (savedKpiWidgets) {
        setKpiWidgets(JSON.parse(savedKpiWidgets));
      }
    } catch (error) {
      console.error('Error loading widget preferences:', error);
      // Fallback to all widgets if there's an error
      setEnabledWidgets(widgetCatalog.map(w => w.key));
      
      toast.error("Erreur de chargement", {
        description: "Impossible de charger vos préférences. Configuration par défaut utilisée."
      });
    }
  }, []);

  // Listen for changes to widget preferences in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard.enabledWidgets') {
        try {
          const newWidgets = e.newValue ? JSON.parse(e.newValue) : [];
          setEnabledWidgets(newWidgets);
        } catch (error) {
          console.error('Error parsing updated widget preferences:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle KPI widget ordering changes
  const handleKpiWidgetsChange = (updatedWidgets: DashboardWidgetConfig[]) => {
    setKpiWidgets(updatedWidgets);
    // Save to localStorage
    localStorage.setItem('dashboard.kpiWidgets', JSON.stringify(updatedWidgets));
  };

  // Determine if we should show an empty state
  const isEmpty = enabledWidgets.length === 0;

  if (isLoading && enabledWidgets.length > 0) {
    return (
      <div className="space-y-6">
        {enabledWidgets.includes('absenteeism') && (
          <Skeleton className="w-full h-64" />
        )}
        {enabledWidgets.includes('emotionalScore') && (
          <Skeleton className="w-full h-64" />
        )}
        {enabledWidgets.includes('kpiCards') && (
          <Skeleton className="w-full h-40" />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Settings Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsSettingsOpen(true)}
          disabled={isLoading}
        >
          <Settings size={16} />
          <span>Configurer widgets</span>
        </Button>
        <WidgetSettings 
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
      
      {isEmpty ? (
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-2">Aucun widget sélectionné</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Vous n'avez aucun widget activé sur votre tableau de bord.
          </p>
          <Button onClick={() => setIsSettingsOpen(true)}>
            <Settings size={16} className="mr-2" />
            Ajouter des widgets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charts with switcher - conditionally rendered */}
          {enabledWidgets.includes('absenteeism') && (
            <ChartSwitcher
              title="Taux d'absentéisme"
              description="Évolution du taux d'absence"
              availableViews={["line", "area"]}
              defaultView="line"
              data={absenteeismChartData}
            />
          )}
          
          {enabledWidgets.includes('emotionalScore') && (
            <ChartSwitcher
              title="Climate Émotionnel"
              description="Évolution du score émotionnel"
              availableViews={["line", "bar"]}
              defaultView="line"
              data={emotionalScoreTrend}
            />
          )}
          
          {/* KPI Summary Cards - conditionally rendered */}
          {enabledWidgets.includes('kpiCards') && (
            <DraggableKpiCardsGrid 
              widgets={kpiWidgets}
              onWidgetsChange={handleKpiWidgetsChange}
              dashboardStats={dashboardStats}
              gamificationData={gamificationData}
            />
          )}
          
          {/* GDPR Disclaimer - conditionally rendered */}
          {enabledWidgets.includes('gdprDisclaimer') && (
            <GdprDisclaimer />
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalOverviewTab;
