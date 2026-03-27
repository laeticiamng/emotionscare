// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = 'info',
  subtitle 
}: MetricCardProps) => {
  const statusColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className={cn('h-5 w-5', statusColors[status])} />
        </div>
        {trend && (
          <div className="mt-2">
            <Badge 
              variant={trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
