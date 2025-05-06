
import { useState, useEffect } from 'react';
import { Emotion, User } from '@/types';
import { fetchEmotionHistory } from '@/lib/scanService';
import { useScanPage } from '@/hooks/useScanPage';

export function useScanPageState(userId?: string) {
  const { filteredUsers, selectedFilter, filterUsers } = useScanPage();
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90'>('7');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  useEffect(() => {
    const loadEmotionHistory = async () => {
      if (userId) {
        try {
          setLoading(true);
          console.log("Fetching emotion history for user:", userId);
          const history = await fetchEmotionHistory();
          setEmotions(history);
          console.log("Emotion history loaded:", history.length, "entries");
        } catch (error) {
          console.error("Error loading emotion history:", error);
        } finally {
          // Add a small delay to ensure loading state is visible
          setTimeout(() => setLoading(false), 600); 
        }
      }
    };

    loadEmotionHistory();
  }, [userId, periodFilter, serviceFilter]); // Add filter dependencies to reload data when they change

  const handleScanSaved = () => {
    setShowScanForm(false);
    // Refresh data after saving
    fetchEmotionHistory().then(setEmotions);
  };

  const refreshEmotionHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchEmotionHistory();
      setEmotions(data);
      return data;
    } catch (error) {
      console.error("Error refreshing emotion history:", error);
      throw error;
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
