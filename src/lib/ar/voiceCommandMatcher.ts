
// Voice command matcher utility to handle various phrasings and language variations

export interface CommandMatcher {
  match: (transcript: string) => string | null;
}

export interface CommandMatcherOptions {
  strictMode?: boolean;
  language?: string;
}

export function createVoiceCommandMatcher(options: CommandMatcherOptions = {}): CommandMatcher {
  const { strictMode = false, language = 'fr' } = options;
  
  // Command dictionary for different languages
  const commandDictionary: Record<string, string[][]> = {
    fr: [
      ['play', 'lecture', 'jouer', 'démarrer', 'lire', 'commencer'],
      ['pause', 'arrêter', 'stop', 'suspendre'],
      ['next', 'suivant', 'piste suivante', 'avance'],
      ['previous', 'précédent', 'piste précédente', 'retour'],
      ['volumeUp', 'plus fort', 'monter le son', 'augmenter volume', 'volume plus'],
      ['volumeDown', 'moins fort', 'baisser le son', 'diminuer volume', 'volume moins'],
      ['mute', 'muet', 'couper le son', 'silence'],
      ['unmute', 'son', 'remettre le son', 'activer le son'],
      ['changeEnvironment', 'changer environnement', 'nouvel environnement', 'autre environnement', 'changer décor'],
      ['exit', 'quitter', 'sortir', 'fermer', 'terminer']
    ],
    en: [
      ['play', 'start', 'begin', 'resume'],
      ['pause', 'stop', 'halt'],
      ['next', 'skip', 'forward'],
      ['previous', 'back', 'backward'],
      ['volumeUp', 'louder', 'increase volume', 'volume up'],
      ['volumeDown', 'quieter', 'decrease volume', 'volume down'],
      ['mute', 'silence', 'no sound'],
      ['unmute', 'sound on', 'enable sound'],
      ['changeEnvironment', 'change environment', 'new environment', 'switch scene'],
      ['exit', 'quit', 'close', 'end']
    ]
  };
  
  // Command types for normalization
  const commandTypes = [
    'play', 'pause', 'next', 'previous', 'volumeUp', 'volumeDown',
    'mute', 'unmute', 'changeEnvironment', 'exit'
  ];

  // Return the matcher object
  return {
    match(transcript: string): string | null {
      const normalizedTranscript = transcript.toLowerCase().trim();
      
      if (!normalizedTranscript) {
        return null;
      }
      
      // Choose language dictionary (default to English if specified language not found)
      const dictionary = commandDictionary[language] || commandDictionary.en;
      
      // In strict mode, only match exact phrases
      if (strictMode) {
        for (let i = 0; i < dictionary.length; i++) {
          const commandVariants = dictionary[i];
          if (commandVariants.includes(normalizedTranscript)) {
            return commandTypes[i];
          }
        }
      } else {
        // In non-strict mode, match if the transcript contains any command variant
        for (let i = 0; i < dictionary.length; i++) {
          const commandVariants = dictionary[i];
          for (const variant of commandVariants) {
            if (normalizedTranscript.includes(variant)) {
              return commandTypes[i];
            }
          }
        }
      }
      
      return null;
    }
  };
}

export default createVoiceCommandMatcher;
