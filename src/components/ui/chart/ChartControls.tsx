// @ts-nocheck

import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Grab } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1 absolute top-2 right-2 z-10", className)}>
      <Button 
        size="icon" 
        variant="outline" 
        className="w-8 h-8 rounded-full bg-white shadow hover:bg-gray-100 focus:ring-2"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button 
        size="icon" 
        variant="outline" 
        className="w-8 h-8 rounded-full bg-white shadow hover:bg-gray-100 focus:ring-2"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button 
        size="icon" 
        variant="outline" 
        className="w-8 h-8 rounded-full bg-white shadow hover:bg-gray-100 focus:ring-2"
        onClick={onReset}
        aria-label="Reset zoom"
      >
        <Grab className="h-4 w-4" />
      </Button>
    </div>
  );
};
