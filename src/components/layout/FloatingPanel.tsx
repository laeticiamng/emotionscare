// @ts-nocheck

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  resizable?: boolean;
  minimizable?: boolean;
  className?: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  children,
  isOpen = true,
  onClose,
  position = 'bottom-right',
  size = 'md',
  resizable = false,
  minimizable = false,
  className
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-4 right-4';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-80 max-h-96';
      case 'md': return 'w-96 max-h-[32rem]';
      case 'lg': return 'w-[28rem] max-h-[40rem]';
      case 'xl': return 'w-[32rem] max-h-[48rem]';
      default: return 'w-96 max-h-[32rem]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            height: isMinimized ? 'auto' : undefined 
          }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          drag={!isDragging}
          dragMomentum={false}
          className={cn(
            "fixed z-50",
            getPositionClasses(),
            getSizeClasses(),
            isDragging && "cursor-grabbing",
            className
          )}
        >
          <Card className="h-full shadow-2xl border-2">
            {title && (
              <CardHeader className="pb-2 cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  <div className="flex gap-1">
                    {minimizable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsMinimized(!isMinimized)}
                        aria-label={isMinimized ? "Agrandir le panneau" : "Réduire le panneau"}
                      >
                        {isMinimized ? (
                          <Maximize2 className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Minimize2 className="h-3 w-3" aria-hidden="true" />
                        )}
                      </Button>
                    )}
                    {onClose && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onClose}
                        aria-label="Fermer le panneau"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            )}
            
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="p-4 overflow-auto">
                    {children}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Handle de redimensionnement */}
            {resizable && !isMinimized && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
              />
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingPanel;
