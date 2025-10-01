// @ts-nocheck
import React from 'react';
import { Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { X, LogOut } from 'lucide-react';

interface VRExitButtonProps {
  onExit: () => void;
  position?: [number, number, number];
  variant?: 'minimal' | 'full';
}

export const VRExitButton: React.FC<VRExitButtonProps> = ({
  onExit,
  position = [2, 1, -1], // Top right of field of view
  variant = 'minimal'
}) => {
  return (
    <Html
      position={position}
      transform
      occlude="blending"
      style={{
        pointerEvents: 'auto',
      }}
    >
      {variant === 'minimal' ? (
        // Minimal floating exit button
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="
            bg-red-900/80 hover:bg-red-800/90 text-white border-red-700/50 border
            backdrop-blur-sm rounded-full w-10 h-10 p-0
            transition-all duration-200 hover:scale-110
          "
          aria-label="Quitter la VR"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        // Full exit panel
        <div className="bg-red-900/80 backdrop-blur-sm rounded-lg p-3 border border-red-700/50">
          <Button
            onClick={onExit}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-800/50 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Quitter la VR
          </Button>
        </div>
      )}
    </Html>
  );
};