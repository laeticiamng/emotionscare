import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SkipMotionToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

const SkipMotionToggle: React.FC<SkipMotionToggleProps> = ({
  enabled,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <label 
        htmlFor="reduce-motion"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Réduire les animations
      </label>
      <Switch
        id="reduce-motion"
        checked={enabled}
        onCheckedChange={onChange}
        aria-describedby="reduce-motion-description"
      />
      <div 
        id="reduce-motion-description" 
        className="sr-only"
      >
        Désactive les animations et mouvements pour une expérience plus calme
      </div>
    </div>
  );
};

export default SkipMotionToggle;