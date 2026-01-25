/**
 * Dashboard de synchronisation des modules
 * Affiche l'état de cohérence front/back de tous les modules
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Code, Server, Layers } from 'lucide-react';
import { useModuleSyncStatus, ModuleSyncStatus } from '@/hooks/useModuleSyncStatus';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const getCategoryIcon = (category: string): React.FC<{ className?: string }> => {
  const icons: Record<string, React.FC<{ className?: string }>> = {
    'Analyse': Code,
    'Bien-être': RefreshCw,
    'Musique': Layers,
    'Journal': Database,
    'Coaching': Server,
    'Immersif': Layers,
    'Gamification': Layers,
    'Social': Layers,
    'B2B': Server,
    'Analytics': Database,
  };
  return icons[category] || Layers;
};

const ModuleCard: React.FC<{ module: ModuleSyncStatus }> = ({ module }) => {
  const Icon = getCategoryIcon(module.category);
  
  return (
    <Card className={`transition-all ${
      module.syncScore === 100 
        ? 'border-green-500/20 bg-green-500/5' 
        : module.syncScore > 50 
          ? 'border-yellow-500/20 bg-yellow-500/5'
          : 'border-red-500/20 bg-red-500/5'
    }`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{module.name}</span>
          </div>
          {module.syncScore === 100 ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : module.syncScore > 50 ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sync</span>
            <span className="font-medium">{module.syncScore}%</span>
          </div>
          <Progress value={module.syncScore} className="h-1.5" />
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant={module.hasTable ? 'default' : 'destructive'} className="text-xs">
            Table
          </Badge>
          <Badge variant={module.hasEdgeFunction ? 'default' : 'destructive'} className="text-xs">
            Edge
          </Badge>
          <Badge variant={module.hasHook ? 'default' : 'destructive'} className="text-xs">
            Hook
          </Badge>
          <Badge variant={module.hasService ? 'default' : 'destructive'} className="text-xs">
            Service
          </Badge>
        </div>
        
        {module.issues.length > 0 && (
          <div className="mt-2 text-xs text-red-500">
            {module.issues[0]}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ModuleSyncDashboard: React.FC = () => {
  const { data: status, isLoading, refetch } = useModuleSyncStatus();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!status) return null;
  
  const categories = [...new Set(status.modules.map(m => m.category))];
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-primary">{status.overallScore}%</p>
            <p className="text-xs text-muted-foreground">Score Global</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold">{status.totalModules}</p>
            <p className="text-xs text-muted-foreground">Modules</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-500">{status.fullySync}</p>
            <p className="text-xs text-muted-foreground">Complets</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{status.partialSync}</p>
            <p className="text-xs text-muted-foreground">Partiels</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-red-500">{status.noSync}</p>
            <p className="text-xs text-muted-foreground">Manquants</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      {/* Modules by Category */}
      <Tabs defaultValue={categories[0]}>
        <TabsList className="flex flex-wrap">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="text-xs">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {status.modules
                .filter(m => m.category === category)
                .map(module => (
                  <ModuleCard key={module.name} module={module} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ModuleSyncDashboard;
