// @ts-nocheck

interface VoiceCommandMatcherOptions {
  language?: string;
  strictMode?: boolean;
  customCommands?: Record<string, string[]>;
}

export function createVoiceCommandMatcher(options: VoiceCommandMatcherOptions = {}) {
  // Default commands in French
  const defaultCommands = {
    open_journal: ['ouvre le journal', 'journal émotionnel', 'mon journal', 'voir mon journal'],
    start_meditation: ['démarre méditation', 'commence une méditation', 'méditer', 'je veux méditer'],
    play_music: ['joue de la musique', 'mets de la musique', 'musique', 'playlist'],
    scan_emotion: ['scan émotionnel', 'analyse mon émotion', 'comment je me sens', 'scanner émotion'],
    coach_chat: ['parle au coach', 'coach ia', 'assistant virtuel', 'consulter le coach'],
    show_dashboard: ['tableau de bord', 'dashboard', 'statistiques', 'mes données'],
    search_content: ['recherche', 'cherche', 'trouve', 'rechercher'],
    help: ['aide', 'instructions', 'comment ça marche', 'besoin d\'aide']
  };
  
  // Merge custom commands with defaults
  const commands = {
    ...defaultCommands,
    ...(options.customCommands || {})
  };
  
  // Check for a match between the transcript and the commands
  const match = (transcript: string): string | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Direct command match (strict mode)
    if (options.strictMode) {
      for (const [command, phrases] of Object.entries(commands)) {
        if (phrases.some(phrase => normalizedTranscript === phrase.toLowerCase())) {
          return command;
        }
      }
      return null;
    }
    
    // Fuzzy command match
    for (const [command, phrases] of Object.entries(commands)) {
      // Check if any of the command phrases are included in the transcript
      if (phrases.some(phrase => 
        normalizedTranscript.includes(phrase.toLowerCase())
      )) {
        return command;
      }
    }
    
    // Check for common words/patterns if no direct match
    if (normalizedTranscript.includes('journal')) return 'open_journal';
    if (normalizedTranscript.includes('médit')) return 'start_meditation';
    if (normalizedTranscript.includes('musique') || normalizedTranscript.includes('écouter')) return 'play_music';
    if (normalizedTranscript.includes('scan') || normalizedTranscript.includes('émoti') || normalizedTranscript.includes('sens')) return 'scan_emotion';
    if (normalizedTranscript.includes('coach') || normalizedTranscript.includes('assistant') || normalizedTranscript.includes('parler')) return 'coach_chat';
    if (normalizedTranscript.includes('tableau') || normalizedTranscript.includes('board') || normalizedTranscript.includes('stat')) return 'show_dashboard';
    if (normalizedTranscript.includes('cherche') || normalizedTranscript.includes('trouve') || normalizedTranscript.includes('recher')) return 'search_content';
    if (normalizedTranscript.includes('aide') || normalizedTranscript.includes('help')) return 'help';
    
    return null;
  };
  
  return {
    match
  };
}
