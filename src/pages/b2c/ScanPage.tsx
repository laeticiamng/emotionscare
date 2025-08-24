import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EmotionInputForm from '@/components/scan/EmotionInputForm';
import EmotionFeedback from '@/components/scan/EmotionFeedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [emojis, setEmojis] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState(null);

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const analyzeEmotion = async () => {
    setAnalyzing(true);
    
    // Simulation d'analyse
    setTimeout(() => {
      const mockEmotion = {
        id: '1',
        primary_emotion: 'joie',
        confidence: 85,
        secondary_emotions: ['espoir', 'gratitude'],
        created_at: new Date().toISOString(),
        recommendations: [
          'Continuez sur cette lancée positive',
          'Partagez votre joie avec vos proches',
          'Profitez de ce moment pour méditer'
        ]
      };
      setLatestEmotion(mockEmotion);
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Scan className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Scanner Émotionnel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Analysez votre état émotionnel en temps réel
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Émotionnelle</CardTitle>
                <CardDescription>
                  Partagez vos émotions via texte, émojis ou audio pour recevoir des insights personnalisés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionInputForm 
                  emojis={emojis}
                  text={text}
                  audioUrl={audioUrl}
                  onEmojiClick={handleEmojiClick}
                  onEmojisChange={setEmojis}
                  onTextChange={setText}
                  onAudioChange={setAudioUrl}
                  onAnalyze={analyzeEmotion}
                  analyzing={analyzing}
                />
              </CardContent>
            </Card>

            {latestEmotion && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats de l'Analyse</CardTitle>
                  <CardDescription>
                    Votre profil émotionnel avec recommandations personnalisées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmotionFeedback emotion={latestEmotion} />
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanPage;