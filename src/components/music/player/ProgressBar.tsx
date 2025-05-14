
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  formatTime?: (seconds: number) => string;
}

// Default time formatting function
const defaultFormatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  onChange,
  formatTime = defaultFormatTime
}) => {
  const handleValueChange = (values: number[]) => {
    if (onChange) {
      onChange(values[0]);
    }
  };

  return (
    <div className="space-y-1">
      <Slider
        value={[value]}
        max={max}
        step={1}
        onValueChange={handleValueChange}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(value)}</span>
        <span>{formatTime(max)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
