
import React from 'react';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const ProductionMonitor: React.FC = () => {
  const { isMonitoring } = useProductionMonitoring();

  if (!import.meta.env.PROD || !isMonitoring) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Production Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs">Système</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Opérationnel
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Monitoring</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Actif
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionMonitor;
