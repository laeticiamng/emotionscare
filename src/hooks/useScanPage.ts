
import { useState, useEffect } from 'react';
import { fetchEmotionHistory } from '@/lib/scanService';
import { useToast } from '@/components/ui/use-toast';
import type { Emotion } from '@/types/scan';
import type { User } from '@/types';

export const useScanPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Emotion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Since we don't have a real users table in Supabase,
        // let's simulate some users with emotional scores
        const simulatedUsers: User[] = [
          {
            id: '1',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            avatar: '',
            anonymity_code: 'Anon-5678',
            emotional_score: 85,
            role: 'Médecin'
          },
          {
            id: '2',
            name: 'Marie Martin',
            email: 'marie.martin@example.com',
            avatar: '',
            anonymity_code: 'Anon-9012',
            emotional_score: 65,
            role: 'Infirmier'
          },
          {
            id: '3',
            name: 'Pierre Bernard',
            email: 'pierre.bernard@example.com',
            avatar: '',
            anonymity_code: 'Anon-3456',
            emotional_score: 32,
            role: 'Aide-soignant'
          },
          {
            id: '4',
            name: 'Sophie Petit',
            email: 'sophie.petit@example.com',
            avatar: '',
            anonymity_code: 'Anon-7890',
            emotional_score: 50,
            role: 'Interne'
          },
        ];
        
        setUsers(simulatedUsers);
        
        // Fetch emotional scans history
        try {
          const emotions = await fetchEmotionHistory();
          setHistory(emotions);
        } catch (err) {
          console.error("Error fetching emotions:", err);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les données: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleScanSaved = (newScan: Emotion) => {
    // Update the history with the new scan
    setHistory(prev => [newScan, ...prev.filter(s => s.id !== newScan.id)]);
  };

  return {
    users,
    loading,
    history,
    handleScanSaved
  };
};
