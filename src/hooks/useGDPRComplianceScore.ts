import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useAuth } from '@/contexts/AuthContext';

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: number;
}

export interface ComplianceScoreData {
  score: number;
  breakdown: {
    consentRate: number;
    exportSpeed: number;
    deletionSpeed: number;
    alerts: number;
    overdueCompliance: number;
  };
  recommendations: Recommendation[];
  metrics: {
    consentRate: number;
    exportProcessingSpeed: number;
    deletionProcessingSpeed: number;
    criticalAlertsCount: number;
    overdueExportsCount: number;
    overdueDeletionsCount: number;
  };
  calculatedAt: string;
}

export const useGDPRComplianceScore = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ComplianceScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplianceScore = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data: result, error: invokeError } = await supabase.functions.invoke(
        'gdpr-compliance-score',
        {
          method: 'GET',
        }
      );

      if (invokeError) throw invokeError;

      setData(result);
      logger.info('GDPR compliance score fetched successfully', { score: result.score }, 'GDPR');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du calcul du score';
      setError(errorMessage);
      logger.error('Error fetching GDPR compliance score', err as Error, 'GDPR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceScore();

    // Refresh every 5 minutes
    const interval = setInterval(fetchComplianceScore, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchComplianceScore,
  };
};
