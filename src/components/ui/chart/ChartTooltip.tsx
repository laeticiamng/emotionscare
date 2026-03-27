// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ChartTooltipProps {
  children: React.ReactNode;
  visible: boolean;
  x?: number;
  y?: number;
  offset?: { x?: number; y?: number };
  className?: string;
  portal?: boolean;
}

export const ChartTooltip = ({
  children,
  visible,
  x = 0,
  y = 0,
  offset = { x: 10, y: 10 },
  className,
  portal = true,
}: ChartTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Adjust position based on tooltip dimensions to keep it in viewport
  useEffect(() => {
    if (visible && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const adjustedX = Math.min(x + (offset.x || 0), window.innerWidth - rect.width - 10);
      const adjustedY = Math.min(y + (offset.y || 0), window.innerHeight - rect.height - 10);
      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [visible, x, y, offset.x, offset.y]);

  // Setup portal element
  useEffect(() => {
    if (portal) {
      let element = document.getElementById('chart-tooltip-portal');
      if (!element) {
        element = document.createElement('div');
        element.id = 'chart-tooltip-portal';
        document.body.appendChild(element);
      }
      setPortalElement(element);
    }
    
    return () => {
      if (portal && portalElement && !portalElement.hasChildNodes()) {
        portalElement.remove();
      }
    };
  }, [portal]);

  const tooltipContent = (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={cn("absolute z-50", className)}
          style={{
            left: position.x,
            top: position.y,
            pointerEvents: 'none',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return portal && portalElement
    ? createPortal(tooltipContent, portalElement)
    : tooltipContent;
};

export * from './ChartTooltipContent';
