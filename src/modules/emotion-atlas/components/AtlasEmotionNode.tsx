import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { EmotionNode } from '../types';
import { cn } from '@/lib/utils';

interface AtlasEmotionNodeProps {
  node: EmotionNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  delay?: number;
}

export const AtlasEmotionNode: React.FC<AtlasEmotionNodeProps> = memo(({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  delay = 0
}) => {
  const size = Math.max(32, Math.min(80, node.size));
  const isActive = isSelected || isHovered;

  return (
    <motion.button
      className={cn(
        'absolute flex items-center justify-center',
        'rounded-full cursor-pointer',
        'transition-shadow duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isActive && 'z-10'
      )}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        backgroundColor: node.color,
        boxShadow: isActive 
          ? `0 0 20px ${node.color}80, 0 4px 20px ${node.color}40`
          : `0 2px 8px ${node.color}30`
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.2 : 1, 
        opacity: 1 
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      aria-label={`${node.emotion} - Intensité ${node.intensity}%`}
    >
      {/* Cercle intérieur */}
      <div 
        className="absolute inset-1 rounded-full bg-white/20"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      
      {/* Nom de l'émotion */}
      <span 
        className={cn(
          'relative z-10 text-xs font-medium capitalize',
          'text-white drop-shadow-md',
          size < 50 && 'text-[10px]'
        )}
      >
        {size >= 40 ? node.emotion : node.emotion.charAt(0).toUpperCase()}
      </span>

      {/* Badge de fréquence */}
      {node.frequency > 1 && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <span className="text-[10px] font-bold text-foreground">
            {node.frequency > 99 ? '99+' : node.frequency}
          </span>
        </motion.div>
      )}

      {/* Anneau d'intensité */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeDasharray={`${(node.intensity / 100) * 283} 283`}
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ delay: delay + 0.1, duration: 0.8 }}
        />
      </svg>

      {/* Tooltip au survol */}
      {isHovered && (
        <motion.div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
            'px-3 py-1.5 rounded-lg',
            'bg-popover text-popover-foreground shadow-lg border border-border',
            'text-xs font-medium z-20',
            node.y > 50 ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
          initial={{ opacity: 0, y: node.y > 50 ? 5 : -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="capitalize font-semibold">{node.emotion}</span>
            <span className="text-muted-foreground">
              Intensité: {node.intensity}% • {node.frequency}x
            </span>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
});

AtlasEmotionNode.displayName = 'AtlasEmotionNode';
