import type { Who5Tone } from '@/features/orchestration/useWho5Orchestration';

export type DashboardCardId =
  | 'card-nyvee'
  | 'card-breath'
  | 'card-music'
  | 'card-journal'
  | 'card-scan'
  | 'card-coach';

type Locale = 'fr' | 'en';

interface ToneCopy {
  headline: string;
  helper: string;
}

type ToneDictionary = Record<Who5Tone, Record<Locale, ToneCopy>>;

type CardToneCopy = Record<DashboardCardId, Record<Who5Tone, Record<Locale, string>>>;

export const toneMessages: ToneDictionary = {
  very_low: {
    fr: {
      headline: 'On reste tout en douceur',
      helper: 'Respirons ensemble et laissons venir les sensations.',
    },
    en: {
      headline: 'We stay gentle',
      helper: 'Let’s breathe together and welcome whatever shows up.',
    },
  },
  low: {
    fr: {
      headline: 'Un tempo tranquille',
      helper: 'De petits gestes tendres pour se réconforter.',
    },
    en: {
      headline: 'A calm tempo',
      helper: 'Small, kind gestures to feel supported.',
    },
  },
  neutral: {
    fr: {
      headline: 'Équilibre maintenu',
      helper: 'On observe et on ajuste si besoin.',
    },
    en: {
      headline: 'Steady balance',
      helper: 'We observe and adapt whenever it feels right.',
    },
  },
  high: {
    fr: {
      headline: 'Bel élan repéré',
      helper: 'Nourrissons cette énergie avec une action inspirante.',
    },
    en: {
      headline: 'A bright spark',
      helper: 'Nurture the momentum with an inspiring action.',
    },
  },
  very_high: {
    fr: {
      headline: 'Énergie vive',
      helper: 'Canalisons cet élan dans une micro-action tonique.',
    },
    en: {
      headline: 'Vivid energy',
      helper: 'Channel the momentum into a gentle micro action.',
    },
  },
};

export const cardNudges: CardToneCopy = {
  'card-nyvee': {
    very_low: {
      fr: 'Nyvée écoute tout en douceur, sans pression.',
      en: 'Nyvée listens softly, with zero pressure.',
    },
    low: {
      fr: 'Un mot à Nyvée peut alléger le coeur.',
      en: 'A note to Nyvée can lighten the heart.',
    },
    neutral: {
      fr: 'Nyvée reste disponible pour un point d’étape.',
      en: 'Nyvée is ready for a quick check-in.',
    },
    high: {
      fr: 'Partagez cette énergie avec Nyvée pour la canaliser.',
      en: 'Share the momentum with Nyvée to help channel it.',
    },
    very_high: {
      fr: 'Nyvée transforme l’élan en inspiration concrète.',
      en: 'Nyvée turns momentum into tangible inspiration.',
    },
  },
  'card-breath': {
    very_low: {
      fr: 'Une respiration guidée pour déposer la tension.',
      en: 'Guided breathing to soften any tension.',
    },
    low: {
      fr: 'On suit le souffle et on laisse descendre les épaules.',
      en: 'Follow the breath and let the shoulders fall.',
    },
    neutral: {
      fr: 'Un souffle régulier pour rester présent.',
      en: 'Steady breathing to stay grounded.',
    },
    high: {
      fr: 'Respirer aide à garder l’élan en douceur.',
      en: 'Breathing helps keep momentum gentle.',
    },
    very_high: {
      fr: 'Un souffle ample pour accompagner l’énergie.',
      en: 'Wide breathing to accompany the energy.',
    },
  },
  'card-music': {
    very_low: {
      fr: 'Une ambiance feutrée pour se sentir enveloppé.',
      en: 'A soft soundscape to feel held.',
    },
    low: {
      fr: 'Laissez la musique bercer la journée.',
      en: 'Let the music cradle your day.',
    },
    neutral: {
      fr: 'Une atmosphère adaptée pour garder l’équilibre.',
      en: 'A tailored atmosphere to sustain balance.',
    },
    high: {
      fr: 'Un rythme vivant pour nourrir l’élan.',
      en: 'A lively rhythm to feed the momentum.',
    },
    very_high: {
      fr: 'Des textures sonores pour canaliser l’énergie.',
      en: 'Sound textures to channel the energy.',
    },
  },
  'card-journal': {
    very_low: {
      fr: 'Quelques mots pour déposer le ressenti.',
      en: 'A few words to lay down the feeling.',
    },
    low: {
      fr: 'Noter une sensation aide à clarifier l’instant.',
      en: 'Writing a sensation can clarify the moment.',
    },
    neutral: {
      fr: 'Un court récit pour garder le cap.',
      en: 'A short note to stay on course.',
    },
    high: {
      fr: 'Décrire l’énergie la rend plus concrète.',
      en: 'Describing the energy makes it tangible.',
    },
    very_high: {
      fr: 'Une micro-note pour orienter l’élan.',
      en: 'A micro note to steer the momentum.',
    },
  },
  'card-scan': {
    very_low: {
      fr: 'Un scan tout en douceur pour observer sans juger.',
      en: 'A gentle scan to observe without judging.',
    },
    low: {
      fr: 'Observer l’émotion aide à mieux la comprendre.',
      en: 'Observing the emotion helps understand it.',
    },
    neutral: {
      fr: 'Un point d’étape pour rester aligné.',
      en: 'A quick check to stay aligned.',
    },
    high: {
      fr: 'Un scan transforme l’énergie en données utiles.',
      en: 'A scan turns energy into helpful insights.',
    },
    very_high: {
      fr: 'Observer l’élan permet de le guider finement.',
      en: 'Watching the momentum lets you guide it with care.',
    },
  },
  'card-coach': {
    very_low: {
      fr: 'Un micro-mouvement pour relancer tout en douceur.',
      en: 'A micro move to restart softly.',
    },
    low: {
      fr: 'Un geste léger pour réveiller l’envie.',
      en: 'A light move to awaken motivation.',
    },
    neutral: {
      fr: 'Une petite action entretient l’équilibre.',
      en: 'A small action maintains balance.',
    },
    high: {
      fr: 'Le coach propose une action vive pour prolonger l’élan.',
      en: 'The coach suggests a spirited action to sustain momentum.',
    },
    very_high: {
      fr: 'Canalisez l’énergie dans une micro-action tonique.',
      en: 'Channel the energy into a vibrant micro action.',
    },
  },
};

export const getToneCopy = (tone: Who5Tone, locale: Locale = 'fr'): ToneCopy => toneMessages[tone][locale];

export const getCardNudge = (card: DashboardCardId, tone: Who5Tone, locale: Locale = 'fr'): string =>
  cardNudges[card]?.[tone]?.[locale] ?? '';

export const listAllNudges = (): string[] => {
  const entries: string[] = [];
  (Object.keys(toneMessages) as Who5Tone[]).forEach((tone) => {
    const toneEntry = toneMessages[tone];
    entries.push(toneEntry.fr.headline, toneEntry.fr.helper, toneEntry.en.headline, toneEntry.en.helper);
  });
  (Object.keys(cardNudges) as DashboardCardId[]).forEach((card) => {
    const toneMap = cardNudges[card];
    (Object.keys(toneMap) as Who5Tone[]).forEach((tone) => {
      const localeMap = toneMap[tone];
      entries.push(localeMap.fr, localeMap.en);
    });
  });
  return entries;
};
