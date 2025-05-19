
import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartLine, BarChart2, BarChartHorizontal } from 'lucide-react';
import { AbsenteeismChart } from './AbsenteeismChart';
import { ProductivityChart } from './ProductivityChart';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ZoomableChart } from '@/components/ui/chart/ZoomableChart';
import { useSegment } from '@/contexts/SegmentContext';

export type ChartType = "line" | "bar" | "area";

export interface DataPoint {
  date: string;
  value: number;
}

export interface ChartSwitcherProps {
  title: string;
  description?: string;
  availableViews: ChartType[];
  defaultView?: ChartType;
  data: DataPoint[];
  isLoading?: boolean;
}

const ChartSwitcher: React.FC<ChartSwitcherProps> = ({
  title,
  description,
  availableViews,
  defaultView,
  data,
  isLoading = false
}) => {
  // Get segment context
  const { segment, activeDimension, activeOption } = useSegment();
  
  // Use the first available view as default if none specified
  const initialView = defaultView || availableViews[0] || "line";
  
  // Local state for the current view
  const [view, setView] = useState<ChartType>(initialView);
  
  // Get the storage key for this chart based on title
  const storageKey = `dashboard.view.${title.toLowerCase().replace(/\s+/g, '_')}`;
  
  // Load preferred view from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem(storageKey);
    if (savedView && availableViews.includes(savedView as ChartType)) {
      setView(savedView as ChartType);
    }
  }, [storageKey, availableViews]);
  
  // Save preference to localStorage when view changes
  useEffect(() => {
    localStorage.setItem(storageKey, view);
  }, [view, storageKey]);
  
  // Handle view change
  const handleViewChange = (newView: string) => {
    if (newView && availableViews.includes(newView as ChartType)) {
      setView(newView as ChartType);
    }
  };

  // Chart config for ZoomableChart
  const chartConfig = {
    value: { 
      theme: { 
        light: view === 'bar' ? '#4A90E2' : '#7ED321', 
        dark: view === 'bar' ? '#4A90E2' : '#7ED321' 
      },
      label: title
    },
  };

  // Render the appropriate chart based on current view
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-48 w-full flex items-center justify-center">
          <Skeleton className="h-36 w-full rounded-md animate-pulse" />
        </div>
      );
    }
    
    if (data.length === 0) {
      return (
        <div className="h-48 w-full flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            {activeDimension && activeOption ? (
              <>Aucune donnée pour {activeDimension?.label} → {activeOption?.label}</>
            ) : (
              <>Aucune donnée disponible</>
            )}
          </p>
        </div>
      );
    }
    
    switch (view) {
      case "line":
        return <AbsenteeismChart data={data} />;
      case "bar":
        return <ProductivityChart data={data} />;
      case "area":
        return <AbsenteeismChart data={data} />; // Reusing AbsenteeismChart as it's an area chart
      default:
        return <AbsenteeismChart data={data} />;
    }
  };

  // Icon mapping for each chart type
  const chartIcons = {
    line: <ChartLine className="h-4 w-4" />,
    bar: <BarChart2 className="h-4 w-4" />,
    area: <BarChartHorizontal className="h-4 w-4" />
  };

  // Accessibility labels for each chart type
  const chartLabels = {
    line: "Afficher la courbe",
    bar: "Afficher l'histogramme",
    area: "Afficher l'aire"
  };

  // Display loading state or segment filter messaging
  const getDescription = () => {
    if (isLoading) return "Chargement...";
    if (segment.dimensionKey && segment.optionKey && activeDimension && activeOption) {
      return `${description || ''} - ${activeDimension?.label}: ${activeOption?.label}`;
    }
    return description;
  };

  return (
    <div className={cn(
      "card-premium p-4 rounded-2xl shadow-sm transition-opacity duration-300",
      isLoading && "opacity-90"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            {isLoading ? <Skeleton className="h-6 w-36" /> : title}
          </h3>
          {getDescription() && (
            <p className="text-sm text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-24 mt-1" /> : getDescription()}
            </p>
          )}
        </div>
        
        <div className="mt-2 sm:mt-0">
          <ToggleGroup 
            type="single" 
            value={view} 
            onValueChange={handleViewChange} 
            aria-label="Sélection du type de graphique"
            disabled={isLoading}
            className={isLoading ? "opacity-50 pointer-events-none" : ""}
          >
            {availableViews.map((chartType) => (
              <ToggleGroupItem 
                key={chartType}
                value={chartType}
                aria-label={chartLabels[chartType]}
                aria-pressed={view === chartType}
                disabled={isLoading}
              >
                {chartIcons[chartType]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      
      <div className="h-48 w-full" aria-busy={isLoading}>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartSwitcher;
