// @ts-nocheck

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { chatCompletion } from '@/services/openai';
import { logger } from '@/lib/logger';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const STORAGE_KEY = 'coach-handlers-data';
const EMOTION_HISTORY_KEY = 'coach-emotion-history';
const FAVORITES_KEY = 'coach-favorites';

// Extended emotion keywords with confidence scoring
const emotionKeywords: Record<string, { keywords: string[]; weight: number }> = {
  happy: {
    keywords: ['heureux', 'heureuse', 'content', 'contente', 'joie', 'super', 'génial', 'fantastique', 'merveilleux', 'excellent', 'ravi', 'ravie', 'enthousiaste', 'épanoui', 'comblé', 'radieux'],
    weight: 1.0
  },
  sad: {
    keywords: ['triste', 'tristesse', 'déprimé', 'déprimée', 'mal', 'malheureux', 'malheureuse', 'abattu', 'découragé', 'mélancolique', 'cafard', 'morose', 'chagrin', 'peine', 'désolé'],
    weight: 1.0
  },
  angry: {
    keywords: ['colère', 'énervé', 'énervée', 'frustré', 'frustrée', 'furieux', 'furieuse', 'agacé', 'irrité', 'exaspéré', 'révolté', 'fâché', 'fâchée', 'rageur', 'ulcéré'],
    weight: 1.0
  },
  anxious: {
    keywords: ['anxieux', 'anxieuse', 'anxi', 'stress', 'stressé', 'stressée', 'inquiet', 'inquiète', 'angoissé', 'nerveux', 'tendu', 'préoccupé', 'paniqué', 'effrayé', 'apeuré', 'craintif'],
    weight: 1.0
  },
  calm: {
    keywords: ['calme', 'apaisé', 'apaisée', 'serein', 'sereine', 'détendu', 'détendue', 'paisible', 'tranquille', 'zen', 'relaxé', 'relaxée', 'posé', 'équilibré'],
    weight: 0.9
  },
  confused: {
    keywords: ['confus', 'confuse', 'perdu', 'perdue', 'comprends pas', 'égaré', 'désorienté', 'déboussolé', 'indécis', 'hésitant', 'incertain', 'troublé'],
    weight: 0.8
  },
  grateful: {
    keywords: ['reconnaissant', 'reconnaissante', 'gratitude', 'merci', 'chanceux', 'chanceuse', 'béni', 'bénit', 'privilégié'],
    weight: 0.9
  },
  hopeful: {
    keywords: ['espoir', 'optimiste', 'confiant', 'confiante', 'positif', 'positive', 'encouragé', 'motivé', 'enthousiaste'],
    weight: 0.9
  },
  tired: {
    keywords: ['fatigué', 'fatiguée', 'épuisé', 'épuisée', 'las', 'lasse', 'exténué', 'vidé', 'vidée', 'lessivé', 'crevé'],
    weight: 0.8
  }
};

