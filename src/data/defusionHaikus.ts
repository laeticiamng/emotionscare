/**
 * Defusion Haikus - Grimoire Collection
 * Poetic wisdom for cognitive defusion (ACT therapy)
 * Each haiku helps create distance from difficult thoughts
 */

export interface DefusionHaiku {
  id: string;
  theme: 'observation' | 'acceptance' | 'presence' | 'letting_go' | 'values';
  flexLevel: 'souple' | 'transition' | 'rigide'; // AAQ-II flex hint
  haiku: {
    fr: string; // French version (5-7-5 syllables adapted)
    en?: string; // English version
  };
  title: string;
  description: string;
  icon: string;
}

export const DEFUSION_HAIKUS: DefusionHaiku[] = [
  // Observation theme - for noticing thoughts without engaging
  {
    id: 'observe-clouds',
    theme: 'observation',
    flexLevel: 'souple',
    haiku: {
      fr: 'Pensées comme nuages\nQui passent dans le ciel calme\nJe les laisse aller',
      en: 'Thoughts like clouds above\nDrifting through the peaceful sky\nI let them pass by',
    },
    title: 'Nuages de pensée',
    description: 'Observer ses pensées comme des nuages qui passent',
    icon: '☁️',
  },
  {
    id: 'observe-river',
    theme: 'observation',
    flexLevel: 'transition',
    haiku: {
      fr: 'La rivière coule\nMes pensées suivent le cours\nSans que je m\'accroche',
      en: 'The river flows on\nMy thoughts follow its current\nWithout me holding',
    },
    title: 'Rivière de pensées',
    description: 'Laisser les pensées couler comme une rivière',
    icon: '🌊',
  },
  {
    id: 'observe-leaves',
    theme: 'observation',
    flexLevel: 'rigide',
    haiku: {
      fr: 'Feuilles sur l\'eau claire\nChaque pensée un reflet\nQui s\'éloigne doux',
      en: 'Leaves on clear water\nEach thought becomes a mirror\nGently floating away',
    },
    title: 'Feuilles flottantes',
    description: 'Observer les pensées comme des feuilles qui s\'éloignent',
    icon: '🍃',
  },

  // Acceptance theme - for accepting reality as it is
  {
    id: 'accept-rain',
    theme: 'acceptance',
    flexLevel: 'souple',
    haiku: {
      fr: 'La pluie tombe encore\nJe n\'ai pas de parapluie\nJe marche quand même',
      en: 'The rain falls again\nI have no umbrella here\nStill, I walk forward',
    },
    title: 'Marcher sous la pluie',
    description: 'Accepter ce qui ne peut être changé',
    icon: '🌧️',
  },
  {
    id: 'accept-mountain',
    theme: 'acceptance',
    flexLevel: 'transition',
    haiku: {
      fr: 'Montagne immuable\nLes saisons changent autour\nElle reste debout',
      en: 'Mountain stands unchanged\nSeasons shifting all around\nIt remains steadfast',
    },
    title: 'Montagne intérieure',
    description: 'Cultiver la stabilité face aux changements',
    icon: '⛰️',
  },
  {
    id: 'accept-ocean',
    theme: 'acceptance',
    flexLevel: 'rigide',
    haiku: {
      fr: 'L\'océan accueille\nTous les fleuves sans juger\nIl reste lui-même',
      en: 'Ocean welcomes all\nEvery river without judge\nRemains forever',
    },
    title: 'Océan d\'acceptation',
    description: 'Accueillir toutes les expériences avec ouverture',
    icon: '🌊',
  },

  // Presence theme - for staying in the present moment
  {
    id: 'presence-breath',
    theme: 'presence',
    flexLevel: 'souple',
    haiku: {
      fr: 'Un souffle, puis deux\nChaque inspiration présente\nMaintenant suffit',
      en: 'One breath, then two more\nEach inhale brings me present\nNow is enough here',
    },
    title: 'Souffle présent',
    description: 'Revenir au moment présent par la respiration',
    icon: '🫁',
  },
  {
    id: 'presence-steps',
    theme: 'presence',
    flexLevel: 'transition',
    haiku: {
      fr: 'Pas après pas lent\nLe chemin se fait marchant\nJe suis déjà là',
      en: 'Step by step, slowly\nThe path unfolds while walking\nI am already here',
    },
    title: 'Pas présents',
    description: 'Marcher consciemment dans le moment présent',
    icon: '👣',
  },
  {
    id: 'presence-anchor',
    theme: 'presence',
    flexLevel: 'rigide',
    haiku: {
      fr: 'Ancre dans le corps\nLes tempêtes de l\'esprit\nMes pieds sur la terre',
      en: 'Anchor in the body\nWhile mind storms rage above\nFeet firm on the ground',
    },
    title: 'Ancrage terrestre',
    description: 'S\'ancrer dans le corps pour rester présent',
    icon: '⚓',
  },

  // Letting go theme - for releasing attachment
  {
    id: 'letting-bird',
    theme: 'letting_go',
    flexLevel: 'souple',
    haiku: {
      fr: 'Oiseau dans ma main\nJe desserre mes doigts lents\nIl prend son envol',
      en: 'Bird within my hand\nI slowly open my grip\nIt takes to the sky',
    },
    title: 'Liberté de l\'oiseau',
    description: 'Lâcher prise pour permettre la liberté',
    icon: '🕊️',
  },
  {
    id: 'letting-autumn',
    theme: 'letting_go',
    flexLevel: 'transition',
    haiku: {
      fr: 'L\'arbre d\'automne\nLaisse tomber ses feuilles d\'or\nPour mieux renaître',
      en: 'The autumn tree stands\nLetting golden leaves fall down\nTo be born anew',
    },
    title: 'Automne libérateur',
    description: 'Lâcher l\'ancien pour accueillir le nouveau',
    icon: '🍂',
  },
  {
    id: 'letting-sand',
    theme: 'letting_go',
    flexLevel: 'rigide',
    haiku: {
      fr: 'Sable entre mes doigts\nPlus je serre, plus il coule\nJ\'ouvre ma main douce',
      en: 'Sand between fingers\nThe tighter I hold, it flows\nI open gently',
    },
    title: 'Sable fluide',
    description: 'Comprendre que retenir crée la souffrance',
    icon: '⏳',
  },

  // Values theme - for connecting with what matters
  {
    id: 'values-compass',
    theme: 'values',
    flexLevel: 'souple',
    haiku: {
      fr: 'Étoile du nord\nMême si je m\'égare un peu\nElle me guide encore',
      en: 'North star shines above\nEven when I lose my way\nIt still guides me home',
    },
    title: 'Étoile guide',
    description: 'Se reconnecter à ses valeurs profondes',
    icon: '⭐',
  },
  {
    id: 'values-seed',
    theme: 'values',
    flexLevel: 'transition',
    haiku: {
      fr: 'Graine plantée doux\nChaque jour un peu d\'eau claire\nL\'arbre grandira',
      en: 'Seed planted gently\nEach day a drop of clear water\nThe tree will grow tall',
    },
    title: 'Graine de valeur',
    description: 'Cultiver ses valeurs jour après jour',
    icon: '🌱',
  },
  {
    id: 'values-horizon',
    theme: 'values',
    flexLevel: 'rigide',
    haiku: {
      fr: 'L\'horizon appelle\nMême si le chemin est long\nJ\'avance vers lui',
      en: 'Horizon calls out\nEven though the path is long\nI walk towards it',
    },
    title: 'Horizon des valeurs',
    description: 'Persévérer vers ce qui compte vraiment',
    icon: '🌅',
  },
];

/**
 * Get haiku by flex level (AAQ-II score hint)
 */
export function getHaikusByFlexLevel(flexLevel: 'souple' | 'transition' | 'rigide'): DefusionHaiku[] {
  return DEFUSION_HAIKUS.filter((h) => h.flexLevel === flexLevel);
}

/**
 * Get random haiku for a theme
 */
export function getRandomHaikuForTheme(theme: DefusionHaiku['theme']): DefusionHaiku | null {
  const haikus = DEFUSION_HAIKUS.filter((h) => h.theme === theme);
  if (haikus.length === 0) return null;
  return haikus[Math.floor(Math.random() * haikus.length)];
}

/**
 * Get haiku of the day (deterministic based on date)
 */
export function getHaikuOfTheDay(): DefusionHaiku {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % DEFUSION_HAIKUS.length;
  return DEFUSION_HAIKUS[index];
}
