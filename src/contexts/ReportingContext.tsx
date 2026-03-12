import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ReportingStats {
  emotionalScore: number;
  emotionalScoreChange: number;
  completedSessions: number;
  completedSessionsChange: number;
  badgesEarned: number;
  badgesEarnedChange: number;
  progressPercentage: number;
  progressChange: number;
}

interface ChartData {
  overview: Array<{ date: string; value: number }>;
  emotions: Array<{ name: string; value: number; color: string }>;
  progress: Array<{ date: string; score: number; target: number }>;
}

interface ReportingContextType {
  stats: ReportingStats;
  chartData: ChartData | null;
  isLoading: boolean;
  loadData: (period: string) => void;
  exportReport: (format: string) => Promise<void>;
}

const defaultStats: ReportingStats = {
  emotionalScore: 0,
  emotionalScoreChange: 0,
  completedSessions: 0,
  completedSessionsChange: 0,
  badgesEarned: 0,
  badgesEarnedChange: 0,
  progressPercentage: 0,
  progressChange: 0,
};

const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

export const ReportingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ReportingStats>(defaultStats);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const loadData = useCallback((period: string) => {
    setIsLoading(true);

    // TODO: Fetch real reporting data from Supabase
    // For now, return empty chart data and default zero stats
    setChartData({
      overview: [],
      emotions: [],
      progress: []
    });
    setStats(defaultStats);
    setIsLoading(false);
  }, []);

  const exportReport = useCallback(async (format: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Rapport exporté avec succès",
        description: `Votre rapport a été exporté au format ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation de votre rapport",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <ReportingContext.Provider value={{
      stats,
      chartData,
      isLoading,
      loadData,
      exportReport
    }}>
      {children}
    </ReportingContext.Provider>
  );
};

export const useReporting = () => {
  const context = useContext(ReportingContext);
  if (context === undefined) {
    throw new Error('useReporting must be used within a ReportingProvider');
  }
  return context;
};
