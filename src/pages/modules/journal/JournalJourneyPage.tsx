import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Heart, Calendar, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JournalEntry {
  id: string;
  date: Date;
  prompt: string;
  content: string;
  mood: string;
  tags: string[];
}

const JOURNAL_PROMPTS = [
  {
    category: 'Gratitude',
    icon: '🙏',
    color: 'hsl(45, 90%, 60%)',
    prompts: [
      'Quelles sont les 3 choses pour lesquelles vous êtes reconnaissant aujourd\'hui ?',
      'Qui a illuminé votre journée et pourquoi ?',
      'Quel petit moment de bonheur avez-vous vécu cette semaine ?',
    ],
  },
  {
    category: 'Réflexion',
    icon: '💭',
    color: 'hsl(200, 70%, 60%)',
    prompts: [
      'Qu\'avez-vous appris sur vous-même aujourd\'hui ?',
      'Quelle difficulté avez-vous surmontée récemment ?',
      'Comment avez-vous grandi ce mois-ci ?',
    ],
  },
  {
    category: 'Objectifs',
    icon: '🎯',
    color: 'hsl(280, 60%, 65%)',
    prompts: [
      'Quel est votre plus grand rêve actuellement ?',
      'Quelle petite action pouvez-vous faire demain pour avancer ?',
      'Comment vous sentirez-vous quand vous aurez atteint cet objectif ?',
    ],
  },
  {
    category: 'Émotions',
    icon: '❤️',
    color: 'hsl(25, 85%, 55%)',
    prompts: [
      'Comment vous sentez-vous en ce moment et pourquoi ?',
      'Quelle émotion a dominé votre journée ?',
      'De quoi avez-vous besoin pour vous sentir mieux ?',
    ],
  },
  {
    category: 'Créativité',
    icon: '🎨',
    color: 'hsl(160, 50%, 60%)',
    prompts: [
      'Si vous pouviez créer quelque chose aujourd\'hui, ce serait quoi ?',
      'Racontez un rêve que vous avez fait récemment.',
      'Imaginez votre vie idéale dans 5 ans.',
    ],
  },
];

const MOODS = [
  { emoji: '😊', label: 'Joyeux', color: 'hsl(45, 90%, 60%)' },
  { emoji: '😌', label: 'Calme', color: 'hsl(200, 70%, 60%)' },
  { emoji: '😔', label: 'Triste', color: 'hsl(220, 60%, 50%)' },
  { emoji: '😠', label: 'En colère', color: 'hsl(0, 70%, 60%)' },
  { emoji: '😰', label: 'Anxieux', color: 'hsl(280, 60%, 65%)' },
  { emoji: '🤗', label: 'Reconnaissant', color: 'hsl(160, 50%, 60%)' },
];

export default function JournalJourneyPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [showPromptSelection, setShowPromptSelection] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('journalEntries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEntries(parsed);
      setTotalEntries(parsed.length);
    }
    const storedStreak = localStorage.getItem('journalStreak');
    if (storedStreak) setStreak(parseInt(storedStreak));
  }, []);

  const selectPrompt = (category: any, prompt: string) => {
    setCurrentCategory(category);
    setCurrentPrompt(prompt);
    setShowPromptSelection(false);
  };

  const saveEntry = () => {
    if (!content.trim() || !selectedMood) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      prompt: currentPrompt,
      content,
      mood: selectedMood,
      tags: [currentCategory.category],
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    setTotalEntries(totalEntries + 1);
    setStreak(streak + 1);
    localStorage.setItem('journalStreak', (streak + 1).toString());

    // Reset
    setContent('');
    setSelectedMood('');
    setShowPromptSelection(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📖 Journal Intime
          </motion.h1>
          <p className="text-muted-foreground">Exprimez-vous librement et suivez votre évolution</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-accent/20">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-foreground">{totalEntries}</div>
            <div className="text-sm text-muted-foreground">Entrées</div>
          </Card>
          <Card className="p-4 text-center border-primary/20">
            <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-sm text-muted-foreground">Jours d'affilée</div>
          </Card>
          <Card className="p-4 text-center border-secondary/20">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-foreground">
              {entries.length > 0 ? entries.length * 15 : 0}
            </div>
            <div className="text-sm text-muted-foreground">Minutes d'écriture</div>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {showPromptSelection ? (
            <motion.div
              key="prompts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-center text-foreground">
                Choisissez une inspiration
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {JOURNAL_PROMPTS.map((category) => (
                  <Card key={category.category} className="p-6 border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="text-3xl p-3 rounded-full"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.prompts.map((prompt, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => selectPrompt(category, prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="writing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div
                  className="flex items-start gap-4 mb-6 p-4 rounded-lg"
                  style={{ backgroundColor: `${currentCategory?.color}10` }}
                >
                  <div className="text-3xl">{currentCategory?.icon}</div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{currentCategory?.category}</h3>
                    <p className="text-muted-foreground italic">{currentPrompt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      Comment vous sentez-vous ?
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {MOODS.map((mood) => (
                        <Button
                          key={mood.label}
                          variant={selectedMood === mood.label ? 'default' : 'outline'}
                          onClick={() => setSelectedMood(mood.label)}
                          className="gap-2"
                        >
                          <span className="text-xl">{mood.emoji}</span>
                          {mood.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      Votre réponse
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Écrivez librement..."
                      className="min-h-[300px] text-base"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setShowPromptSelection(true)} variant="outline">
                      Changer de prompt
                    </Button>
                    <Button
                      onClick={saveEntry}
                      disabled={!content.trim() || !selectedMood}
                      className="flex-1 gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Sauvegarder l'entrée
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">📚 Dernières entrées</h3>
            <div className="space-y-4">
              {entries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <span className="text-2xl">
                      {MOODS.find((m) => m.label === entry.mood)?.emoji}
                    </span>
                  </div>
                  <p className="text-sm italic text-muted-foreground mb-2">{entry.prompt}</p>
                  <p className="text-foreground line-clamp-2">{entry.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
