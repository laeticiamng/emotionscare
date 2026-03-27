// @ts-nocheck
import { useState, useCallback } from 'react';
import { checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimiter';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for client-side rate limiting
 */
export const useRateLimit = () => {
  const [rateLimitState, setRateLimitState] = useState<{
    [key: string]: {
      remaining: number;
      resetTime: number | null;
      blocked: boolean;
    };
  }>({});

  const checkLimit = useCallback((
    action: keyof typeof RATE_LIMITS,
    context?: any
  ): boolean => {
    const { allowed, remaining, resetTime } = checkRateLimit(action, context);
    
    setRateLimitState(prev => ({
      ...prev,
      [action]: {
        remaining,
        resetTime,
        blocked: !allowed
      }
    }));

    if (!allowed) {
      const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
      toast({
        title: "Limite atteinte",
        description: `Trop de tentatives. Réessayez dans ${waitTime} secondes.`,
        variant: "destructive",
      });
    }

    return allowed;
  }, []);

  const getRemainingRequests = useCallback((action: keyof typeof RATE_LIMITS) => {
    return rateLimitState[action]?.remaining ?? RATE_LIMITS[action].maxRequests;
  }, [rateLimitState]);

  const isBlocked = useCallback((action: keyof typeof RATE_LIMITS) => {
    return rateLimitState[action]?.blocked ?? false;
  }, [rateLimitState]);

  const getResetTime = useCallback((action: keyof typeof RATE_LIMITS) => {
    return rateLimitState[action]?.resetTime ?? null;
  }, [rateLimitState]);

  return {
    checkLimit,
    getRemainingRequests,
    isBlocked,
    getResetTime,
    rateLimitState
  };
};
