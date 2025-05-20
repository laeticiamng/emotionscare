
import React, { useState, useRef, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomableChartProps {
  data: Array<any>;
  xKey: string;
  yKey: string;
  width?: string | number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  stroke?: string;
  fill?: string;
  className?: string;
  name?: string;
}

export const ZoomableChart: React.FC<ZoomableChartProps> = ({
  data,
  xKey,
  yKey,
  width = "100%",
  height = 300,
  margin = { top: 5, right: 20, bottom: 20, left: 20 },
  stroke = "#8884d8",
  fill = "#8884d8",
  className,
  name = "Value",
}) => {
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const chartRef = useRef<any>(null);
  
  const handleZoomIn = useCallback(() => {
    if (!data.length) return;
    
    if (zoomDomain) {
      const length = zoomDomain.end - zoomDomain.start;
      const mid = (zoomDomain.start + zoomDomain.end) / 2;
      const newStart = Math.max(0, Math.floor(mid - length / 4));
      const newEnd = Math.min(data.length - 1, Math.ceil(mid + length / 4));
      setZoomDomain({ start: newStart, end: newEnd });
    } else {
      const length = data.length;
      const start = Math.floor(length / 4);
      const end = Math.ceil(3 * length / 4);
      setZoomDomain({ start, end });
    }
  }, [data, zoomDomain]);
  
  const handleZoomOut = useCallback(() => {
    if (!data.length) return;
    
    if (zoomDomain) {
      const length = zoomDomain.end - zoomDomain.start;
      const mid = (zoomDomain.start + zoomDomain.end) / 2;
      const newStart = Math.max(0, Math.floor(mid - length));
      const newEnd = Math.min(data.length - 1, Math.ceil(mid + length));
      
      // If we're already showing most of the data, reset to full view
      if (newStart <= 0 && newEnd >= data.length - 1) {
        setZoomDomain(null);
      } else {
        setZoomDomain({ start: newStart, end: newEnd });
      }
    }
  }, [data, zoomDomain]);
  
  const resetZoom = useCallback(() => {
    setZoomDomain(null);
  }, []);

  // Filter data based on zoom domain
  const displayData = zoomDomain 
    ? data.slice(zoomDomain.start, zoomDomain.end + 1) 
    : data;

  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-0 right-0 flex gap-1 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleZoomOut}
          disabled={!zoomDomain}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={resetZoom}
          disabled={!zoomDomain}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <ResponsiveContainer width={width} height={height}>
        <AreaChart
          ref={chartRef}
          data={displayData}
          margin={margin}
        >
          <defs>
            <linearGradient id={`colorGradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            name={name}
            stroke={stroke}
            fillOpacity={1}
            fill={`url(#colorGradient-${yKey})`}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
