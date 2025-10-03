
// Time of day constants
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Default values for various components
export const DEFAULT_ANIMATION_DURATION = 300; // ms
export const DEFAULT_TRANSITION_DURATION = 500; // ms

// Default greeting messages
export const DEFAULT_GREETINGS = {
  [TimeOfDay.MORNING]: 'Bonjour et bienvenue sur EmotionsCare',
  [TimeOfDay.AFTERNOON]: 'Bon après-midi et bienvenue sur EmotionsCare',
  [TimeOfDay.EVENING]: 'Bonsoir et bienvenue sur EmotionsCare',
  [TimeOfDay.NIGHT]: 'Bonsoir et bienvenue sur EmotionsCare'
};

// Default colors for time of day
export const TIME_COLORS = {
  [TimeOfDay.MORNING]: '#e0f2fe', // light blue
  [TimeOfDay.AFTERNOON]: '#dbeafe', // blue
  [TimeOfDay.EVENING]: '#fef3c7', // amber
  [TimeOfDay.NIGHT]: '#1e293b' // slate dark
};

export default {
  TimeOfDay,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_TRANSITION_DURATION,
  DEFAULT_GREETINGS,
  TIME_COLORS
};
