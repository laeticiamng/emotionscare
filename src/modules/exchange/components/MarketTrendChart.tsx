/**
 * Market Trend Chart - Mini sparkline chart for market trends
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MarketTrendChartProps {
  data: number[];
  label: string;
  color?: string;
  showChange?: boolean;
  height?: number;
}

export const MarketTrendChart: React.FC<MarketTrendChartProps> = ({
  data,
  label,
  color = 'hsl(var(--primary))',
  showChange = true,
  height = 40,
}) => {
  const { path, trend, changePercent, minVal, maxVal } = useMemo(() => {
    if (data.length < 2) {
      return { path: '', trend: 'stable' as const, changePercent: 0, minVal: 0, maxVal: 0 };
    }

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    
    const width = 100;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const path = `M${points.join(' L')}`;
    
    const firstVal = data[0];
    const lastVal = data[data.length - 1];
    const changePercent = ((lastVal - firstVal) / firstVal) * 100;
    const trend: 'up' | 'down' | 'stable' = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable';

    return { path, trend, changePercent, minVal, maxVal };
  }, [data, height]);

  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    down: { icon: TrendingDown, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    stable: { icon: Minus, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  };

  const { icon: TrendIcon, color: trendColor, bgColor } = trendConfig[trend];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              {showChange && (
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${bgColor}`}>
                  <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                  <span className={`text-xs font-medium ${trendColor}`}>
                    {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <svg
              width="100%"
              height={height}
              viewBox={`0 0 100 ${height}`}
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              {data.length >= 2 && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  d={`${path} L100,${height} L0,${height} Z`}
                  fill={`url(#gradient-${label})`}
                />
              )}
              
              {/* Line */}
              {data.length >= 2 && (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Current point */}
              {data.length >= 2 && (
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  cx="100"
                  cy={height - ((data[data.length - 1] - minVal) / (maxVal - minVal || 1)) * (height - 8) - 4}
                  r="3"
                  fill={color}
                />
              )}
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{label}</p>
            <p className="text-muted-foreground">
              Min: {minVal.toFixed(0)} | Max: {maxVal.toFixed(0)}
            </p>
            <p className={trendColor}>
              Variation: {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MarketStatsCardProps {
  title: string;
  value: string | number;
  data: number[];
  icon: React.ReactNode;
  color?: string;
}

export const MarketStatsCard: React.FC<MarketStatsCardProps> = ({
  title,
  value,
  data,
  icon,
  color,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <span className="text-xl font-bold">{value}</span>
        </div>
        <MarketTrendChart 
          data={data} 
          label="7 derniers jours" 
          color={color}
          height={32}
        />
      </CardContent>
    </Card>
  );
};

export default MarketTrendChart;
