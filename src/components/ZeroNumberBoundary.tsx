import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Info, Eye, EyeOff, Copy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ZeroNumberBoundaryProps {
  children: ReactNode;
  /**
   * When false, the boundary behaves as a passthrough container without monitoring.
   */
  enabled?: boolean;
  /**
   * Show visual indicator badge
   */
  showIndicator?: boolean;
  /**
   * Mode: 'warn' logs warnings, 'block' prevents rendering numbers, 'highlight' marks them
   */
  mode?: 'warn' | 'block' | 'highlight';
  /**
   * Allow specific patterns (e.g., dates, phone numbers)
   */
  allowPatterns?: RegExp[];
  /**
   * Callback when numbers are detected
   */
  onNumberDetected?: (numbers: string[]) => void;
  /**
   * Custom message for violations
   */
  violationMessage?: string;
  className?: string;
}

interface DetectionStats {
  totalChecks: number;
  violations: number;
  lastViolation?: Date;
  detectedNumbers: string[];
}

const DIGIT_PATTERN = /\d+/g;
const STATS_KEY = 'zero-number-boundary-stats';

export const ZeroNumberBoundary: FC<ZeroNumberBoundaryProps> = ({
  children,
  enabled = true,
  showIndicator = false,
  mode = 'warn',
  allowPatterns = [],
  onNumberDetected,
  violationMessage,
  className,
}) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const warningIssuedRef = useRef(false);
  const [hasViolation, setHasViolation] = useState(false);
  const [detectedNumbers, setDetectedNumbers] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [stats, setStats] = useState<DetectionStats>({
    totalChecks: 0,
    violations: 0,
    detectedNumbers: []
  });

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  // Check if number is allowed by patterns
  const isAllowedNumber = useCallback((numberStr: string, fullText: string): boolean => {
    return allowPatterns.some(pattern => {
      const matches = fullText.match(pattern);
      return matches?.some(match => match.includes(numberStr));
    });
  }, [allowPatterns]);

  // Main detection function
  const checkForNumbers = useCallback(() => {
    if (!enabled || !containerRef.current) return;

    const element = containerRef.current;
    const textContent = element.textContent ?? '';
    
    // Update stats
    const newStats = { ...stats, totalChecks: stats.totalChecks + 1 };

    // Find all numbers
    const matches = textContent.match(DIGIT_PATTERN) || [];
    const violations = matches.filter(num => !isAllowedNumber(num, textContent));

    if (violations.length > 0) {
      setHasViolation(true);
      setDetectedNumbers(violations);
      
      newStats.violations++;
      newStats.lastViolation = new Date();
      newStats.detectedNumbers = [...new Set([...stats.detectedNumbers, ...violations])].slice(-50);

      // Log warning
      if (!warningIssuedRef.current && import.meta.env.MODE !== 'production') {
        logger.warn(
          `ZeroNumberBoundary: ${violations.length} numeric violation(s) detected`, 
          { violations, mode },
          'UI'
        );
        warningIssuedRef.current = true;
      }

      // Callback
      onNumberDetected?.(violations);

      // Mode-specific actions
      if (mode === 'warn') {
        // Just log (already done above)
      } else if (mode === 'block') {
        // Content will be hidden via state
      } else if (mode === 'highlight') {
        // Will be handled in render
      }
    } else {
      setHasViolation(false);
      setDetectedNumbers([]);
      warningIssuedRef.current = false;
    }

    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  }, [enabled, mode, stats, isAllowedNumber, onNumberDetected]);

  // Observe mutations
  useEffect(() => {
    if (!enabled) return undefined;

    const element = containerRef.current;
    if (!element) return undefined;

    // Initial check
    checkForNumbers();

    // Observe changes
    const observer = new MutationObserver(checkForNumbers);
    observer.observe(element, { 
      subtree: true, 
      childList: true, 
      characterData: true 
    });

    return () => observer.disconnect();
  }, [enabled, checkForNumbers]);

  // Copy violations to clipboard
  const handleCopyViolations = async () => {
    await navigator.clipboard.writeText(detectedNumbers.join(', '));
    toast({ title: 'Copié !', description: 'Nombres détectés copiés' });
  };

  // Toggle visibility (for block mode)
  const toggleVisibility = () => setIsVisible(prev => !prev);

  // Render content based on mode
  const renderContent = () => {
    if (mode === 'block' && hasViolation && !isVisible) {
      return (
        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {violationMessage || 'Contenu masqué : nombres détectés'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {detectedNumbers.length} nombre(s) trouvé(s)
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={toggleVisibility}
            >
              <Eye className="h-4 w-4 mr-1" />
              Afficher quand même
            </Button>
          </div>
        </div>
      );
    }

    return children;
  };

  // Status indicator
  const StatusIndicator = () => {
    if (!showIndicator) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={hasViolation ? 'destructive' : 'secondary'}
              className={cn(
                'absolute top-1 right-1 z-10 text-xs cursor-help',
                hasViolation ? 'animate-pulse' : ''
              )}
            >
              {hasViolation ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {detectedNumbers.length}
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  OK
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                {hasViolation ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Nombres détectés
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Zone conforme
                  </>
                )}
              </div>
              
              {hasViolation && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Nombres trouvés: {detectedNumbers.join(', ')}
                  </p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={handleCopyViolations}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copier
                    </Button>
                    {mode === 'block' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {isVisible ? 'Masquer' : 'Afficher'}
                      </Button>
                    )}
                  </div>
                </>
              )}

              <div className="text-xs text-muted-foreground border-t pt-2">
                <div className="flex justify-between">
                  <span>Vérifications:</span>
                  <span>{stats.totalChecks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Violations:</span>
                  <span>{stats.violations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="capitalize">{mode}</span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div 
      ref={containerRef} 
      data-zero-number-boundary={enabled ? 'enabled' : 'disabled'}
      data-violation={hasViolation ? 'true' : 'false'}
      data-mode={mode}
      className={cn(
        'relative',
        mode === 'highlight' && hasViolation && 'ring-2 ring-amber-500 ring-offset-2 rounded',
        className
      )}
    >
      <StatusIndicator />
      {renderContent()}
    </div>
  );
};

export default ZeroNumberBoundary;
