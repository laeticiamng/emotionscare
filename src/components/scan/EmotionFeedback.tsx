
import React from 'react';
import { Emotion } from '@/types';

export interface EmotionFeedbackProps {
  emotion: Emotion;
}

const EmotionFeedback: React.FC<EmotionFeedbackProps> = ({ emotion }) => {
  // Sample feedback based on emotion
  const getFeedback = (emotionName: string): string => {
    const feedbacks: Record<string, string> = {
      joy: "La joie est une émotion positive qui peut améliorer votre bien-être général.",
      sadness: "La tristesse est une émotion normale; prenez le temps d'accepter vos sentiments.",
      anger: "La colère peut parfois indiquer que vos limites ont été franchies.",
      fear: "La peur est un mécanisme de protection naturel, mais peut devenir excessive.",
      surprise: "La surprise nous aide à rester adaptables et ouverts aux nouvelles informations.",
      calm: "Le calme vous permet de prendre des décisions plus réfléchies.",
      anxiety: "L'anxiété peut être canalisée pour vous aider à vous préparer.",
      neutral: "Un état neutre permet d'évaluer objectivement les situations."
    };
    
    return feedbacks[emotionName.toLowerCase()] || 
      "Chaque émotion a un rôle important dans votre expérience quotidienne.";
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mt-6">
      <h3 className="text-lg font-medium mb-2">Analyse émotionnelle</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: emotion.color }}></div>
        <span className="font-medium">{emotion.name}</span>
      </div>
      
      <p className="text-muted-foreground">{getFeedback(emotion.name)}</p>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Recommandations</h4>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          <li>Prenez quelques minutes pour respirer profondément</li>
          <li>Essayez une courte méditation guidée</li>
          <li>Écoutez de la musique apaisante</li>
        </ul>
      </div>
    </div>
  );
};

export default EmotionFeedback;
