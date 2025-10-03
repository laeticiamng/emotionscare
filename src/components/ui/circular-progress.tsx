import React from 'react';
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: string | number;
  thickness?: string | number;
  color?: string;
  trailColor?: string;
  label?: React.ReactNode;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  strokeLinecap?: 'round' | 'square' | 'butt';
}

export const CircularProgress = ({
  value,
  max = 100,
  size = 64,
  thickness = 8,
  color = "var(--primary)",
  trailColor = "var(--muted)",
  label,
  showValue = false,
  className,
  valueClassName,
  strokeLinecap = 'round'
}: CircularProgressProps) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  // Calculate SVG values
  const radius = 50 - (+thickness / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}
         style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={trailColor}
          strokeWidth={thickness}
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap={strokeLinecap}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {label ? (
          label
        ) : showValue ? (
          <span className={cn("text-sm font-medium", valueClassName)}>
            {Math.round(percentage)}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default CircularProgress;