// Enhanced responses for different emotions
const emotionResponses: Record<string, string[]> = {
  happy: [
    "Je suis ravi de vous voir de bonne humeur ! C'est important de savourer ces moments.",
    "Votre joie est contagieuse ! Comment pourriez-vous partager ce bonheur avec quelqu'un aujourd'hui ?",
    "Excellent ! La joie est une émotion précieuse. Qu'est-ce qui vous rend particulièrement heureux aujourd'hui ?",
    "Quel bonheur de vous sentir ainsi ! Prenez le temps d'ancrer cette sensation positive."
  ],
  sad: [
    "Je comprends que vous vous sentiez triste. Voulez-vous en parler un peu plus ?",
    "La tristesse est une émotion naturelle. Prenez le temps de l'accueillir sans jugement.",
    "Je suis là pour vous écouter. Parfois, partager ce qui nous attriste peut aider à alléger le fardeau.",
    "Votre tristesse est légitime. Savez-vous qu'elle cache souvent un besoin important ?"
  ],
  angry: [
    "Je vois que vous ressentez de la colère. C'est une émotion qui nous signale souvent qu'une limite a été dépassée.",
    "Prenez un moment pour respirer profondément. La colère est légitime, mais il est important de l'exprimer sainement.",
    "Qu'est-ce qui a déclenché cette colère ? Parfois, identifier la source peut aider à la gérer.",
    "La colère peut être transformée en action positive. Que pourriez-vous changer dans cette situation ?"
  ],
  anxious: [
    "L'anxiété peut être difficile à gérer. Avez-vous essayé de prendre quelques respirations profondes ?",
    "Je suis là pour vous aider à traverser ce moment d'anxiété. Pouvons-nous explorer ce qui vous préoccupe ?",
    "L'anxiété nous parle souvent de nos inquiétudes pour le futur. Essayons de nous reconnecter au moment présent.",
    "Votre anxiété est un signal. Essayons ensemble de comprendre ce qu'elle essaie de vous dire."
  ],
  calm: [
    "C'est merveilleux de vous savoir dans un état de calme. Comment pourriez-vous prolonger cette sensation ?",
    "Le calme est un excellent état pour pratiquer la pleine conscience. Profitez de ce moment.",
    "Être calme permet une meilleure réflexion. Y a-t-il quelque chose que vous aimeriez explorer dans cet état d'esprit ?",
    "Savourez cette sérénité. C'est un état précieux pour prendre des décisions importantes."
  ],
  confused: [
    "La confusion peut être frustrante. Essayons de clarifier vos pensées ensemble.",
    "Prenez le temps de vous poser. Parfois, la confusion vient d'un trop-plein d'informations.",
    "Pouvons-nous décomposer ce qui vous semble confus ? Avançons pas à pas.",
    "La confusion est souvent le premier pas vers une nouvelle compréhension. Explorons ensemble."
  ],
  grateful: [
    "La gratitude est un puissant levier de bien-être. Que ressentez-vous en ce moment ?",
    "Exprimer sa reconnaissance renforce les émotions positives. C'est magnifique !",
    "Cultivez cette gratitude, elle peut transformer votre quotidien."
  ],
  hopeful: [
    "L'espoir est un moteur puissant. Qu'est-ce qui nourrit cet optimisme ?",
    "Votre confiance en l'avenir est inspirante. Comment pouvons-nous renforcer cette vision ?",
    "L'espoir est le premier pas vers le changement. Quels sont vos prochains objectifs ?"
  ],
  tired: [
    "La fatigue est un signal de votre corps. Prenez-vous suffisamment soin de vous ?",
    "Le repos est essentiel. Que pourriez-vous faire pour vous ressourcer ?",
    "Être fatigué demande de l'écoute de soi. Avez-vous identifié ce qui vous épuise ?"
  ],
  neutral: [
    "Comment puis-je vous aider aujourd'hui ?",
    "Je suis là pour discuter de ce qui vous préoccupe ou vous intéresse.",
    "Y a-t-il quelque chose de particulier dont vous aimeriez parler ?"
  ]
};

