
import React, { useRef } from 'react';
import { Brush } from 'recharts';
import { ChartControls } from './ChartControls';
import { ChartContainer } from './ChartContainer';
import { ChartDateRange } from './ChartDateRange';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from "@/lib/utils";
import { ChartConfig } from './types';
import { useChartZoom } from './hooks/useChartZoom';
import { useSegment } from '@/contexts/SegmentContext';

interface ZoomableChartProps {
  children: React.ReactNode;
  data: any[];
  className?: string;
  config: ChartConfig;
  brushDataKey?: string;
  brushHeight?: number;
  showControls?: boolean;
}

export const ZoomableChart: React.FC<ZoomableChartProps> = ({
  children,
  data,
  className,
  config,
  brushDataKey = "date",
  brushHeight = 30,
  showControls = true,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartRef = useRef<HTMLDivElement>(null);
  const { segment } = useSegment();
  
  const {
    startIndex,
    endIndex,
    visibleData,
    isPanning,
    handleBrushChange,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown,
    handleTouchStart
  } = useChartZoom({ data, chartRef, segment });
  
  // Format date range for display
  const dateRange = visibleData.length > 0 ? {
    start: visibleData[0][brushDataKey],
    end: visibleData[visibleData.length - 1][brushDataKey]
  } : { start: '', end: '' };

  // Handle empty data state
  if (data.length === 0) {
    return (
      <div className={cn("relative flex flex-col items-center justify-center h-64", className)}>
        <p className="text-muted-foreground text-center">
          Aucune donnée disponible
          {segment.dimensionKey && segment.optionKey && (
            <> pour ce segment</>
          )}
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("relative", className)}>
      {showControls && (
        <ChartControls 
          onZoomIn={zoomIn} 
          onZoomOut={zoomOut} 
          onReset={resetZoom} 
        />
      )}
      
      <div 
        ref={chartRef}
        className={cn(
          "select-none", 
          isPanning ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <ChartContainer config={config}>
          {/* Pass the filtered data to the child chart components */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // Type check for components that accept data prop
              return React.cloneElement(child as React.ReactElement<any>, {
                data: visibleData,
              });
            }
            return child;
          })}
          
          {/* Add the brush component */}
          <Brush
            dataKey={brushDataKey}
            height={brushHeight}
            stroke="#8884d8"
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={handleBrushChange}
            gap={5}
            y={10}
            alwaysShowText={false}
          />
        </ChartContainer>
      </div>
      
      {/* Date range display */}
      {dateRange.start && dateRange.end && (
        <ChartDateRange startDate={dateRange.start} endDate={dateRange.end} />
      )}
    </div>
  );
};
