// @ts-nocheck

/**
 * Hooks d'API centralisés
 * 
 * Ce fichier exporte tous les hooks d'API dans une interface unifiée.
 */

// Import des hooks
import useOpenAI from './useOpenAI';
import useWhisper from './useWhisper';
import useMusicGen from './useMusicGen';
import useDalle from './useOpenAI';
import useHumeAI from './useHumeAI';

// Export individuel pour import sélectif
export {
  useOpenAI,
  useWhisper,
  useMusicGen,
  useDalle,
  useHumeAI
};

// Export par défaut d'un objet avec tous les hooks
export default {
  useOpenAI,
  useWhisper,
  useMusicGen,
  useDalle,
  useHumeAI
};
