// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Star, Award, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import confetti from 'canvas-confetti';
import { useSocialModule } from '@/hooks/useSocialModule';

interface Lantern {
  id: string;
  message: string;
  emotion: string;
  height: number; // 0-100
  glow: number; // 0-100
  reactions: {
    heart: number;
    star: number;
    hug: number;
  };
  timestamp: Date;
  color: string;
}

interface EmotionType {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const emotionTypes: EmotionType[] = [
  { name: 'Gratitude', emoji: '🙏', color: '#FFD700', description: 'Je suis reconnaissant pour...' },
  { name: 'Joie', emoji: '😊', color: '#FF69B4', description: 'Ça me rend heureux de...' },
  { name: 'Espoir', emoji: '🌟', color: '#87CEEB', description: 'Je crois que...' },
  { name: 'Soutien', emoji: '💪', color: '#FF6347', description: 'Je suis là pour...' },
  { name: 'Sagesse', emoji: '🧘', color: '#9370DB', description: 'J\'ai appris que...' },
  { name: 'Célébration', emoji: '🎉', color: '#FFA500', description: 'Je célèbre...' },
];

export default function SocialLanternJourneyPage() {
  const {
    share,
    react,
    getShares,
    sessionData,
    communityScore,
    achievements,
  } = useSocialModule('social-lantern');

  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [message, setMessage] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(emotionTypes[0]);
  const [totalReactions, setTotalReactions] = useState(0);

  useEffect(() => {
    // Simulate lanterns floating up
    const interval = setInterval(() => {
      setLanterns(prev =>
        prev.map(lantern => ({
          ...lantern,
          height: Math.min(100, lantern.height + 0.5),
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const launchLantern = async () => {
    if (!message.trim()) return;

    const newLantern: Lantern = {
      id: Date.now().toString(),
      message: message,
      emotion: selectedEmotion.name,
      height: 0,
      glow: 50 + Math.random() * 50,
      reactions: { heart: 0, star: 0, hug: 0 },
      timestamp: new Date(),
      color: selectedEmotion.color,
    };

    setLanterns(prev => [newLantern, ...prev.slice(0, 9)]);
    setMessage('');

    await share({
      type: 'lantern',
      content: message,
      emotion: selectedEmotion.name,
      visibility: 'public'
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: [selectedEmotion.color],
    });

    // Auto-react after a delay
    setTimeout(() => {
      const randomReactions = Math.floor(Math.random() * 5) + 1;
      reactToLantern(newLantern.id, 'heart', randomReactions);
    }, 3000);
  };

  const reactToLantern = async (lanternId: string, type: 'heart' | 'star' | 'hug', count: number = 1) => {
    setLanterns(prev =>
      prev.map(lantern => {
        if (lantern.id === lanternId) {
          const newReactions = { ...lantern.reactions };
          newReactions[type] += count;
          return {
            ...lantern,
            reactions: newReactions,
            glow: Math.min(100, lantern.glow + 10),
          };
        }
        return lantern;
      })
    );
    setTotalReactions(prev => prev + count);

    await react(lanternId, type, count);
  };

  const getTotalReactionsForLantern = (lantern: Lantern) => {
    return lantern.reactions.heart + lantern.reactions.star + lantern.reactions.hug;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12" />
            Social Lantern Plaza
          </h1>
          <p className="text-white/80 text-lg">Partage ta lumière avec la communauté</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lantern Sky */}
          <Card className="lg:col-span-2 p-6 bg-black/30 backdrop-blur-lg border-white/20 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4">🌌 Ciel des Lanternes</h2>
            
            {/* Sky with floating lanterns */}
            <div className="relative h-[600px] bg-gradient-to-b from-indigo-900/50 to-purple-900/50 rounded-xl overflow-hidden">
              <AnimatePresence>
                {lanterns.map((lantern) => (
                  <motion.div
                    key={lantern.id}
                    initial={{ y: '100%', x: Math.random() * 80 + 10 + '%', opacity: 0 }}
                    animate={{
                      y: `${100 - lantern.height}%`,
                      opacity: [0, 1, lantern.height > 90 ? 0 : 1],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                    style={{ left: Math.random() * 80 + 10 + '%' }}
                  >
                    <div
                      className="relative p-4 rounded-lg backdrop-blur-sm cursor-pointer transition-transform hover:scale-110"
                      style={{
                        backgroundColor: `${lantern.color}40`,
                        border: `2px solid ${lantern.color}`,
                        boxShadow: `0 0 ${lantern.glow}px ${lantern.color}`,
                        minWidth: '200px',
                        maxWidth: '250px',
                      }}
                      onClick={() => reactToLantern(lantern.id, 'heart')}
                    >
                      {/* Emotion badge */}
                      <div className="absolute -top-3 -right-3 text-3xl">
                        {emotionTypes.find(e => e.name === lantern.emotion)?.emoji || '✨'}
                      </div>

                      {/* Message */}
                      <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">
                        {lantern.message}
                      </p>

                      {/* Reactions */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/70">❤️ {lantern.reactions.heart}</span>
                        <span className="text-white/70">⭐ {lantern.reactions.star}</span>
                        <span className="text-white/70">🤗 {lantern.reactions.hug}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {lanterns.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/30">
                    <Sparkles className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg">Lance ta première lanterne pour illuminer le ciel</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Creation Panel */}
          <div className="space-y-4">
            {/* Stats */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-yellow-400" />
                <span className="text-white/80">Score Communauté</span>
              </div>
              <div className="text-4xl font-bold text-white">{communityScore}</div>
            </Card>

            {/* Create Lantern */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">✨ Créer une Lanterne</h3>

              {/* Emotion Selector */}
              <div className="mb-4">
                <label className="text-white/80 text-sm mb-2 block">Choisis ton émotion</label>
                <div className="grid grid-cols-3 gap-2">
                  {emotionTypes.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`p-3 rounded-lg transition-all ${
                        selectedEmotion.name === emotion.name
                          ? 'bg-white/20 border-2 scale-105'
                          : 'bg-white/5 border-2 border-transparent'
                      }`}
                      style={{
                        borderColor: selectedEmotion.name === emotion.name ? emotion.color : 'transparent',
                      }}
                    >
                      <div className="text-2xl mb-1">{emotion.emoji}</div>
                      <div className="text-white text-xs">{emotion.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-4">
                <label className="text-white/80 text-sm mb-2 block">Ton message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedEmotion.description}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-32"
                  maxLength={200}
                />
                <div className="text-white/40 text-xs mt-1 text-right">
                  {message.length}/200
                </div>
              </div>

              {/* Launch Button */}
              <Button
                onClick={launchLantern}
                disabled={!message.trim()}
                className="w-full h-14 text-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedEmotion.color}, ${selectedEmotion.color}dd)`,
                }}
              >
                <Send className="w-5 h-5 mr-2" />
                Lancer la Lanterne
              </Button>
            </Card>

            {/* Personal Stats */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tes Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Lanternes lancées</span>
                  <span className="text-white font-bold">{sessionData.sharesCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Réactions reçues</span>
                  <span className="text-white font-bold">{sessionData.reactionsReceived || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Points</span>
                  <span className="text-white font-bold">{sessionData.totalPoints || 0}</span>
                </div>
              </div>
            </Card>

            {/* Community Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3">💡 Conseils</h3>
              <ul className="text-white/80 text-sm space-y-2">
                <li>• Clique sur une lanterne pour réagir</li>
                <li>• Plus de réactions = plus de lumière</li>
                <li>• Partage de la positivité quotidienne</li>
                <li>• Crée une chaîne de bienveillance</li>
              </ul>
            </Card>

            {achievements.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Créateur de Lumière!</h3>
                  <p className="text-white/70 text-sm">Tu illumines la communauté ✨</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Emotion Guide */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Guide des Émotions Positives</h3>
          <div className="grid md:grid-cols-6 gap-4">
            {emotionTypes.map((emotion) => (
              <div
                key={emotion.name}
                className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition-all cursor-pointer"
                style={{ borderTop: `3px solid ${emotion.color}` }}
              >
                <div className="text-4xl mb-2">{emotion.emoji}</div>
                <div className="text-white font-bold mb-1">{emotion.name}</div>
                <div className="text-white/60 text-xs">{emotion.description}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
