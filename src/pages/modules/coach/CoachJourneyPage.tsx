// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Target, TrendingUp, Award, Star, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Message {
  role: 'coach' | 'user';
  content: string;
  timestamp: Date;
}

interface Session {
  id: number;
  theme: string;
  messages: Message[];
  progress: number;
  completed: boolean;
}

const COACHING_THEMES = [
  {
    id: 1,
    name: 'Gestion du stress',
    icon: '🧘',
    color: 'hsl(200, 70%, 60%)',
    intro: 'Bienvenue dans votre parcours de gestion du stress. Ensemble, nous allons explorer des techniques pour retrouver votre sérénité.',
  },
  {
    id: 2,
    name: 'Confiance en soi',
    icon: '💪',
    color: 'hsl(25, 85%, 55%)',
    intro: 'Développons ensemble votre confiance intérieure. Vous avez tout le potentiel nécessaire pour briller.',
  },
  {
    id: 3,
    name: 'Objectifs de vie',
    icon: '🎯',
    color: 'hsl(280, 60%, 65%)',
    intro: 'Clarifier vos objectifs est la première étape vers leur réalisation. Commençons ce voyage ensemble.',
  },
  {
    id: 4,
    name: 'Relations interpersonnelles',
    icon: '🤝',
    color: 'hsl(160, 50%, 60%)',
    intro: 'Améliorons la qualité de vos relations. La communication est la clé de relations épanouies.',
  },
  {
    id: 5,
    name: 'Équilibre vie pro/perso',
    icon: '⚖️',
    color: 'hsl(45, 90%, 60%)',
    intro: 'Trouvons ensemble votre équilibre idéal. Vous méritez de vous épanouir dans tous les aspects de votre vie.',
  },
];

const COACH_RESPONSES = {
  stress: [
    'Je comprends que vous traversez une période stressante. Parlez-moi de ce qui vous pèse le plus.',
    'Excellente prise de conscience ! Avez-vous identifié les déclencheurs principaux de votre stress ?',
    'C\'est un très bon début. Maintenant, explorons ensemble des stratégies d\'adaptation personnalisées.',
  ],
  confiance: [
    'Votre volonté de progresser est déjà une preuve de force. Quels sont vos succès récents, même minimes ?',
    'Chaque petit pas compte ! Comment pourriez-vous célébrer davantage vos réussites ?',
    'Votre parcours est unique. Concentrons-nous sur vos forces plutôt que vos faiblesses.',
  ],
  objectifs: [
    'Avoir des objectifs clairs est essentiel. Quel est le rêve qui vous anime le plus ?',
    'Parfait ! Décomposons cet objectif en étapes concrètes et réalisables.',
    'Vous faites d\'excellents progrès. Comment allez-vous suivre votre avancement ?',
  ],
};

export default function CoachJourneyPage() {
  const [selectedTheme, setSelectedTheme] = useState<typeof COACHING_THEMES[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('coachingSessions');
    if (stored) {
      const sessions = JSON.parse(stored);
      setTotalSessions(sessions.length);
    }
    const storedStreak = localStorage.getItem('coachingStreak');
    if (storedStreak) setStreak(parseInt(storedStreak));
  }, []);

  const startSession = (theme: typeof COACHING_THEMES[0]) => {
    setSelectedTheme(theme);
    const welcomeMessage: Message = {
      role: 'coach',
      content: theme.intro,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setSessionProgress(10);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedTheme) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate coach response
    setTimeout(() => {
      const responseCategory = Object.keys(COACH_RESPONSES)[
        Math.floor(Math.random() * Object.keys(COACH_RESPONSES).length)
      ];
      const responses = COACH_RESPONSES[responseCategory];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const coachMessage: Message = {
        role: 'coach',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachMessage]);
      setIsTyping(false);
      setSessionProgress(Math.min(sessionProgress + 15, 100));
    }, 1500);
  };

  const endSession = () => {
    setTotalSessions(totalSessions + 1);
    setStreak(streak + 1);
    localStorage.setItem('coachingStreak', (streak + 1).toString());

    const sessions = JSON.parse(localStorage.getItem('coachingSessions') || '[]');
    sessions.push({
      theme: selectedTheme?.name,
      messageCount: messages.length,
      date: new Date(),
    });
    localStorage.setItem('coachingSessions', JSON.stringify(sessions));

    setSelectedTheme(null);
    setMessages([]);
    setSessionProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎓 Coach Personnel
          </motion.h1>
          <p className="text-muted-foreground">Votre guide vers un mieux-être quotidien</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-secondary/20">
            <Award className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-foreground">{totalSessions}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </Card>
          <Card className="p-4 text-center border-primary/20">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-sm text-muted-foreground">Jours consécutifs</div>
          </Card>
          <Card className="p-4 text-center border-accent/20">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-foreground">{sessionProgress}%</div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {!selectedTheme ? (
            <motion.div
              key="themes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-center text-foreground">
                Choisissez votre thème
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {COACHING_THEMES.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => startSession(theme)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="text-4xl p-3 rounded-full"
                          style={{ backgroundColor: `${theme.color}20` }}
                        >
                          {theme.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-foreground">{theme.name}</h3>
                          <p className="text-sm text-muted-foreground">{theme.intro}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedTheme.icon}</div>
                    <div>
                      <h3 className="font-bold text-foreground">{selectedTheme.name}</h3>
                      <p className="text-sm text-muted-foreground">Session en cours</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={endSession}>
                    Terminer
                  </Button>
                </div>
                <Progress value={sessionProgress} className="h-2" />
              </Card>

              <Card className="p-6 h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/20 text-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/20 p-4 rounded-lg">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-muted-foreground"
                        >
                          Le coach réfléchit...
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Partagez vos pensées..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
