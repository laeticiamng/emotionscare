// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ObjectiveSuggestion {
  text: string;
  type: 'intrinsic' | 'extrinsic';
  tags: string[];
  category: 'personal' | 'professional' | 'health' | 'relationships';
}

export const useObjectiveSuggest = () => {
  const [suggestions, setSuggestions] = useState<ObjectiveSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (objective: string, count: number = 3) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ambition-arcade', {
        body: {
          action: 'suggestObjectives',
          objective,
          count
        }
      });

      if (supabaseError) throw supabaseError;

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        return data.suggestions;
      } else {
        // Fallback suggestions based on keyword analysis
        const fallbackSuggestions = generateFallbackSuggestions(objective, count);
        setSuggestions(fallbackSuggestions);
        return fallbackSuggestions;
      }
      
    } catch (error) {
      logger.error('Error generating suggestions', error as Error, 'SYSTEM');
      setError('Erreur lors de la génération des suggestions');
      
      // Always provide fallback suggestions
      const fallbackSuggestions = generateFallbackSuggestions(objective, count);
      setSuggestions(fallbackSuggestions);
      return fallbackSuggestions;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateFallbackSuggestions = useCallback((objective: string, count: number): ObjectiveSuggestion[] => {
    const objectiveLower = objective.toLowerCase();
    
    // Keyword-based categorization
    let category: 'personal' | 'professional' | 'health' | 'relationships' = 'personal';
    if (objectiveLower.includes('travail') || objectiveLower.includes('carrière') || objectiveLower.includes('professionnel')) {
      category = 'professional';
    } else if (objectiveLower.includes('santé') || objectiveLower.includes('sport') || objectiveLower.includes('forme')) {
      category = 'health';
    } else if (objectiveLower.includes('ami') || objectiveLower.includes('famille') || objectiveLower.includes('relation')) {
      category = 'relationships';
    }
    
    const suggestionTemplates: Record<typeof category, ObjectiveSuggestion[]> = {
      personal: [
        {
          text: "Développer ma confiance en moi au quotidien",
          type: 'intrinsic',
          tags: ['confiance', 'développement personnel'],
          category: 'personal'
        },
        {
          text: "Atteindre un niveau de reconnaissance sociale élevé",
          type: 'extrinsic',
          tags: ['reconnaissance', 'statut social'],
          category: 'personal'
        },
        {
          text: "Cultiver ma créativité et mes passions",
          type: 'intrinsic',
          tags: ['créativité', 'passion', 'épanouissement'],
          category: 'personal'
        }
      ],
      professional: [
        {
          text: "Maîtriser de nouvelles compétences techniques",
          type: 'intrinsic',
          tags: ['compétences', 'apprentissage', 'maîtrise'],
          category: 'professional'
        },
        {
          text: "Obtenir une promotion ou augmentation",
          type: 'extrinsic',
          tags: ['promotion', 'salaire', 'reconnaissance'],
          category: 'professional'
        },
        {
          text: "Contribuer à des projets qui ont du sens",
          type: 'intrinsic',
          tags: ['impact', 'sens', 'contribution'],
          category: 'professional'
        }
      ],
      health: [
        {
          text: "Développer une routine d'exercice durable",
          type: 'intrinsic',
          tags: ['sport', 'routine', 'bien-être'],
          category: 'health'
        },
        {
          text: "Atteindre un poids ou une apparence idéale",
          type: 'extrinsic',
          tags: ['apparence', 'poids', 'image'],
          category: 'health'
        },
        {
          text: "Améliorer mon équilibre mental et émotionnel",
          type: 'intrinsic',
          tags: ['mental', 'équilibre', 'émotions'],
          category: 'health'
        }
      ],
      relationships: [
        {
          text: "Approfondir mes relations authentiques",
          type: 'intrinsic',
          tags: ['relations', 'authenticité', 'connexion'],
          category: 'relationships'
        },
        {
          text: "Étendre mon réseau social et professionnel",
          type: 'extrinsic',
          tags: ['réseau', 'contacts', 'opportunités'],
          category: 'relationships'
        },
        {
          text: "Développer mes capacités d'écoute et d'empathie",
          type: 'intrinsic',
          tags: ['écoute', 'empathie', 'communication'],
          category: 'relationships'
        }
      ]
    };
    
    // Select suggestions from the determined category
    const categoryTemplates = suggestionTemplates[category];
    const shuffled = [...categoryTemplates].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, count).map(template => ({
      ...template,
      // Personalize the text slightly based on the original objective
      text: personalizeObjective(template.text, objective)
    }));
  }, []);

  const personalizeObjective = useCallback((template: string, originalObjective: string): string => {
    // Simple personalization by incorporating keywords from the original objective
    const originalWords = originalObjective.toLowerCase().split(' ').filter(word => word.length > 3);
    
    if (originalWords.length > 0) {
      const keyWord = originalWords[0];
      
      // Add context if relevant keyword is found
      if (keyWord && !template.toLowerCase().includes(keyWord)) {
        return `${template} (en lien avec ${keyWord})`;
      }
    }
    
    return template;
  }, []);

  const getTagSuggestions = useCallback((category?: string) => {
    const tagsByCategory = {
      personal: ['développement personnel', 'confiance', 'créativité', 'passion', 'équilibre'],
      professional: ['compétences', 'carrière', 'leadership', 'innovation', 'réseau'],
      health: ['sport', 'nutrition', 'bien-être', 'mental', 'énergie'],
      relationships: ['famille', 'amis', 'communication', 'empathie', 'connexion']
    };
    
    if (category && category in tagsByCategory) {
      return tagsByCategory[category as keyof typeof tagsByCategory];
    }
    
    // Return all tags mixed
    return Object.values(tagsByCategory).flat();
  }, []);

  const analyzeObjectiveType = useCallback((objective: string): 'intrinsic' | 'extrinsic' => {
    const intrinsicKeywords = [
      'développer', 'améliorer', 'cultiver', 'apprendre', 'grandir', 'progresser',
      'maîtriser', 'créer', 'explorer', 'découvrir', 'épanouir', 'équilibrer'
    ];
    
    const extrinsicKeywords = [
      'gagner', 'obtenir', 'atteindre', 'recevoir', 'acquérir', 'posséder',
      'reconnaissance', 'promotion', 'salaire', 'récompense', 'statut', 'image'
    ];
    
    const objectiveLower = objective.toLowerCase();
    
    const intrinsicScore = intrinsicKeywords.reduce((score, keyword) => 
      score + (objectiveLower.includes(keyword) ? 1 : 0), 0);
    
    const extrinsicScore = extrinsicKeywords.reduce((score, keyword) => 
      score + (objectiveLower.includes(keyword) ? 1 : 0), 0);
    
    return intrinsicScore >= extrinsicScore ? 'intrinsic' : 'extrinsic';
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    generateSuggestions,
    getTagSuggestions,
    analyzeObjectiveType,
  };
};