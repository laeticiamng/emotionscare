// @ts-nocheck

import { v4 as uuidv4 } from 'uuid';
import { EmotionalData } from '@/hooks/coach/types';

// Données émotionnelles en mémoire pour la démo
let emotionalDataStore: EmotionalData[] = [];

// Ajouter une nouvelle entrée émotionnelle
export const addEmotionalData = (data: Omit<EmotionalData, 'id'>): EmotionalData => {
  const newEntry: EmotionalData = {
    id: uuidv4(),
    ...data,
  };
  
  emotionalDataStore.push(newEntry);
  return newEntry;
};

// Obtenir toutes les données émotionnelles pour un utilisateur
export const getUserEmotionalData = (userId: string): EmotionalData[] => {
  return emotionalDataStore.filter(item => item.user_id === userId);
};

// Obtenir la dernière entrée émotionnelle pour un utilisateur
export const getLatestEmotionalData = (userId: string): EmotionalData | null => {
  const userEntries = getUserEmotionalData(userId);
  if (userEntries.length === 0) return null;
  
  // Trie par horodatage (plus récent en premier)
  return userEntries.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
};

// Ajouter une entrée émotionnelle avec des données contextuelles
export const addContextualEmotionalData = (
  userId: string, 
  emotion: string, 
  intensity: number, 
  partialData: Partial<EmotionalData> = {}
): EmotionalData => {
  const newEntry = addEmotionalData({
    user_id: userId,
    emotion,
    intensity: intensity || partialData.intensity || 5,
    timestamp: new Date().toISOString(),
    source: partialData.source || 'manual',
    context: partialData.context,
    tags: partialData.tags
  });
  
  return newEntry;
};

// Obtenir l'historique des émotions d'un utilisateur (par période)
export const getUserEmotionalHistory = (
  userId: string, 
  days: number = 30
): EmotionalData[] => {
  const now = new Date();
  const cutoffDate = new Date(now.setDate(now.getDate() - days));
  
  return getUserEmotionalData(userId).filter(item => 
    new Date(item.timestamp) >= cutoffDate
  );
};

// Supprimer une entrée émotionnelle
export const deleteEmotionalData = (id: string): boolean => {
  const initialLength = emotionalDataStore.length;
  emotionalDataStore = emotionalDataStore.filter(item => item.id !== id);
  return emotionalDataStore.length < initialLength;
};

// Obtenir les données émotionnelles par tags
export const getEmotionalDataByTags = (
  userId: string, 
  tags: string[]
): EmotionalData[] => {
  return getUserEmotionalData(userId).filter(item => 
    item.tags && tags.some(tag => item.tags?.includes(tag))
  );
};

// Pour les tests et la démo
export const clearEmotionalDataStore = (): void => {
  emotionalDataStore = [];
};

export default {
  addEmotionalData,
  getUserEmotionalData,
  getLatestEmotionalData,
  addContextualEmotionalData,
  getUserEmotionalHistory,
  deleteEmotionalData,
  getEmotionalDataByTags,
  clearEmotionalDataStore
};
