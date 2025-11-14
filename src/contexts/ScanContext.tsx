import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { EmotionResult, EmotionSource } from '@/types/emotion-unified';
import { useToast } from '@/hooks/use-toast';

export type ScanMode = 'facial' | 'voice' | 'text' | 'sliders' | 'emoji' | 'manual';

export interface ScanConfig {
  mode: ScanMode;
  duration?: number;
  realtime?: boolean;
  saveToHistory?: boolean;
}

export interface ScanContextValue {
  // État actuel
  currentScan: EmotionResult | null;
  isScanning: boolean;
  scanMode: ScanMode | null;
  scanProgress: number; // 0-100

  // Historique local
  recentScans: EmotionResult[];
  lastScan: EmotionResult | null;

  // Actions
  startScan: (config: ScanConfig) => Promise<void>;
  completeScan: (result: EmotionResult) => void;
  cancelScan: () => void;
  clearHistory: () => void;

  // Utilitaires
  getScansBySource: (source: EmotionSource) => EmotionResult[];
  getScanById: (id: string) => EmotionResult | undefined;
}

const ScanContext = createContext<ScanContextValue | undefined>(undefined);

interface ScanProviderProps {
  children: ReactNode;
  maxHistorySize?: number;
}

/**
 * Provider pour la gestion centralisée des scans émotionnels
 *
 * @example
 * ```tsx
 * <ScanProvider maxHistorySize={50}>
 *   <App />
 * </ScanProvider>
 * ```
 */
export function ScanProvider({
  children,
  maxHistorySize = 100,
}: ScanProviderProps) {
  const [currentScan, setCurrentScan] = useState<EmotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [recentScans, setRecentScans] = useState<EmotionResult[]>([]);

  const { toast } = useToast();

  // Charger l'historique depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('emotionscare_recent_scans');
      if (stored) {
        const scans = JSON.parse(stored) as EmotionResult[];
        setRecentScans(scans.slice(0, maxHistorySize));
      }
    } catch (error) {
      console.error('[ScanContext] Failed to load history:', error);
    }
  }, [maxHistorySize]);

  // Sauvegarder l'historique dans le localStorage
  const saveHistory = useCallback((scans: EmotionResult[]) => {
    try {
      localStorage.setItem('emotionscare_recent_scans', JSON.stringify(scans));
    } catch (error) {
      console.error('[ScanContext] Failed to save history:', error);
    }
  }, []);

  const startScan = useCallback(
    async (config: ScanConfig) => {
      if (isScanning) {
        toast({
          title: 'Scan déjà en cours',
          description: 'Veuillez attendre la fin du scan actuel',
          variant: 'default',
        });
        return;
      }

      setIsScanning(true);
      setScanMode(config.mode);
      setScanProgress(0);
      setCurrentScan(null);

      // Simuler la progression (peut être overridé par le composant de scan)
      if (config.duration) {
        const interval = 100; // Update every 100ms
        const steps = config.duration / interval;
        let step = 0;

        const progressInterval = setInterval(() => {
          step++;
          const progress = Math.min((step / steps) * 100, 100);
          setScanProgress(progress);

          if (step >= steps) {
            clearInterval(progressInterval);
          }
        }, interval);
      }
    },
    [isScanning, toast]
  );

  const completeScan = useCallback(
    (result: EmotionResult) => {
      setCurrentScan(result);
      setIsScanning(false);
      setScanProgress(100);

      // Ajouter à l'historique
      const updatedScans = [result, ...recentScans].slice(0, maxHistorySize);
      setRecentScans(updatedScans);
      saveHistory(updatedScans);

      // Reset après un délai
      setTimeout(() => {
        setScanMode(null);
        setScanProgress(0);
      }, 2000);
    },
    [recentScans, maxHistorySize, saveHistory]
  );

  const cancelScan = useCallback(() => {
    setIsScanning(false);
    setScanMode(null);
    setScanProgress(0);
    setCurrentScan(null);

    toast({
      title: 'Scan annulé',
      description: 'Le scan émotionnel a été interrompu',
    });
  }, [toast]);

  const clearHistory = useCallback(() => {
    setRecentScans([]);
    saveHistory([]);

    toast({
      title: 'Historique effacé',
      description: 'L\'historique local des scans a été supprimé',
    });
  }, [saveHistory, toast]);

  const getScansBySource = useCallback(
    (source: EmotionSource) => {
      return recentScans.filter((scan) => scan.source === source);
    },
    [recentScans]
  );

  const getScanById = useCallback(
    (id: string) => {
      return recentScans.find((scan) => scan.id === id);
    },
    [recentScans]
  );

  const value: ScanContextValue = {
    currentScan,
    isScanning,
    scanMode,
    scanProgress,
    recentScans,
    lastScan: recentScans[0] || null,
    startScan,
    completeScan,
    cancelScan,
    clearHistory,
    getScansBySource,
    getScanById,
  };

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

/**
 * Hook pour accéder au contexte de scan
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentScan, startScan, completeScan } = useScanContext();
 *
 *   const handleScan = async () => {
 *     await startScan({ mode: 'facial', duration: 5000 });
 *     // ... analyse
 *     completeScan(result);
 *   };
 *
 *   return <button onClick={handleScan}>Scan</button>;
 * }
 * ```
 */
export function useScanContext(): ScanContextValue {
  const context = useContext(ScanContext);

  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }

  return context;
}

/**
 * Hook optionnel qui ne throw pas si le context n'existe pas
 * Utile pour les composants qui peuvent fonctionner avec ou sans context
 */
export function useScanContextOptional(): ScanContextValue | null {
  return useContext(ScanContext) || null;
}
