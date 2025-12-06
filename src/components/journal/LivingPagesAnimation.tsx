// @ts-nocheck
/**
 * Living Pages Animation Component
 * Animated visualization of journal entries as floating, living pages
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, Sparkles, Calendar } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LivingPagesAnimationProps {
  notes: SanitizedNote[];
  maxPages?: number;
}

// Page colors based on mood/emotion
const PAGE_COLORS = [
  { bg: 'from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20', border: 'border-rose-200 dark:border-rose-800' },
  { bg: 'from-sky-100 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20', border: 'border-sky-200 dark:border-sky-800' },
  { bg: 'from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { bg: 'from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20', border: 'border-amber-200 dark:border-amber-800' },
  { bg: 'from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20', border: 'border-violet-200 dark:border-violet-800' },
  { bg: 'from-cyan-100 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/20', border: 'border-cyan-200 dark:border-cyan-800' },
];

export const LivingPagesAnimation: React.FC<LivingPagesAnimationProps> = ({
  notes,
  maxPages = 12,
}) => {
  // Select recent notes and assign colors
  const recentPages = useMemo(() => {
    return notes
      .slice(0, maxPages)
      .map((note, index) => ({
        ...note,
        colorScheme: PAGE_COLORS[index % PAGE_COLORS.length],
        delay: index * 0.1,
        floatDelay: index * 0.3,
      }));
  }, [notes, maxPages]);

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pages vivantes
          </CardTitle>
          <CardDescription>Vos entrées récentes animées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Commencez à écrire pour voir vos pages prendre vie</p>
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
              <FileText className="w-5 h-5" />
              Pages vivantes
            </CardTitle>
            <CardDescription>
              Vos {Math.min(maxPages, notes.length)} entrées les plus récentes
            </CardDescription>
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 overflow-hidden" style={{ height: '500px' }}>
          {/* Floating pages */}
          <div className="relative w-full h-full">
            {recentPages.map((page, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const x = 10 + col * 30;
              const y = 10 + row * 25;

              return (
                <motion.div
                  key={page.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '28%',
                    zIndex: recentPages.length - index,
                  }}
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotateX: -15,
                    rotateY: 10,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay: page.delay,
                    duration: 0.8,
                    type: 'spring',
                    bounce: 0.3,
                  }}
                  whileHover={{
                    scale: 1.05,
                    zIndex: 100,
                    rotateZ: Math.random() * 4 - 2,
                    transition: { duration: 0.2 },
                  }}
                >
                  {/* Page card */}
                  <motion.div
                    className={`bg-gradient-to-br ${page.colorScheme.bg} border-2 ${page.colorScheme.border} rounded-lg p-4 shadow-lg backdrop-blur-sm`}
                    animate={{
                      y: [0, -5, 0],
                      rotateZ: [0, 1, 0, -1, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: page.floatDelay,
                      ease: 'easeInOut',
                    }}
                  >
                    {/* Date badge */}
                    <div className="flex items-center gap-1 mb-2 text-xs opacity-60">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(parseISO(page.createdAt), 'dd MMM', { locale: fr })}
                      </span>
                    </div>

                    {/* Title */}
                    {page.title && (
                      <h4 className="font-semibold text-sm mb-2 line-clamp-1">
                        {page.title}
                      </h4>
                    )}

                    {/* Content preview */}
                    <p className="text-xs opacity-75 line-clamp-3">
                      {page.content}
                    </p>

                    {/* Tags */}
                    {page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {page.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30"
                          >
                            {tag}
                          </span>
                        ))}
                        {page.tags.length > 2 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30">
                            +{page.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Page corner fold effect */}
                    <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-white/20 dark:border-t-black/20 border-r-transparent" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Ambient particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Info text */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          ✨ Survolez les pages pour les voir s'animer
        </p>
      </CardContent>
    </Card>
  );
};
