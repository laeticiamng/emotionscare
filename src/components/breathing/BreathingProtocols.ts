// @ts-nocheck
/**
 * Protocoles de respiration disponibles
 */

export interface BreathingPhase {
  name: 'inhale' | 'hold' | 'exhale' | 'holdOut';
  duration: number; // en secondes
  instruction: string;
}

export interface BreathingProtocol {
  id: string;
  name: string;
  description: string;
  totalDuration: number; // en secondes
  phases: BreathingPhase[];
  color: string;
  icon: string;
  benefits: string[];
}

export const BREATHING_PROTOCOLS: BreathingProtocol[] = [
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: '5 minutes pour synchroniser cœur et respiration',
    totalDuration: 300, // 5 min
    phases: [
      { name: 'inhale', duration: 5, instruction: 'Inspirez doucement...' },
      { name: 'exhale', duration: 5, instruction: 'Expirez lentement...' },
    ],
    color: 'from-emerald-500 to-teal-500',
    icon: '💚',
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Équilibre le système nerveux'],
  },
  {
    id: '478',
    name: 'Respiration 4-7-8',
    description: 'Technique de relaxation profonde',
    totalDuration: 240, // 4 min (environ 12 cycles)
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Inspirez par le nez...' },
      { name: 'hold', duration: 7, instruction: 'Retenez votre souffle...' },
      { name: 'exhale', duration: 8, instruction: 'Expirez par la bouche...' },
    ],
    color: 'from-violet-500 to-purple-500',
    icon: '😴',
    benefits: ['Favorise le sommeil', 'Calme l\'anxiété', 'Relaxation profonde'],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Respiration carrée pour le calme mental',
    totalDuration: 240, // 4 min
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Inspirez...' },
      { name: 'hold', duration: 4, instruction: 'Retenez...' },
      { name: 'exhale', duration: 4, instruction: 'Expirez...' },
      { name: 'holdOut', duration: 4, instruction: 'Pause...' },
    ],
    color: 'from-blue-500 to-indigo-500',
    icon: '🔲',
    benefits: ['Focus intense', 'Gestion du stress', 'Clarté mentale'],
  },
  {
    id: 'stop',
    name: 'Protocole STOP',
    description: 'Version courte pour situation d\'urgence',
    totalDuration: 60, // 1 min
    phases: [
      { name: 'inhale', duration: 3, instruction: 'Inspirez profondément...' },
      { name: 'hold', duration: 2, instruction: 'Pause...' },
      { name: 'exhale', duration: 5, instruction: 'Expirez longuement...' },
    ],
    color: 'from-red-500 to-orange-500',
    icon: '🛑',
    benefits: ['Calme rapide', 'Anti-panique', 'Recentrage immédiat'],
  },
  {
    id: 'reset',
    name: 'Protocole RESET',
    description: '3 minutes de récupération énergétique',
    totalDuration: 180, // 3 min
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Inspirez l\'énergie...' },
      { name: 'hold', duration: 2, instruction: 'Intégrez...' },
      { name: 'exhale', duration: 6, instruction: 'Libérez les tensions...' },
    ],
    color: 'from-cyan-500 to-blue-500',
    icon: '🔄',
    benefits: ['Récupération', 'Boost d\'énergie', 'Reset mental'],
  },
  {
    id: 'night',
    name: 'Protocole NIGHT',
    description: 'Respiration lente pour favoriser le sommeil',
    totalDuration: 300, // 5 min
    phases: [
      { name: 'inhale', duration: 4, instruction: 'Inspirez paisiblement...' },
      { name: 'hold', duration: 4, instruction: 'Détendez-vous...' },
      { name: 'exhale', duration: 8, instruction: 'Laissez-vous aller...' },
    ],
    color: 'from-indigo-600 to-slate-700',
    icon: '🌙',
    benefits: ['Préparation au sommeil', 'Relaxation profonde', 'Lâcher-prise'],
  },
];

export const getProtocolById = (id: string): BreathingProtocol | undefined => {
  return BREATHING_PROTOCOLS.find(p => p.id === id);
};

export const getCycleDuration = (protocol: BreathingProtocol): number => {
  return protocol.phases.reduce((sum, phase) => sum + phase.duration, 0);
};

export const getCycleCount = (protocol: BreathingProtocol): number => {
  const cycleDuration = getCycleDuration(protocol);
  return Math.floor(protocol.totalDuration / cycleDuration);
};
