import { useState, useEffect } from 'react';
import { JournalEntry, VoiceEntry, JournalService } from '@/services/journal';
import { toast } from '@/hooks/use-toast';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await JournalService.getEntries();
      setEntries(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEntry = async (content: string): Promise<JournalEntry | null> => {
    try {
      const newEntry = await JournalService.createEntry(content);
      setEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Succès",
        description: "Entrée créée avec succès"
      });
      return newEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const createVoiceEntry = async (audioBlob: Blob): Promise<VoiceEntry | null> => {
    try {
      const voiceEntry = await JournalService.createVoiceEntry(audioBlob);
      toast({
        title: "Succès",
        description: "Enregistrement vocal sauvegardé"
      });
      // Reload entries to include voice entries if they're in the same table
      await loadEntries();
      return voiceEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEntry = async (id: string, content: string): Promise<boolean> => {
    try {
      const updatedEntry = await JournalService.updateEntry(id, content);
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      toast({
        title: "Succès",
        description: "Entrée mise à jour"
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      await JournalService.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Succès",
        description: "Entrée supprimée"
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    entries,
    isLoading,
    error,
    createEntry,
    createVoiceEntry,
    updateEntry,
    deleteEntry,
    refresh: loadEntries
  };
};