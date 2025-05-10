
import { useState, useEffect } from 'react';
import { Emotion } from '@/types';
import { getEmotionHistory } from '@/lib/scanService';
import useScanPage from '@/hooks/useScanPage';

export function useScanPageState(userId?: string) {
  const scanPageData = useScanPage();
  const { filteredUsers, selectedFilter, filterUsers } = scanPageData;
  
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90'>('7');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  useEffect(() => {
    const loadEmotionHistory = async () => {
      try {
        setLoading(true);
        console.log("Fetching emotion history for user:", userId);
        const history = await getEmotionHistory(userId);
        setEmotions(history);
        console.log("Emotion history loaded:", history.length, "entries");
      } catch (error) {
        console.error("Error loading emotion history:", error);
      } finally {
        // Add a small delay to ensure loading state is visible
        setTimeout(() => setLoading(false), 600); 
      }
    };

    loadEmotionHistory();
  }, [userId, periodFilter, serviceFilter]); // Add filter dependencies to reload data when they change

  const handleScanSaved = () => {
    setShowScanForm(false);
    // Refresh data after saving
    getEmotionHistory(userId).then(setEmotions);
  };

  const refreshEmotionHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getEmotionHistory(userId);
      setEmotions(data);
    } catch (error) {
      console.error("Error refreshing emotion history:", error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
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
