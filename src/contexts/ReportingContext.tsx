
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
  emotionalScore: 75,
  emotionalScoreChange: 5,
  completedSessions: 24,
  completedSessionsChange: 8,
  badgesEarned: 3,
  badgesEarnedChange: 1,
  progressPercentage: 68,
  progressChange: 12,
};

const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

export const ReportingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ReportingStats>(defaultStats);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const generateMockData = (period: string): ChartData => {
    // Generate overview data
    const overviewData = Array.from({ length: period === 'week' ? 7 : 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (period === 'week' ? 7 - i : 30 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        value: 50 + Math.floor(Math.random() * 40)
      };
    });

    // Generate emotions data
    const emotionsData = [
      { name: 'Calme', value: 35, color: '#4ade80' },
      { name: 'Joyeux', value: 25, color: '#f59e0b' },
      { name: 'Concentré', value: 15, color: '#3b82f6' },
      { name: 'Anxieux', value: 15, color: '#f43f5e' },
      { name: 'Fatigué', value: 10, color: '#8b5cf6' }
    ];

    // Generate progress data
    const progressData = Array.from({ length: period === 'week' ? 7 : 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (period === 'week' ? 7 - i : 30 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        score: 40 + Math.floor(Math.random() * 40) + i * 0.5,
        target: 70
      };
    });

    return {
      overview: overviewData,
      emotions: emotionsData,
      progress: progressData
    };
  };

  const loadData = useCallback((period: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData(period);
      setChartData(mockData);
      
      // Update stats based on period
      setStats({
        ...defaultStats,
        emotionalScore: period === 'week' ? 78 : 75,
        completedSessions: period === 'week' ? 8 : 24,
      });
      
      setIsLoading(false);
    }, 800);
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
