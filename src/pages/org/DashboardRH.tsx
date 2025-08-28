import React from 'react';
import { FiltersBar } from '@/components/org/FiltersBar';
import { VibesHeatmap } from '@/components/org/VibesHeatmap';
import { TrendBadges } from '@/components/org/TrendBadges';
import { HeatmapSummarySR } from '@/components/org/HeatmapSummarySR';
import { ExportControls } from '@/components/org/ExportControls';
import { useOrgWeekly } from '@/hooks/useOrgWeekly';
import { useOrgStore } from '@/store/org.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart3 } from 'lucide-react';

const SkeletonHeatmap: React.FC = () => (
  <div className="space-y-4">
    <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
    <div className="grid gap-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-2">
          <div className="w-48 h-12 bg-muted rounded animate-pulse" />
          {[1, 2, 3, 4, 5, 6, 7].map(j => (
            <div key={j} className="w-20 h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Alert>
    <AlertDescription className="flex items-center justify-between">
      <span>Données indisponibles. Vérifiez votre connexion.</span>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Réessayer
      </Button>
    </AlertDescription>
  </Alert>
);

export default function DashboardRH() {
  const { data, isLoading, error, mutate } = useOrgWeekly();
  const renderMode = useOrgStore(state => state.renderMode);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Heatmap Vibes
          </h1>
          <p className="text-muted-foreground">
            Vision d'équipe anonyme et instantanée du moral collectif
          </p>
        </div>
        
        <ExportControls />
      </div>

      {/* Filters */}
      <FiltersBar />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Moral d'équipe par jour</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <SkeletonHeatmap />}
              {error && <ErrorState onRetry={() => mutate()} />}
              {data && (
                <>
                  <VibesHeatmap 
                    data={data} 
                    renderMode={data.teams.length > 50 ? 'canvas' : renderMode}
                  />
                  <HeatmapSummarySR data={data} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trends Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tendances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              )}
              {data && <TrendBadges teams={data.teams.filter(t => t.eligible)} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}