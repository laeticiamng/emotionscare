
import { useState } from 'react';
import { toast } from 'sonner';

interface EmotionAnalysisResult {
  primaryEmotion: string;
  score: number;
  detailedScore?: {
    [key: string]: number;
  };
  suggestions?: string[];
}

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Génère du texte avec OpenAI
   */
  const generateText = async (prompt: string, options: any = {}): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En production, appel à l'API OpenAI
      // const response = await fetch('https://api.openai.com/v1/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-4o-mini",
      //     prompt: prompt,
      //     max_tokens: options.maxTokens || 100
      //   })
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation de réponse pour la démo
      return `Voici une réponse simulée à votre requête: "${prompt}". En production, cette réponse serait générée par le modèle GPT d'OpenAI.`;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de la génération de texte: ${error.message}`);
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Traite une conversation complète avec OpenAI
   */
  const chatCompletion = async (messages: any[], options: any = {}): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En production, appel à l'API OpenAI
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-4o-mini",
      //     messages: messages,
      //     max_tokens: options.maxTokens || 500
      //   })
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Génération de réponses en fonction du contenu du dernier message
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
      
      let response = '';
      
      if (lastUserMessage.includes('stress') || lastUserMessage.includes('anxiété')) {
        response = "Je comprends que vous ressentez du stress. C'est une réaction normale, mais il existe des techniques pour vous aider à le gérer. La respiration profonde est une méthode simple mais efficace : inspirez lentement par le nez pendant 4 secondes, retenez votre souffle pendant 2 secondes, puis expirez lentement par la bouche pendant 6 secondes. Répétez cela 5 fois. Avez-vous déjà essayé des exercices de respiration ou d'autres techniques de relaxation ?";
      } else if (lastUserMessage.includes('sommeil') || lastUserMessage.includes('dormir')) {
        response = "Les problèmes de sommeil peuvent avoir un impact significatif sur votre bien-être émotionnel. Essayez de maintenir une routine régulière avant de vous coucher : évitez les écrans une heure avant, créez un environnement calme et sombre, et peut-être écoutez une méditation guidée pour vous aider à vous détendre. Voulez-vous que je vous suggère quelques méditations spécifiques pour améliorer votre sommeil ?";
      } else if (lastUserMessage.includes('méditation') || lastUserMessage.includes('méditer')) {
        response = "La méditation est une excellente pratique pour cultiver le bien-être émotionnel. Pour commencer simplement, essayez de vous asseoir confortablement pendant 5 minutes et concentrez-vous sur votre respiration. Chaque fois que votre esprit vagabonde, ramenez doucement votre attention à votre respiration. Avec le temps, vous pouvez augmenter progressivement la durée. Souhaitez-vous explorer d'autres formes de méditation ou des exercices guidés ?";
      } else if (lastUserMessage.includes('musique') || lastUserMessage.includes('playlist')) {
        response = "La musique a un effet puissant sur nos émotions. Selon votre état actuel, différents types de musique peuvent vous aider. Pour la relaxation, essayez des morceaux avec un tempo lent de 60-80 BPM. Pour l'énergie, optez pour des rythmes plus rapides autour de 120-140 BPM. Notre section de thérapie musicale propose des playlists personnalisées basées sur votre profil émotionnel. Voulez-vous que je vous guide vers cette fonctionnalité ?";
      } else {
        response = "Merci de partager cela avec moi. Le bien-être émotionnel est un parcours personnel, et je suis là pour vous accompagner. Quels aspects spécifiques de votre bien-être aimeriez-vous explorer davantage ? Je peux vous aider avec des techniques de gestion du stress, des exercices de pleine conscience, des conseils pour améliorer votre sommeil, ou simplement être présent pour discuter de ce que vous ressentez.";
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur de communication avec l'IA: ${error.message}`);
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Génère une image avec DALL-E
   */
  const generateImage = async (prompt: string, options: any = {}): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En production, appel à l'API OpenAI pour DALL-E
      // const response = await fetch('https://api.openai.com/v1/images/generations', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     model: "dall-e-3",
      //     prompt: prompt,
      //     n: 1,
      //     size: options.size || "1024x1024"
      //   })
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // URL d'image aléatoire pour la démo
      return `https://source.unsplash.com/random/1024x1024/?${encodeURIComponent(prompt)}`;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de la génération d'image: ${error.message}`);
      return '';
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Analyse une émotion à partir d'un texte
   */
  const analyzeEmotion = async (text: string): Promise<EmotionAnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En production, appel à l'API OpenAI
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-4o-mini",
      //     messages: [
      //       { role: "system", content: "Vous êtes un assistant spécialisé dans l'analyse émotionnelle. Analysez le texte fourni et identifiez l'émotion principale, avec un score de 0 à 1. Retournez également des scores détaillés pour les émotions suivantes: joie, tristesse, colère, peur, surprise, dégoût, neutre." },
      //       { role: "user", content: text }
      //     ],
      //     response_format: { type: "json_object" }
      //   })
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyse simplifiée pour la démo
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
      const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      // Générer des scores aléatoires pour chaque émotion
      const detailedScore: { [key: string]: number } = {};
      emotions.forEach(emotion => {
        detailedScore[emotion] = parseFloat((Math.random() * 0.5).toFixed(2));
      });
      
      // Augmenter le score de l'émotion primaire
      detailedScore[primaryEmotion] = parseFloat((Math.random() * 0.4 + 0.6).toFixed(2));
      
      // Suggestions basées sur l'émotion primaire
      let suggestions: string[] = [];
      if (primaryEmotion === 'joy') {
        suggestions = [
          "Continuez à cultiver cette joie en partageant ce moment avec vos proches.",
          "Prenez un moment pour apprécier pleinement cette émotion positive."
        ];
      } else if (primaryEmotion === 'sadness') {
        suggestions = [
          "Acceptez cette tristesse comme une émotion normale et valide.",
          "Essayez de pratiquer une activité réconfortante comme une promenade dans la nature.",
          "N'hésitez pas à parler de ce que vous ressentez avec une personne de confiance."
        ];
      } else if (primaryEmotion === 'anger') {
        suggestions = [
          "Prenez quelques respirations profondes pour calmer cette colère.",
          "Essayez d'identifier précisément ce qui déclenche cette émotion.",
          "Exprimez votre frustration de manière constructive, par exemple par l'écriture."
        ];
      } else {
        suggestions = [
          "Prenez un moment pour observer cette émotion sans jugement.",
          "La pleine conscience peut vous aider à mieux comprendre ce que vous ressentez.",
          "Rappelez-vous que toutes les émotions sont passagères."
        ];
      }
      
      return {
        primaryEmotion,
        score: detailedScore[primaryEmotion],
        detailedScore,
        suggestions
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de l'analyse émotionnelle: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    generateText,
    chatCompletion,
    generateImage,
    analyzeEmotion,
    isLoading,
    error
  };
}

export default useOpenAI;
