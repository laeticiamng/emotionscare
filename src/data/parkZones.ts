/**
 * PARK ZONES DATA
 * Définition des zones du Parc Émotionnel
 */

import type { Zone, ZoneKey } from '@/types/park';

export const parkZones: Record<ZoneKey, Zone> = {
  hub: { name: 'Hub Central', color: 'violet', emoji: '🌌' },
  calm: { name: 'Zone de Sérénité', color: 'blue', emoji: '🫧' },
  creative: { name: 'Quartier Créatif', color: 'pink', emoji: '🎨' },
  wisdom: { name: 'Jardin de Sagesse', color: 'emerald', emoji: '🌿' },
  explore: { name: 'Espace Exploration', color: 'indigo', emoji: '🌠' },
  energy: { name: 'Zone d\'Énergie', color: 'amber', emoji: '⚡' },
  challenge: { name: 'Arène des Défis', color: 'red', emoji: '⚔️' },
  social: { name: 'Village Social', color: 'green', emoji: '🤝' }
};
