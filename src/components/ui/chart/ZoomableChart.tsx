
import React, { useState, useRef, useCallback } from 'react';
import { Brush } from 'recharts';
import { ChartControls } from './ChartControls';
import { ChartContainer } from './ChartContainer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from "@/lib/utils";
import { ChartConfig } from './types';

// Define our own BrushStartEndIndex interface since it's not exported from recharts
interface BrushStartEndIndex {
  startIndex?: number;
  endIndex?: number;
}

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
  
  // State for zoom domain indexes
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(data.length - 1);
  
  // State for panning
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; index: number }>({ x: 0, index: 0 });

  // Calculate visible data range
  const visibleData = data.slice(startIndex, endIndex + 1);
  
  // Format date range for display
  const dateRange = visibleData.length > 0 ? {
    start: visibleData[0][brushDataKey],
    end: visibleData[visibleData.length - 1][brushDataKey]
  } : { start: '', end: '' };
  
  // Handle brush change
  const handleBrushChange = useCallback((brushIndexes: BrushStartEndIndex) => {
    if (brushIndexes.startIndex !== undefined && brushIndexes.endIndex !== undefined) {
      setStartIndex(brushIndexes.startIndex);
      setEndIndex(brushIndexes.endIndex);
    }
  }, []);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    if (endIndex - startIndex <= 1) return; // Prevent zooming in too far
    
    const range = endIndex - startIndex;
    const center = Math.floor(startIndex + range / 2);
    const newRange = Math.max(2, Math.floor(range * 0.75));
    
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    
    setStartIndex(newStart);
    setEndIndex(newEnd);
  }, [startIndex, endIndex, data.length]);
  
  const zoomOut = useCallback(() => {
    const range = endIndex - startIndex;
    const center = Math.floor(startIndex + range / 2);
    const newRange = Math.min(data.length, Math.floor(range * 1.25));
    
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    
    setStartIndex(newStart);
    setEndIndex(newEnd);
  }, [startIndex, endIndex, data.length]);
  
  const resetZoom = useCallback(() => {
    setStartIndex(0);
    setEndIndex(data.length - 1);
  }, [data.length]);
  
  // Pan handling
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    
    const chartRect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - chartRect.left;
    
    setIsPanning(true);
    setPanStart({ x, index: startIndex });
    
    document.body.style.cursor = 'grabbing';
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!chartRef.current || !isPanning) return;
      
      const moveX = moveEvent.clientX - chartRect.left;
      const deltaX = moveX - panStart.x;
      
      // Calculate how many items to shift based on the drag distance
      const chartWidth = chartRect.width;
      const itemsPerPixel = (endIndex - startIndex) / chartWidth;
      const shift = Math.floor(deltaX * itemsPerPixel);
      
      // Calculate new indexes, ensuring they stay within bounds
      if (shift !== 0) {
        const newStartIndex = Math.max(0, panStart.index - shift);
        if (newStartIndex + (endIndex - startIndex) <= data.length - 1) {
          setStartIndex(newStartIndex);
          setEndIndex(newStartIndex + (endIndex - startIndex));
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsPanning(false);
      document.body.style.cursor = '';
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [startIndex, endIndex, isPanning, panStart.x, panStart.index, data.length]);
  
  // For mobile touch events
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    
    const chartRect = chartRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - chartRect.left;
    
    setIsPanning(true);
    setPanStart({ x, index: startIndex });
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!chartRef.current || !isPanning) return;
      
      const moveX = moveEvent.touches[0].clientX - chartRect.left;
      const deltaX = moveX - panStart.x;
      
      const chartWidth = chartRect.width;
      const itemsPerPixel = (endIndex - startIndex) / chartWidth;
      const shift = Math.floor(deltaX * itemsPerPixel);
      
      if (shift !== 0) {
        const newStartIndex = Math.max(0, panStart.index - shift);
        if (newStartIndex + (endIndex - startIndex) <= data.length - 1) {
          setStartIndex(newStartIndex);
          setEndIndex(newStartIndex + (endIndex - startIndex));
        }
      }
    };
    
    const handleTouchEnd = () => {
      setIsPanning(false);
      
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }, [startIndex, endIndex, isPanning, panStart.x, panStart.index, data.length]);

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
          {/* Clone the chart component and add startIndex/endIndex props */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
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
        <div className="text-xs text-center text-muted-foreground mt-2">
          Plage affichée : {dateRange.start} - {dateRange.end}
        </div>
      )}
    </div>
  );
};