// Activities for different emotions with categories
const emotionActivities: Record<string, { activity: string; category: string; duration: number }[]> = {
  happy: [
    { activity: "Pourquoi ne pas écrire trois choses qui vous rendent reconnaissant aujourd'hui ?", category: 'journaling', duration: 5 },
    { activity: "C'est un bon moment pour contacter un proche et partager votre joie.", category: 'social', duration: 10 },
    { activity: "Votre créativité est probablement à son maximum - essayez une activité artistique !", category: 'creative', duration: 20 },
    { activity: "Capturez ce moment positif dans votre journal émotionnel.", category: 'journaling', duration: 5 }
  ],
  sad: [
    { activity: "Une promenade de 10 minutes dans la nature pourrait vous faire du bien.", category: 'physical', duration: 10 },
    { activity: "Écoutez une musique qui résonne avec votre état d'esprit, puis progressivement passez à quelque chose de plus léger.", category: 'music', duration: 15 },
    { activity: "S'accorder un moment de gentillesse envers soi-même est important : une tasse de thé, une couverture douillette...", category: 'self-care', duration: 10 },
    { activity: "Essayez l'écriture expressive : notez vos pensées sans filtre pendant 10 minutes.", category: 'journaling', duration: 10 }
  ],
  angry: [
    { activity: "Essayez cet exercice de respiration : inspirez pendant 4 secondes, retenez pendant 4 secondes, expirez pendant 6 secondes.", category: 'breathing', duration: 5 },
    { activity: "Écrire ce qui vous met en colère sans filtre peut être libérateur.", category: 'journaling', duration: 10 },
    { activity: "Une activité physique, même brève comme 20 jumping jacks, peut aider à libérer la tension.", category: 'physical', duration: 5 },
    { activity: "La technique du scan corporel peut vous aider à localiser et relâcher les tensions.", category: 'mindfulness', duration: 10 }
  ],
  anxious: [
    { activity: "Pratiquez l'exercice 5-4-3-2-1 : nommez 5 choses que vous voyez, 4 que vous pouvez toucher, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez.", category: 'grounding', duration: 5 },
    { activity: "Essayez une méditation guidée de 5 minutes.", category: 'meditation', duration: 5 },
    { activity: "Écrivez vos inquiétudes sur papier, puis à côté, notez une action concrète possible pour chacune.", category: 'journaling', duration: 15 },
    { activity: "La respiration cohérente (5 secondes inspire, 5 secondes expire) peut calmer votre système nerveux.", category: 'breathing', duration: 5 }
  ],
  calm: [
    { activity: "C'est un excellent moment pour fixer des intentions ou planifier quelque chose d'important.", category: 'planning', duration: 15 },
    { activity: "Profitez de cet état pour pratiquer une méditation ou une visualisation positive.", category: 'meditation', duration: 10 },
    { activity: "Notez ce qui a contribué à ce calme - cela pourra vous aider à recréer cet état plus tard.", category: 'journaling', duration: 5 },
    { activity: "C'est le moment idéal pour la réflexion profonde ou la créativité.", category: 'creative', duration: 20 }
  ],
  confused: [
    { activity: "Prenez un papier et notez le problème, puis divisez-le en plus petites parties.", category: 'planning', duration: 10 },
    { activity: "Parfois, expliquer sa confusion à voix haute (même à soi-même) aide à y voir plus clair.", category: 'reflection', duration: 5 },
    { activity: "Accordez-vous une pause complète de 15 minutes avant de revenir à ce qui vous confond.", category: 'break', duration: 15 },
    { activity: "Essayez le mind-mapping pour visualiser vos pensées.", category: 'creative', duration: 10 }
  ],
  grateful: [
    { activity: "Écrivez une lettre de gratitude à quelqu'un qui compte pour vous.", category: 'social', duration: 15 },
    { activity: "Créez une liste de 10 choses pour lesquelles vous êtes reconnaissant.", category: 'journaling', duration: 10 },
    { activity: "Partagez votre gratitude avec la personne concernée.", category: 'social', duration: 5 }
  ],
  hopeful: [
    { activity: "Définissez un objectif SMART pour concrétiser votre vision positive.", category: 'planning', duration: 15 },
    { activity: "Créez un vision board de vos aspirations.", category: 'creative', duration: 30 },
    { activity: "Identifiez la prochaine action concrète vers votre objectif.", category: 'planning', duration: 10 }
  ],
  tired: [
    { activity: "Essayez une micro-sieste de 20 minutes.", category: 'rest', duration: 20 },
    { activity: "Pratiquez le yoga nidra (yoga du sommeil) pour vous régénérer.", category: 'meditation', duration: 15 },
    { activity: "Faites une pause sans écran pendant 15 minutes.", category: 'break', duration: 15 }
  ],
  neutral: [
    { activity: "C'est un bon moment pour faire un scan corporel et voir comment vous vous sentez physiquement.", category: 'mindfulness', duration: 5 },
    { activity: "Pourquoi ne pas explorer une nouvelle activité ou approfondir un intérêt ?", category: 'exploration', duration: 20 },
    { activity: "Prenez quelques minutes pour définir une intention pour le reste de votre journée.", category: 'planning', duration: 5 }
  ]
};

