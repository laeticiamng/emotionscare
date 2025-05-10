
import { useState, useEffect } from 'react';
import { Emotion } from '@/types';
import { fetchEmotionHistory } from '@/lib/scanService';

export function useScanPageState(userId?: string) {
  // État du composant
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90'>('7');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  
  // Filtres pour les utilisateurs (fonctionnalité admin)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const loadEmotionHistory = async () => {
      try {
        setLoading(true);
        console.log("Fetching emotion history for user:", userId);
        const history = await fetchEmotionHistory(userId || '');
        setEmotions(history);
        console.log("Emotion history loaded:", history.length, "entries");
      } catch (error) {
        console.error("Error loading emotion history:", error);
      } finally {
        // Add a small delay to ensure loading state is visible
        setTimeout(() => setLoading(false), 600); 
      }
    };

    if (userId) {
      loadEmotionHistory();
    }
  }, [userId, periodFilter, serviceFilter]); // Add filter dependencies to reload data when they change

  const handleScanSaved = () => {
    setShowScanForm(false);
    // Refresh data after saving
    if (userId) {
      fetchEmotionHistory(userId).then(setEmotions);
    }
  };

  const refreshEmotionHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      if (userId) {
        const data = await fetchEmotionHistory(userId);
        setEmotions(data);
      }
    } catch (error) {
      console.error("Error refreshing emotion history:", error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };
  
  // Fonction pour filtrer les utilisateurs (pour fonctionnalité admin)
  const filterUsers = (filter: string) => {
    setSelectedFilter(filter);
    // Implémentation du filtrage ici si nécessaire
  };

  return {
    activeTab,
    setActiveTab,
    showScanForm,
    setShowScanForm,
    emotions,
    loading,
    periodFilter,
    setPeriodFilter,
    serviceFilter,
    setServiceFilter,
    filteredUsers,
    selectedFilter,
    filterUsers,
    handleScanSaved,
    refreshEmotionHistory
  };
}

export default useScanPageState;
