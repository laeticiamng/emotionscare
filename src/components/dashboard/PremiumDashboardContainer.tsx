/**
 * Container de Dashboard Premium - 100% Experience
 * Performances optimisées, widgets avancés, et UX exceptionnelle
 */

import React, { Suspense, useMemo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Settings, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types pour les widgets
interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'activity' | 'quick-action' | 'insight';
  title: string;
  component: ComponentTypeGeneric;
  props?: any;
  size: 'small' | 'medium' | 'large' | 'xl';
  priority: number;
  refreshInterval?: number;
  permissions?: string[];
  premium?: boolean;
}

interface DashboardConfig {
  layout: 'grid' | 'masonry' | 'flex';
  columns: number;
  spacing: 'compact' | 'normal' | 'spacious';
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  autoRefresh: boolean;
}

interface PremiumDashboardContainerProps {
  userId?: string;
  widgets?: DashboardWidget[];
  config?: Partial<DashboardConfig>;
  onConfigChange?: (config: DashboardConfig) => void;
  className?: string;
}

// Composant d'erreur personnalisé
const DashboardErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <Card className="border-destructive/50 bg-destructive/10">
    <CardHeader>
      <CardTitle className="text-destructive flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Erreur du Dashboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Une erreur s'est produite lors du chargement du dashboard.
      </p>
      <Button onClick={resetErrorBoundary} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

// Skeleton de chargement pour les widgets
const WidgetSkeleton: React.FC<{ size: DashboardWidget['size'] }> = ({ size }) => {
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64',
    xl: 'h-80'
  };

  return (
    <Card className={cn('w-full', sizeClasses[size])}>
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};

// Wrapper de widget avec fonctionnalités avancées
const WidgetWrapper: React.FC<{
  widget: DashboardWidget;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}> = ({ widget, isExpanded, onToggleExpand, onRefresh, isRefreshing }) => {
  const WidgetComponent = widget.component;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative group',
        isExpanded && 'col-span-full row-span-2 z-10'
      )}
    >
      <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{widget.title}</CardTitle>
              {widget.premium && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <ErrorBoundary
            FallbackComponent={DashboardErrorFallback}
            resetKeys={[widget.id]}
          >
            <Suspense fallback={<WidgetSkeleton size={widget.size} />}>
              <WidgetComponent {...widget.props} expanded={isExpanded} />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant principal
const PremiumDashboardContainer: React.FC<PremiumDashboardContainerProps> = ({
  userId,
  widgets = [],
  config: initialConfig,
  onConfigChange,
  className
}) => {
  // État local
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [refreshingWidgets, setRefreshingWidgets] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<DashboardConfig>({
    layout: 'grid',
    columns: 3,
    spacing: 'normal',
    theme: 'auto',
    animations: true,
    autoRefresh: true,
    ...initialConfig
  });

  // Widgets triés par priorité
  const sortedWidgets = useMemo(() => {
    return [...widgets].sort((a, b) => b.priority - a.priority);
  }, [widgets]);

  // Gestion de l'expansion des widgets
  const handleToggleExpand = useCallback((widgetId: string) => {
    setExpandedWidget(prev => prev === widgetId ? null : widgetId);
  }, []);

  // Gestion du rafraîchissement
  const handleRefreshWidget = useCallback(async (widgetId: string) => {
    setRefreshingWidgets(prev => safeAdd(prev, widgetId));
    
    // Simuler le rechargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRefreshingWidgets(prev => {
      const newSet = new Set(prev);
      newSet.delete(widgetId);
      return newSet;
    });
  }, []);

  // Auto-refresh périodique
  useEffect(() => {
    if (!config.autoRefresh) return;

    const interval = setInterval(() => {
      // Rafraîchir les widgets qui ont un intervalle défini
      widgets.forEach(widget => {
        if (widget.refreshInterval) {
          handleRefreshWidget(widget.id);
        }
      });
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [config.autoRefresh, widgets, handleRefreshWidget]);

  // Classes CSS dynamiques
  const containerClasses = useMemo(() => {
    const baseClasses = 'w-full';
    const layoutClasses = {
      grid: `grid gap-${config.spacing === 'compact' ? '4' : config.spacing === 'spacious' ? '8' : '6'} grid-cols-1 md:grid-cols-2 lg:grid-cols-${config.columns}`,
      masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6',
      flex: 'flex flex-wrap gap-6'
    };

    return cn(baseClasses, layoutClasses[config.layout], className);
  }, [config, className]);

  // Gestion de la configuration
  const handleConfigUpdate = useCallback((updates: Partial<DashboardConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  return (
    <div className="space-y-6">
      {/* Barre d'outils du dashboard */}
      <div className="flex items-center justify-between bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Dashboard Premium
          </h2>
          <Badge variant="outline" className="text-xs">
            {sortedWidgets.length} widgets
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Personnaliser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Contenu du dashboard */}
      <div className={containerClasses}>
        <AnimatePresence>
          {sortedWidgets.map((widget) => (
            <WidgetWrapper
              key={widget.id}
              widget={widget}
              isExpanded={expandedWidget === widget.id}
              onToggleExpand={() => handleToggleExpand(widget.id)}
              onRefresh={() => handleRefreshWidget(widget.id)}
              isRefreshing={refreshingWidgets.has(widget.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun widget */}
      {sortedWidgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dashboard en cours de configuration</h3>
          <p className="text-muted-foreground mb-4">
            Vos widgets se chargeront automatiquement une fois votre profil configuré.
          </p>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurer maintenant
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PremiumDashboardContainer;