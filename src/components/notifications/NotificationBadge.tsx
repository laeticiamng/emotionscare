// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  showIcon?: boolean;
  animated?: boolean;
  onClick?: () => void;
  onDismiss?: () => void;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  variant = 'destructive',
  showIcon = false,
  animated = true,
  onClick,
  onDismiss,
  priority
}) => {
  const [prevCount, setPrevCount] = useState(count);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (count > prevCount) {
      setIsNew(true);
      const timeout = setTimeout(() => setIsNew(false), 2000);
      return () => clearTimeout(timeout);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (count === 0) return null;

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return '';
    }
  };

  const formatCount = (n: number) => {
    if (n > 99) return '99+';
    if (n > 9 && !showIcon) return n.toString();
    return n.toString();
  };

  const BadgeContent = () => (
    <motion.div
      initial={animated ? { scale: 0 } : false}
      animate={{ scale: 1 }}
      className="relative"
    >
      <Badge 
        variant={priority ? 'default' : variant}
        className={cn(
          'flex items-center justify-center font-bold transition-all',
          showIcon ? 'h-6 px-2 gap-1' : 'h-5 w-5 p-0 text-xs',
          priority && getPriorityColor(),
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={onClick}
      >
        {showIcon && (
          <motion.div
            animate={isNew ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isNew ? (
              <BellRing className="h-3 w-3" />
            ) : (
              <Bell className="h-3 w-3" />
            )}
          </motion.div>
        )}
        <span>{formatCount(count)}</span>
      </Badge>

      {/* Pulse animation pour nouvelles notifications */}
      <AnimatePresence>
        {isNew && animated && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "absolute inset-0 rounded-full",
              priority === 'urgent' ? 'bg-red-500' : 'bg-destructive'
            )}
          />
        )}
      </AnimatePresence>

      {/* Bouton dismiss */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-background shadow-md p-0 opacity-0 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
        >
          <X className="h-2 w-2" />
        </Button>
      )}
    </motion.div>
  );

  if (priority) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <BadgeContent />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {count} notification{count > 1 ? 's' : ''} - Priorité {priority}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <BadgeContent />;
};

export default NotificationBadge;