// ============================================================================
// TYPES
// ============================================================================

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  secondaryEmotion?: string;
  keywords: string[];
  timestamp: string;
}

interface CoachSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  messagesCount: number;
  emotionsDetected: string[];
  activitiesSuggested: string[];
  userSatisfaction?: number;
}

interface CoachStats {
  totalSessions: number;
  totalMessages: number;
  emotionDistribution: Record<string, number>;
  favoriteActivities: string[];
  averageSatisfaction: number;
  currentStreak: number;
  longestStreak: number;
  improvementTrend: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    logger.error('Error saving to storage', error as Error, 'Coach');
  }
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useCoachHandlers() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<EmotionAnalysis[]>([]);
  const [currentSession, setCurrentSession] = useState<CoachSession | null>(null);
  const [stats, setStats] = useState<CoachStats>({
    totalSessions: 0,
    totalMessages: 0,
    emotionDistribution: {},
    favoriteActivities: [],
    averageSatisfaction: 0,
    currentStreak: 0,
    longestStreak: 0,
    improvementTrend: 0
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Load persisted data on mount
  useEffect(() => {
    const storedMessages = loadFromStorage<ChatMessage[]>('coachMessages', []);
    const storedHistory = loadFromStorage<EmotionAnalysis[]>(EMOTION_HISTORY_KEY, []);
    const storedFavorites = loadFromStorage<string[]>(FAVORITES_KEY, []);
    const storedStats = loadFromStorage<CoachStats>(STORAGE_KEY, stats);
    
    setMessages(storedMessages);
    setEmotionHistory(storedHistory);
    setFavorites(storedFavorites);
    setStats(storedStats);
    
    // Start a new session
    startNewSession();
  }, []);

  // Persist messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveToStorage('coachMessages', messages);
    }
  }, [messages]);

  // ─────────────────────────────────────────────────────────────
  // Session Management
  // ─────────────────────────────────────────────────────────────

  const startNewSession = useCallback(() => {
    const session: CoachSession = {
      id: uuidv4(),
      startedAt: new Date().toISOString(),
      messagesCount: 0,
      emotionsDetected: [],
      activitiesSuggested: []
    };
    setCurrentSession(session);
  }, []);

  const endSession = useCallback((satisfaction?: number) => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endedAt: new Date().toISOString(),
        userSatisfaction: satisfaction
      };
      
      // Update stats
      setStats(prev => {
        const newStats = {
          ...prev,
          totalSessions: prev.totalSessions + 1,
          totalMessages: prev.totalMessages + endedSession.messagesCount
        };
        
        if (satisfaction) {
          const totalSatisfaction = prev.averageSatisfaction * prev.totalSessions + satisfaction;
          newStats.averageSatisfaction = totalSatisfaction / newStats.totalSessions;
        }
        
        saveToStorage(STORAGE_KEY, newStats);
        return newStats;
      });
    }
  }, [currentSession]);

  // ─────────────────────────────────────────────────────────────
  // Advanced Emotion Detection with NLP-like scoring
  // ─────────────────────────────────────────────────────────────

  const detectEmotionFromText = useCallback(async (text: string): Promise<EmotionAnalysis> => {
    const lowerText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const words = lowerText.split(/\s+/);
    
    const scores: Record<string, { score: number; matchedKeywords: string[] }> = {};
    
    // Initialize all emotions
    Object.keys(emotionKeywords).forEach(emotion => {
      scores[emotion] = { score: 0, matchedKeywords: [] };
    });
    
    // Score each emotion based on keyword matches
    Object.entries(emotionKeywords).forEach(([emotion, { keywords, weight }]) => {
      keywords.forEach(keyword => {
        const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Check for exact word match
        if (words.includes(normalizedKeyword)) {
          scores[emotion].score += weight * 2;
          scores[emotion].matchedKeywords.push(keyword);
        }
        // Check for partial match (substring)
        else if (lowerText.includes(normalizedKeyword)) {
          scores[emotion].score += weight;
          scores[emotion].matchedKeywords.push(keyword);
        }
      });
    });
    
    // Apply negation detection
    const negations = ['pas', 'ne', 'non', 'jamais', 'plus', 'aucun'];
    const negationIndices: number[] = [];
    
    words.forEach((word, index) => {
      if (negations.includes(word)) {
        negationIndices.push(index);
      }
    });
    
    // Check if emotion keywords are near negations
    Object.entries(emotionKeywords).forEach(([emotion, { keywords }]) => {
      keywords.forEach(keyword => {
        const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const keywordIndex = words.findIndex(w => w.includes(normalizedKeyword));
        
        if (keywordIndex !== -1) {
          const nearNegation = negationIndices.some(negIdx => 
            Math.abs(keywordIndex - negIdx) <= 2
          );
          
          if (nearNegation) {
            scores[emotion].score *= 0.3; // Reduce score significantly if negated
          }
        }
      });
    });
    
    // Intensity modifiers
    const intensifiers = ['très', 'vraiment', 'tellement', 'extrêmement', 'super', 'trop'];
    const diminishers = ['un peu', 'légèrement', 'plutôt', 'assez'];
    
    intensifiers.forEach(intensifier => {
      if (lowerText.includes(intensifier)) {
        Object.keys(scores).forEach(emotion => {
          if (scores[emotion].score > 0) {
            scores[emotion].score *= 1.5;
          }
        });
      }
    });
    
    diminishers.forEach(diminisher => {
      if (lowerText.includes(diminisher)) {
        Object.keys(scores).forEach(emotion => {
          if (scores[emotion].score > 0) {
            scores[emotion].score *= 0.7;
          }
        });
      }
    });
    
    // Find top emotions
    const sortedEmotions = Object.entries(scores)
      .sort((a, b) => b[1].score - a[1].score);
    
    const [topEmotion, topData] = sortedEmotions[0];
    const [secondEmotion, secondData] = sortedEmotions[1] || ['neutral', { score: 0, matchedKeywords: [] }];
    
    // Calculate confidence
    const maxPossibleScore = 10;
    const confidence = Math.min(topData.score / maxPossibleScore, 1);
    
    const analysis: EmotionAnalysis = {
      emotion: topData.score > 0 ? topEmotion : 'neutral',
      confidence: topData.score > 0 ? confidence : 0.5,
      secondaryEmotion: secondData.score > 0 ? secondEmotion : undefined,
      keywords: topData.matchedKeywords,
      timestamp: new Date().toISOString()
    };
    
    // Save to history
    const newHistory = [...emotionHistory, analysis].slice(-50);
    setEmotionHistory(newHistory);
    saveToStorage(EMOTION_HISTORY_KEY, newHistory);
    
    // Update stats
    setStats(prev => {
      const newDist = { ...prev.emotionDistribution };
      newDist[analysis.emotion] = (newDist[analysis.emotion] || 0) + 1;
      return { ...prev, emotionDistribution: newDist };
    });
    
    return analysis;
  }, [emotionHistory]);
  
  // Public API for emotion detection
  const detectEmotion = useCallback(async (text: string): Promise<string> => {
    try {
      const analysis = await detectEmotionFromText(text);
      return analysis.emotion;
    } catch (error) {
      logger.error('Error in detectEmotion', error as Error, 'UI');
      return 'neutral';
    }
  }, [detectEmotionFromText]);

  // ─────────────────────────────────────────────────────────────
  // Activity Suggestions with personalization
  // ─────────────────────────────────────────────────────────────

  const suggestActivity = useCallback(async (emotion: string, options?: {
    preferredCategory?: string;
    maxDuration?: number;
  }): Promise<{ activity: string; category: string; duration: number }> => {
    try {
      let activities = emotionActivities[emotion] || emotionActivities.neutral;
      
      // Filter by options if provided
      if (options?.preferredCategory) {
        const filtered = activities.filter(a => a.category === options.preferredCategory);
        if (filtered.length > 0) activities = filtered;
      }
      
      if (options?.maxDuration) {
        const filtered = activities.filter(a => a.duration <= options.maxDuration);
        if (filtered.length > 0) activities = filtered;
      }
      
      // Prioritize non-favorite activities for variety
      const nonFavorites = activities.filter(a => !favorites.includes(a.activity));
      const pool = nonFavorites.length > 0 ? nonFavorites : activities;
      
      const selected = pool[Math.floor(Math.random() * pool.length)];
      
      // Track suggestion
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          activitiesSuggested: [...prev.activitiesSuggested, selected.activity]
        } : null);
      }
      
      return selected;
    } catch (error) {
      logger.error('Error suggesting activity', error as Error, 'UI');
      return {
        activity: "Je vous suggère de prendre un moment pour vous aujourd'hui.",
        category: 'self-care',
        duration: 5
      };
    }
  }, [favorites, currentSession]);

  // ─────────────────────────────────────────────────────────────
  // Favorites Management
  // ─────────────────────────────────────────────────────────────

  const addToFavorites = useCallback((activity: string) => {
    const newFavorites = [...favorites, activity];
    setFavorites(newFavorites);
    saveToStorage(FAVORITES_KEY, newFavorites);
    toast({
      title: 'Ajouté aux favoris',
      description: 'Cette activité a été sauvegardée.'
    });
  }, [favorites, toast]);

  const removeFromFavorites = useCallback((activity: string) => {
    const newFavorites = favorites.filter(f => f !== activity);
    setFavorites(newFavorites);
    saveToStorage(FAVORITES_KEY, newFavorites);
  }, [favorites]);

  // ─────────────────────────────────────────────────────────────
  // Trend Analysis
  // ─────────────────────────────────────────────────────────────

  const getEmotionTrends = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentHistory = emotionHistory.filter(h => 
      new Date(h.timestamp) >= weekAgo
    );
    
    const distribution: Record<string, number> = {};
    recentHistory.forEach(h => {
      distribution[h.emotion] = (distribution[h.emotion] || 0) + 1;
    });
    
    const positiveEmotions = ['happy', 'calm', 'grateful', 'hopeful'];
    const negativeEmotions = ['sad', 'angry', 'anxious', 'tired'];
    
    const positiveCount = positiveEmotions.reduce((sum, e) => sum + (distribution[e] || 0), 0);
    const negativeCount = negativeEmotions.reduce((sum, e) => sum + (distribution[e] || 0), 0);
    
    const total = recentHistory.length || 1;
    const wellbeingScore = ((positiveCount - negativeCount) / total + 1) * 50;
    
    return {
      distribution,
      positiveCount,
      negativeCount,
      wellbeingScore: Math.max(0, Math.min(100, wellbeingScore)),
      trend: positiveCount > negativeCount ? 'improving' : positiveCount < negativeCount ? 'declining' : 'stable'
    };
  }, [emotionHistory]);

  // ─────────────────────────────────────────────────────────────
  // Export Data
  // ─────────────────────────────────────────────────────────────

  const exportData = useCallback(() => {
    const data = {
      messages,
      emotionHistory,
      stats,
      favorites,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coach-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Données exportées',
      description: 'Votre historique a été téléchargé.'
    });
  }, [messages, emotionHistory, stats, favorites, toast]);

  // ─────────────────────────────────────────────────────────────
  // Send Message with AI processing
  // ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (text: string, sender: 'user' | 'assistant' | 'system' | 'coach') => {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content: text,
        sender,
        timestamp: new Date().toISOString()
      };

      const history = [...messages, newMessage];
      setMessages(prev => [...prev, newMessage]);

      // Update session
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          messagesCount: prev.messagesCount + 1
        } : null);
      }

      if (sender === 'user') {
        setIsProcessing(true);

        const process = async () => {
          try {
            // Advanced emotion analysis
            const emotionAnalysis = await detectEmotionFromText(text);
            setCurrentEmotion(emotionAnalysis.emotion);
            
            // Update session with detected emotion
            if (currentSession) {
              setCurrentSession(prev => prev ? {
                ...prev,
                emotionsDetected: [...new Set([...prev.emotionsDetected, emotionAnalysis.emotion])]
              } : null);
            }

            // Try AI response first
            const formatted = history.map(m => ({
              id: m.id,
              text: m.content,
              sender: m.sender === 'coach' ? 'assistant' : 'user'
            }));

            const aiText = await chatCompletion(formatted, {
              model: 'gpt-4o-mini',
              temperature: 0.7
            });

            const responseMessage: ChatMessage = {
              id: uuidv4(),
              content: aiText,
              sender: 'coach',
              timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, responseMessage]);
            setHasUnreadMessages(true);
          } catch (error) {
            logger.error('Error generating coach response', error as Error, 'UI');
            
            // Fallback to local responses
            const responses = emotionResponses[currentEmotion || 'neutral'] || emotionResponses.neutral;
            const fallback = responses[Math.floor(Math.random() * responses.length)];
            
            setMessages(prev => [
              ...prev,
              {
                id: uuidv4(),
                content: fallback,
                sender: 'coach',
                timestamp: new Date().toISOString()
              }
            ]);
          } finally {
            setIsProcessing(false);
          }
        };

        process();
      }
    },
    [messages, currentEmotion, currentSession, detectEmotionFromText]
  );
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('coachMessages');
    endSession();
    startNewSession();
  }, [endSession, startNewSession]);
  
  // Mark all messages as read
  const markAllAsRead = useCallback(() => {
    setHasUnreadMessages(false);
  }, []);

  // Get recommendations based on history
  const getRecommendations = useCallback(() => {
    const trends = getEmotionTrends();
    const recommendations: string[] = [];
    
    if (trends.trend === 'declining') {
      recommendations.push('Essayez une session de respiration pour améliorer votre bien-être.');
      recommendations.push('Prenez quelques minutes pour noter vos pensées dans le journal.');
    }
    
    if ((trends.distribution['anxious'] || 0) > 3) {
      recommendations.push('L\'anxiété semble fréquente - essayez les exercices de grounding.');
    }
    
    if ((trends.distribution['tired'] || 0) > 3) {
      recommendations.push('La fatigue est présente - priorisez le repos et le sommeil.');
    }
    
    if (trends.positiveCount > 5) {
      recommendations.push('Votre bien-être émotionnel est positif - continuez ainsi !');
    }
    
    return recommendations;
  }, [getEmotionTrends]);
  
  return {
    // State
    messages,
    setMessages,
    isProcessing,
    currentEmotion,
    hasUnreadMessages,
    emotionHistory,
    currentSession,
    stats,
    favorites,
    
    // Actions
    sendMessage,
    clearMessages,
    detectEmotion,
    suggestActivity,
    markAllAsRead,
    
    // Session
    startNewSession,
    endSession,
    
    // Favorites
    addToFavorites,
    removeFromFavorites,
    
    // Analytics
    getEmotionTrends,
    getRecommendations,
    exportData
  };
}
