import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type Emotion } from '@/store/ar.store';

interface EmotionBubbleProps {
  emotion?: Emotion;
  comment?: string | null;
  className?: string;
}

// Emotion icons and colors
const emotionConfig = {
  joy: { icon: '✨', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  calm: { icon: '🌸', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  surprise: { icon: '⚡', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  sad: { icon: '🌧️', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
  anger: { icon: '🔥', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  fear: { icon: '🛡️', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  neutral: { icon: '💫', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
};

// Default positive comments for each emotion
const defaultComments: Record<Emotion, string[]> = {
  joy: ['Tu rayonnes ✨', 'Ça fait plaisir à voir !', 'Cette énergie positive !'],
  calm: ['Sérénité parfaite', 'Tu respires la paix', 'Quelle belle tranquillité'],
  surprise: ['Ooh, intéressant !', 'Tu as vu quelque chose ?', 'Quelle découverte !'],
  sad: ['Moment de douceur', 'Prends soin de toi', 'Ça va aller ❤️'],
  anger: ['Respire profondément', 'Ta force se voit', 'Canalise cette énergie'],
  fear: ['Tu es courageux·se', 'Pas à pas, ça va', 'Tu peux le faire'],
  neutral: ['Dans tes pensées ?', 'Moment de réflexion', 'Tranquille et focus'],
};

const EmotionBubble: React.FC<EmotionBubbleProps> = ({ emotion, comment, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayComment, setDisplayComment] = useState<string>('');

  // Show/hide animation when emotion changes
  useEffect(() => {
    if (emotion) {
      setIsVisible(true);
      
      // Use provided comment or pick a random default
      const finalComment = comment || 
        defaultComments[emotion][Math.floor(Math.random() * defaultComments[emotion].length)];
      
      setDisplayComment(finalComment);
      
      // Auto-hide after 3 seconds if no new emotion
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [emotion, comment]);

  if (!emotion || !isVisible) {
    return null;
  }

  const config = emotionConfig[emotion];

  return (
    <div className={`emotion-bubble ${className}`}>
      <Card 
        className={`
          ${config.bg} ${config.color} border-2
          animate-fade-in transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <CardContent className="p-4">
          <div 
            className="flex items-center gap-3"
            role="status"
            aria-live="polite"
            aria-label={`Émotion détectée: ${emotion}`}
          >
            <div className="text-2xl" aria-hidden="true">
              {config.icon}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${config.color}`}>
                {displayComment}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionBubble;