// @ts-nocheck
/**
 * Journal Word Cloud Component
 * Colored word cloud visualization of journal entries
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sparkles } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';

interface WordFrequency {
  word: string;
  count: number;
  emotion?: string; // PANAS emotion category
}

interface JournalWordCloudProps {
  notes: SanitizedNote[];
  maxWords?: number;
}

// Common French stop words to filter out
const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes',
  'son', 'sa', 'ses', 'ce', 'cette', 'ces', 'qui', 'que', 'quoi', 'dont', 'où', 'à', 'au', 'aux',
  'dans', 'pour', 'par', 'avec', 'sans', 'sur', 'sous', 'très', 'plus', 'moins', 'bien', 'mal',
  'être', 'avoir', 'faire', 'dire', 'aller', 'voir', 'savoir', 'pouvoir', 'falloir', 'devoir',
  'est', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'sommes', 'êtes', 'sont',
  'me', 'te', 'se', 'lui', 'leur', 'leurs', 'moi', 'toi', 'si', 'ne', 'pas', 'aussi', 'tout',
  'toute', 'tous', 'toutes', 'autre', 'autres', 'même', 'encore', 'déjà', 'après', 'avant',
]);

// Emotion colors based on PANAS dimensions
const EMOTION_COLORS = {
  positive: ['#10b981', '#34d399', '#6ee7b7'], // Green spectrum
  negative: ['#ef4444', '#f87171', '#fca5a5'], // Red spectrum
  neutral: ['#8b5cf6', '#a78bfa', '#c4b5fd'], // Purple spectrum
  active: ['#f59e0b', '#fbbf24', '#fcd34d'], // Amber spectrum
  calm: ['#3b82f6', '#60a5fa', '#93c5fd'], // Blue spectrum
};

export const JournalWordCloud: React.FC<JournalWordCloudProps> = ({
  notes,
  maxWords = 50,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract and count words from notes
  const wordFrequencies = useMemo(() => {
    const wordMap = new Map<string, number>();

    notes.forEach((note) => {
      // Use text field from SanitizedNote
      const text = (note.text || '').toLowerCase();

      // Split into words, remove punctuation
      const words = text
        .split(/\s+/)
        .map((w) => w.replace(/[^\w\séèêëàâäôöùûüçñ-]/g, ''))
        .filter((w) => w.length > 3 && !FRENCH_STOP_WORDS.has(w));

      words.forEach((word) => {
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
    });

    // Convert to array and sort by frequency
    return Array.from(wordMap.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxWords);
  }, [notes, maxWords]);

  // Assign colors based on frequency (simulate emotion)
  const wordsWithColors = useMemo(() => {
    const maxCount = wordFrequencies[0]?.count || 1;

    return wordFrequencies.map((wf, index) => {
      const intensity = wf.count / maxCount;

      // Assign emotion category based on frequency and position
      let emotion: string;
      let colors: string[];

      if (intensity > 0.7) {
        emotion = 'active';
        colors = EMOTION_COLORS.active;
      } else if (intensity > 0.5) {
        emotion = 'positive';
        colors = EMOTION_COLORS.positive;
      } else if (intensity > 0.3) {
        emotion = 'calm';
        colors = EMOTION_COLORS.calm;
      } else {
        emotion = 'neutral';
        colors = EMOTION_COLORS.neutral;
      }

      const colorIndex = Math.floor((index % 3));
      const color = colors[colorIndex];

      return {
        ...wf,
        emotion,
        color,
        size: 12 + intensity * 32, // 12px to 44px
      };
    });
  }, [wordFrequencies]);

  // Layout words in a compact cloud formation
  const positionedWords = useMemo(() => {
    if (!containerRef.current) return [];

    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    return wordsWithColors.map((word, index) => {
      const angle = (index / wordsWithColors.length) * Math.PI * 2;
      const radius = 50 + (index % 4) * 60;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      return {
        ...word,
        x: `${(x / width) * 100}%`,
        y: `${(y / height) * 100}%`,
      };
    });
  }, [wordsWithColors]);

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Nuage de mots
          </CardTitle>
          <CardDescription>Vos mots les plus fréquents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Écrivez quelques notes pour voir votre nuage de mots</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Nuage de mots
            </CardTitle>
            <CardDescription>
              {wordFrequencies.length} mots les plus fréquents dans vos {notes.length} notes
            </CardDescription>
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 overflow-hidden"
          style={{ height: '400px' }}
        >
          {/* Word cloud */}
          {positionedWords.map((word, index) => (
            <motion.div
              key={word.word}
              className="absolute cursor-pointer select-none"
              style={{
                left: word.x,
                top: word.y,
                fontSize: `${word.size}px`,
                color: word.color,
                fontWeight: word.count > 3 ? 'bold' : 'normal',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: selectedWord === word.word ? 1 : 0.7,
                scale: selectedWord === word.word ? 1.2 : 1,
              }}
              transition={{
                delay: index * 0.02,
                duration: 0.5,
                type: 'spring',
              }}
              whileHover={{
                scale: 1.2,
                opacity: 1,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedWord(word.word === selectedWord ? null : word.word)}
            >
              {word.word}
            </motion.div>
          ))}

          {/* Selected word info */}
          {selectedWord && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="text-sm px-4 py-2">
                <strong>{selectedWord}</strong>
                <span className="ml-2 opacity-70">
                  ×{wordsWithColors.find((w) => w.word === selectedWord)?.count}
                </span>
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Fréquent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Très fréquent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Occasionnel</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Rare</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
