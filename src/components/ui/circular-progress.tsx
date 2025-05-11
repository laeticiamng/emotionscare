
import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
  valueClassName?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  showValue = true,
  valueFormatter,
  className,
  valueClassName,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max === 0 ? 0 : (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formattedValue = valueFormatter
    ? valueFormatter(value)
    : `${Math.round(progress)}%`;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-muted-foreground/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showValue && (
        <div className={cn("absolute inset-0 flex items-center justify-center", valueClassName)}>
          <span className="text-center font-medium">{formattedValue}</span>
        </div>
      )}
    </div>
  );
};
