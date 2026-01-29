// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ScreenSilkModal } from './ScreenSilkModal';
import { useARAnalytics } from '@/hooks/useARAnalytics';

interface ScreenSilkButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ScreenSilkButton: React.FC<ScreenSilkButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { track } = useARAnalytics();

  const handleClick = () => {
    setIsOpen(true);
    track('silk.open', {});
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`gap-2 ${className}`}
        aria-label="Lancer une micro-pause Screen-Silk"
      >
        <Sparkles className="h-4 w-4" />
        Screen-Silk
      </Button>

      {isOpen && (
        <ScreenSilkModal 
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
};