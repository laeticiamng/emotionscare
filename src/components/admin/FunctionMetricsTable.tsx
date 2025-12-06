// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface FunctionMetric {
  name: string;
  errorRate: number;
  latencyP95: number;
  latencyP99: number;
  totalCalls: number;
  criticalAlerts: number;
}

interface FunctionMetricsTableProps {
  metrics: FunctionMetric[];
  onViewLogs?: (functionName: string) => void;
}

export const FunctionMetricsTable = ({ metrics, onViewLogs }: FunctionMetricsTableProps) => {
  const getHealthStatus = (metric: FunctionMetric) => {
    if (metric.errorRate > 5 || metric.latencyP95 > 2000) {
      return { label: 'Critique', variant: 'destructive' as const };
    }
    if (metric.errorRate > 2 || metric.latencyP95 > 1000) {
      return { label: 'Dégradé', variant: 'secondary' as const };
    }
    return { label: 'Sain', variant: 'default' as const };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Fonction</th>
            <th className="text-right py-3 px-4 font-medium">Appels</th>
            <th className="text-right py-3 px-4 font-medium">Erreurs</th>
            <th className="text-right py-3 px-4 font-medium">P95</th>
            <th className="text-right py-3 px-4 font-medium">P99</th>
            <th className="text-right py-3 px-4 font-medium">Alertes</th>
            <th className="text-right py-3 px-4 font-medium">Statut</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const health = getHealthStatus(metric);
            
            return (
              <tr key={metric.name} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium">
                    {metric.name.replace('gdpr-', '').split('-').map(w => 
                      w.charAt(0).toUpperCase() + w.slice(1)
                    ).join(' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.name}</div>
                </td>
                <td className="text-right py-3 px-4 tabular-nums">{metric.totalCalls.toLocaleString()}</td>
                <td className="text-right py-3 px-4">
                  <Badge variant={metric.errorRate < 1 ? 'default' : metric.errorRate < 5 ? 'secondary' : 'destructive'}>
                    {metric.errorRate.toFixed(2)}%
                  </Badge>
                </td>
                <td className="text-right py-3 px-4 tabular-nums">
                  <span className={metric.latencyP95 > 1000 ? 'text-orange-600 font-semibold' : ''}>
                    {metric.latencyP95.toFixed(0)}ms
                  </span>
                </td>
                <td className="text-right py-3 px-4 tabular-nums">
                  <span className={metric.latencyP99 > 2000 ? 'text-red-600 font-semibold' : ''}>
                    {metric.latencyP99.toFixed(0)}ms
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  {metric.criticalAlerts > 0 ? (
                    <Badge variant="destructive">{metric.criticalAlerts}</Badge>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
                <td className="text-right py-3 px-4">
                  <Badge 
                    variant={health.variant}
                    className={health.variant === 'default' ? 'bg-green-600' : ''}
                  >
                    {health.label}
                  </Badge>
                </td>
                <td className="text-right py-3 px-4">
                  {onViewLogs && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewLogs(metric.name)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
