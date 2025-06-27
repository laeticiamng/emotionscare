
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart3,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { routeMetadataService, RouteMetadata } from '@/services/routeMetadataService';

const RouteAuditDashboard: React.FC = () => {
  const [routes, setRoutes] = useState<RouteMetadata[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [routesData, statsData] = await Promise.all([
        routeMetadataService.getAllRoutes(),
        routeMetadataService.getCompletionStats()
      ]);
      
      setRoutes(routesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-600 bg-green-100';
    if (percentage > 0) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle className="w-4 h-4" />;
    if (percentage > 0) return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage === 100) return 'Complète';
    if (percentage > 0) return 'En cours';
    return 'Non démarrée';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total des routes</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Complètes</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À faire</p>
                <p className="text-3xl font-bold text-red-600">{stats.notStarted}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression globale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progression globale</span>
            <span className="text-sm font-normal">
              {Math.round((stats.completed / stats.total) * 100)}% complété
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(stats.completed / stats.total) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Liste détaillée des routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>État détaillé des routes</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((route, index) => (
              <motion.div
                key={route.route_path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-full ${getStatusColor(route.completion_percentage)}`}>
                    {getStatusIcon(route.completion_percentage)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{route.page_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {route.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{route.route_path}</p>
                    {route.features && route.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {route.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {route.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{route.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Progress value={route.completion_percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium min-w-12">
                        {route.completion_percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getStatusLabel(route.completion_percentage)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteAuditDashboard;
