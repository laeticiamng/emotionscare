/**
 * Composant de notation par étoiles
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div 
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => !readonly && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          whileHover={!readonly ? { scale: 1.2 } : undefined}
          whileTap={!readonly ? { scale: 0.9 } : undefined}
          className={cn(
            'focus:outline-none transition-colors',
            !readonly && 'cursor-pointer hover:text-warning'
          )}
        >
          <Star
            className={cn(
              SIZES[size],
              star <= displayValue
                ? 'fill-warning text-warning'
                : 'text-muted-foreground/30'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default RatingStars;
