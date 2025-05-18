
import { useState, useEffect } from 'react';

// Définition du type User manquant
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface ScanDetail {
  id: string;
  date: string;
  score: number;
  user: User;
  emotions: string[];
  insights: string[];
  recommendations: string[];
}

export function useScanDetailPage(scanId: string) {
  const [scanDetail, setScanDetail] = useState<ScanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchScanDetail = async () => {
      try {
        setLoading(true);
        // Simuler un chargement pour mieux voir l'état de chargement
        await new Promise(r => setTimeout(r, 1000));

        // Simuler les données pour la démo
        const mockScanDetail: ScanDetail = {
          id: scanId,
          date: new Date().toISOString(),
          score: 78,
          user: {
            id: 'usr-123',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            role: 'user',
            created_at: new Date().toISOString()
          },
          emotions: ['calme', 'concentré', 'léger stress'],
          insights: [
            'Votre niveau de stress est inférieur à la moyenne de votre équipe',
            'Votre bien-être émotionnel s\'est amélioré de 12% cette semaine'
          ],
          recommendations: [
            'Prenez une pause de 10 minutes pour méditer',
            'Écoutez une playlist musicale pour renforcer votre concentration'
          ]
        };

        setScanDetail(mockScanDetail);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch scan details'));
        setLoading(false);
      }
    };

    if (scanId) {
      fetchScanDetail();
    }
  }, [scanId]);

  return { scanDetail, loading, error };
}

export default useScanDetailPage;
