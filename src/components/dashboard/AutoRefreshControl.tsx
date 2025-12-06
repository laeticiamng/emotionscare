
import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useIsMobile } from '@/hooks/use-mobile';

interface AutoRefreshControlProps {
  enabled: boolean;
  interval: number;
  refreshing: boolean;
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
}

const intervalOptions = [
  { value: 30000, label: '30 s' },
  { value: 60000, label: '1 min' },
  { value: 300000, label: '5 min' },
  { value: 900000, label: '15 min' },
];

const AutoRefreshControl: React.FC<AutoRefreshControlProps> = ({
  enabled,
  interval,
  refreshing,
  onToggle,
  onIntervalChange,
}) => {
  const isMobile = useIsMobile();
  const [flashUpdate, setFlashUpdate] = useState(false);
  
  // Flash effect when refresh completes
  useEffect(() => {
    if (refreshing === false) {
      setFlashUpdate(true);
      const timer = setTimeout(() => setFlashUpdate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [refreshing]);
  
  const handleIntervalChange = (value: string) => {
    onIntervalChange(Number(value));
  };

  return (
    <div className={`flex items-center gap-3 ${isMobile ? 'flex-col items-start' : 'flex-row'}`}>
      <div className="flex items-center gap-2">
        <Switch 
          id="auto-refresh" 
          checked={enabled} 
          onCheckedChange={onToggle}
          className={cn(
            "transition-colors",
            flashUpdate && "ring-2 ring-primary animation-pulse"
          )}
        />
        <Label 
          htmlFor="auto-refresh"
          className={cn(
            "text-sm font-medium transition-colors",
            enabled ? "text-accent-600" : "text-muted-foreground"
          )}
        >
          Auto-refresh
          {refreshing && (
            <RotateCw className="ml-1 inline-block h-3 w-3 animate-spin" />
          )}
        </Label>
      </div>
      
      {enabled && (
        <Select 
          value={interval.toString()} 
          onValueChange={handleIntervalChange}
        >
          <SelectTrigger className="h-8 w-[90px]">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            {intervalOptions.map(option => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default AutoRefreshControl;
