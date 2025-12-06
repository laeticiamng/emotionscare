// @ts-nocheck

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'retrying';

interface LoadingStateConfig {
  state: LoadingState;
  message?: string;
  progress?: number;
  onRetry?: () => void;
  className?: string;
}

// Composant principal pour les states de chargement
export const AdvancedLoadingState: React.FC<LoadingStateConfig> = ({
  state,
  message,
  progress,
  onRetry,
  className
}) => {
  const stateConfigs = {
    idle: {
      icon: null,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      animation: {}
    },
    loading: {
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      animation: { rotate: 360 }
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      animation: { scale: [0.8, 1.1, 1] }
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      animation: { x: [-2, 2, -2, 2, 0] }
    },
    retrying: {
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      animation: { rotate: -360 }
    }
  };

  const config = stateConfigs[state];
  const Icon = config.icon;

  if (state === 'idle') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border",
          config.bgColor,
          className
        )}
      >
        {Icon && (
          <motion.div
            animate={config.animation}
            transition={{
              duration: state === 'loading' ? 1 : 0.6,
              repeat: state === 'loading' ? Infinity : 0,
              ease: state === 'loading' ? 'linear' : 'easeInOut'
            }}
          >
            <Icon className={cn("w-5 h-5", config.color)} />
          </motion.div>
        )}
        
        <div className="flex-1">
          <p className={cn("text-sm font-medium", config.color)}>
            {message || getDefaultMessage(state)}
          </p>
          
          {progress !== undefined && state === 'loading' && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% terminé
              </p>
            </div>
          )}
        </div>
        
        {state === 'error' && onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Skeleton loading avancé
interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

export const AdvancedSkeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className,
  animate = true
}) => {
  const variants = {
    text: 'h-4 rounded',
    rect: 'rounded-md',
    circle: 'rounded-full',
    card: 'rounded-lg'
  };

  const baseClass = cn(
    "bg-gradient-to-r from-muted via-muted/50 to-muted",
    variants[variant],
    className
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (!animate) {
    return <div className={baseClass} style={style} />;
  }

  return (
    <motion.div
      className={baseClass}
      style={style}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }}
      initial={{
        backgroundSize: '200% 100%'
      }}
    />
  );
};

// Pattern de chargement pour différents contenus
export const ContentLoadingPattern: React.FC<{
  type: 'dashboard' | 'list' | 'form' | 'profile';
  count?: number;
}> = ({ type, count = 3 }) => {
  const patterns = {
    dashboard: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border rounded-lg p-4 space-y-3"
            >
              <AdvancedSkeleton variant="rect" height={80} />
              <AdvancedSkeleton variant="text" width="60%" />
              <AdvancedSkeleton variant="text" width="40%" />
            </motion.div>
          ))}
        </div>
        <AdvancedSkeleton variant="card" height={200} />
      </div>
    ),

    list: (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <AdvancedSkeleton variant="circle" width={48} height={48} />
            <div className="flex-1 space-y-2">
              <AdvancedSkeleton variant="text" width="70%" />
              <AdvancedSkeleton variant="text" width="50%" />
            </div>
          </motion.div>
        ))}
      </div>
    ),

    form: (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <AdvancedSkeleton variant="text" width="30%" height={16} />
            <AdvancedSkeleton variant="rect" height={40} />
          </motion.div>
        ))}
      </div>
    ),

    profile: (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <AdvancedSkeleton variant="circle" width={80} height={80} />
          <div className="space-y-2">
            <AdvancedSkeleton variant="text" width={200} height={20} />
            <AdvancedSkeleton variant="text" width={150} />
          </div>
        </motion.div>
        <AdvancedSkeleton variant="card" height={300} />
      </div>
    )
  };

  return patterns[type];
};

// Hook pour gérer les états de chargement
export const useAdvancedLoading = (initialState: LoadingState = 'idle') => {
  const [state, setState] = React.useState<LoadingState>(initialState);
  const [message, setMessage] = React.useState<string>();
  const [progress, setProgress] = React.useState<number>();

  const startLoading = (msg?: string) => {
    setState('loading');
    setMessage(msg);
    setProgress(0);
  };

  const updateProgress = (value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const setSuccess = (msg?: string) => {
    setState('success');
    setMessage(msg);
    setProgress(100);
  };

  const setError = (msg?: string) => {
    setState('error');
    setMessage(msg);
  };

  const setRetrying = (msg?: string) => {
    setState('retrying');
    setMessage(msg);
  };

  const reset = () => {
    setState('idle');
    setMessage(undefined);
    setProgress(undefined);
  };

  return {
    state,
    message,
    progress,
    startLoading,
    updateProgress,
    setSuccess,
    setError,
    setRetrying,
    reset
  };
};

// Messages par défaut
function getDefaultMessage(state: LoadingState): string {
  const messages = {
    idle: '',
    loading: 'Chargement en cours...',
    success: 'Opération réussie',
    error: 'Une erreur est survenue',
    retrying: 'Nouvelle tentative...'
  };
  return messages[state];
}

