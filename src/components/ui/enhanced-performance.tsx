import React, { Suspense, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, Wifi, WifiOff, Battery, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

// Performance monitoring hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    isSlowConnection: false,
    batteryLevel: null as number | null,
    memory: null as number | null,
  });

  useEffect(() => {
    // Network status
    const updateOnlineStatus = () => {
      setMetrics(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Connection type
    const connection = (navigator as any).connection;
    if (connection) {
      const updateConnection = () => {
        setMetrics(prev => ({
          ...prev,
          connectionType: connection.effectiveType || 'unknown',
          isSlowConnection: ['slow-2g', '2g'].includes(connection.effectiveType)
        }));
      };
      
      connection.addEventListener('change', updateConnection);
      updateConnection();
    }

    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setMetrics(prev => ({ ...prev, batteryLevel: battery.level }));
        };
        
        battery.addEventListener('levelchange', updateBattery);
        updateBattery();
      });
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setMetrics(prev => ({ 
        ...prev, 
        memory: memoryInfo.usedJSHeapSize / 1024 / 1024 // MB
      }));
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return metrics;
};

// Enhanced Loading Component
interface EnhancedLoadingProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  message = "Chargement...", 
  variant = 'default',
  size = 'md'
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === 'premium') {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center space-y-4 p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-primary/20 rounded-full"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.p 
          className="text-sm text-muted-foreground font-medium"
          animate={shouldReduceMotion ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="relative mx-auto w-24 h-24"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-40" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-blue-600" />
          <motion.div
            className="absolute inset-6 rounded-full bg-background flex items-center justify-center"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-lg font-bold text-primary">EC</span>
          </motion.div>
        </motion.div>
        
        <div className="space-y-2">
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            animate={shouldReduceMotion ? {} : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            EmotionsCare
          </motion.h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Performance Status Indicator
export const PerformanceIndicator: React.FC = () => {
  const metrics = usePerformanceMetrics();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 bg-background/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3 text-xs">
        {/* Network Status */}
        <div className="flex items-center space-x-1">
          {metrics.isOnline ? (
            <Wifi className={cn(
              "h-3 w-3",
              metrics.isSlowConnection ? "text-yellow-500" : "text-green-500"
            )} />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span className="text-muted-foreground">
            {metrics.connectionType}
          </span>
        </div>

        {/* Battery Status */}
        {metrics.batteryLevel !== null && (
          <div className="flex items-center space-x-1">
            <Battery className={cn(
              "h-3 w-3",
              metrics.batteryLevel > 0.5 ? "text-green-500" :
              metrics.batteryLevel > 0.2 ? "text-yellow-500" : "text-red-500"
            )} />
            <span className="text-muted-foreground">
              {Math.round(metrics.batteryLevel * 100)}%
            </span>
          </div>
        )}

        {/* Memory Usage */}
        {metrics.memory !== null && (
          <div className="flex items-center space-x-1">
            <Signal className={cn(
              "h-3 w-3",
              metrics.memory < 50 ? "text-green-500" :
              metrics.memory < 100 ? "text-yellow-500" : "text-red-500"
            )} />
            <span className="text-muted-foreground">
              {Math.round(metrics.memory)}MB
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Optimized Lazy Loading Wrapper
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return (
    <div ref={setRef} className="min-h-[200px]">
      {isVisible ? (
        <Suspense fallback={fallback || <EnhancedLoading variant="minimal" />}>
          {children}
        </Suspense>
      ) : (
        fallback || <EnhancedLoading variant="minimal" />
      )}
    </div>
  );
};

// Image Optimization Component
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  lazy = true,
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? fallback : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!lazy) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = src;
  }, [src, lazy]);

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading && "opacity-50",
          className
        )}
        onError={() => {
          if (!hasError) {
            setImageSrc(fallback);
            setHasError(true);
          }
        }}
        {...props}
      />
      {isLoading && lazy && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default {
  EnhancedLoading,
  PerformanceIndicator, 
  LazyWrapper,
  OptimizedImage,
  usePerformanceMetrics
};