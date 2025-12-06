// @ts-nocheck

import { useState, useCallback, RefObject } from 'react';

// Define the brush index interface
export interface BrushStartEndIndex {
  startIndex?: number;
  endIndex?: number;
}

export interface UseChartZoomProps {
  data: any[];
  chartRef: RefObject<HTMLDivElement>;
  segment?: {
    dimensionKey: string | null;
    optionKey: string | null;
  };
}

export interface UseChartZoomReturn {
  startIndex: number;
  endIndex: number;
  visibleData: any[];
  isPanning: boolean;
  handleBrushChange: (brushIndexes: BrushStartEndIndex) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
}

export function useChartZoom({ data, chartRef, segment }: UseChartZoomProps): UseChartZoomReturn {
  // State for zoom domain indexes
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(data.length - 1);
  
  // State for panning
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; index: number }>({ x: 0, index: 0 });

  // Reset zoom when data or segment changes
  // This ensures the chart shows the complete new dataset when segment changes
  useCallback(() => {
    setStartIndex(0);
    setEndIndex(data.length - 1);
  }, [data, segment?.dimensionKey, segment?.optionKey]);

  // Calculate visible data range
  const visibleData = data.slice(startIndex, endIndex + 1);
  
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

  return {
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
  };
}
