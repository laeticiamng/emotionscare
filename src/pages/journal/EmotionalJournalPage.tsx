// @ts-nocheck
/**
 * EmotionalJournalPage - Page principale du journal émotionnel
 * /dashboard/journal
 */

import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, BookOpen, Plus, Download, 
  BarChart3, FileText, Filter, TrendingUp, TrendingDown, Minus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { EmotionalJournalEntryForm, EmotionalJournalEntryData } from '@/components/journal/EmotionalJournalEntryForm';
import { EmotionalJournalTimeline } from '@/components/journal/EmotionalJournalTimeline';
import { EmotionalJournalFilters } from '@/components/journal/EmotionalJournalFilters';
import { EmotionalType, getEmotionalById } from '@/components/journal/EmotionalJournalSelector';
import { useEmotionalJournalEntries } from '@/hooks/useEmotionalJournalEntries';
import { usePageSEO } from '@/hooks/usePageSEO';
import { toast } from 'sonner';

const EmotionalJournalPage: React.FC = () => {
  usePageSEO({
    title: 'Journal Émotionnel - EmotionsCare',
    description: 'Tiens un journal de tes émotions pour mieux te comprendre.',
    keywords: 'journal émotionnel, suivi humeur, bien-être mental',
  });

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [emotionFilter, setEmotionFilter] = useState<EmotionalType | 'all'>('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const {
    entries,
    stats,
    isLoading,
    createEntry,
    isCreating,
    deleteEntry,
    toggleFavorite,
    exportEntries,
  } = useEmotionalJournalEntries({
    emotion: emotionFilter !== 'all' ? emotionFilter : undefined,
    startDate,
    endDate,
  });

  const handleSubmit = async (data: EmotionalJournalEntryData) => {
    await createEntry(data);
    setShowNewEntry(false);
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportEntries();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-journal-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Export téléchargé !');
    } catch (error) {
      logger.error('Export error:', error, 'SYSTEM');
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleResetFilters = () => {
    setEmotionFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDelete = async (entryId: string) => {
    if (window.confirm('Supprimer cette entrée ?')) {
      await deleteEntry(entryId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Journal Émotionnel
              </h1>
              <p className="text-muted-foreground mt-1">
                Exprime et suis tes émotions au quotidien
              </p>
            </div>

            {/* Actions rapides */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtres
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                title="Exporter mes données (RGPD Art. 20)"
              >
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
              <Button
                size="sm"
                onClick={() => setShowNewEntry(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle entrée
              </Button>
            </div>
          </div>
        </header>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={FileText}
            value={stats.totalEntries}
            label="Entrées"
          />
          <StatCard
            icon={BarChart3}
            value={`${stats.avgIntensity}/10`}
            label="Intensité moy."
          />
          <StatCard
            emoji={getEmotionalById(stats.mostFrequentEmotion as EmotionalType)?.emoji || '—'}
            label="Émotion fréquente"
          />
          <StatCard
            value={Object.keys(stats.emotionCounts).length}
            label="Émotions vécues"
          />
        </div>

        {/* Suivi longitudinal — Tendances émotionnelles */}
        {entries.length >= 3 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Évolution émotionnelle
                </h3>
                {(() => {
                  const recent = entries.slice(0, 5);
                  const older = entries.slice(5, 10);
                  if (recent.length < 2 || older.length < 1) return null;
                  const recentAvg = recent.reduce((s, e) => s + (e.intensity || 5), 0) / recent.length;
                  const olderAvg = older.reduce((s, e) => s + (e.intensity || 5), 0) / older.length;
                  const diff = recentAvg - olderAvg;
                  if (Math.abs(diff) < 0.5) return <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" /> Stable</span>;
                  return diff > 0 
                    ? <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> En hausse</span>
                    : <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> En baisse</span>;
                })()}
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={entries.slice(0, 20).reverse().map((e, i) => ({
                    day: i + 1,
                    intensité: e.intensity || 5,
                  }))}>
                    <defs>
                      <linearGradient id="journalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={[0, 10]} hide />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: number) => [`${value}/10`, 'Intensité']}
                    />
                    <Area type="monotone" dataKey="intensité" stroke="hsl(var(--primary))" fill="url(#journalGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Dernières {Math.min(entries.length, 20)} entrées · L'intensité émotionnelle reflète la force de vos ressentis
              </p>
            </CardContent>
          </Card>
        )}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <EmotionalJournalFilters
                emotion={emotionFilter}
                startDate={startDate}
                endDate={endDate}
                onEmotionChange={setEmotionFilter}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onReset={handleResetFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nouvelle entrée (modal/expandable) */}
        <AnimatePresence>
          {showNewEntry && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <EmotionalJournalEntryForm
                onSubmit={handleSubmit}
                onCancel={() => setShowNewEntry(false)}
                isSubmitting={isCreating}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline des entrées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Historique 
              {entries.length > 0 && (
                <span className="text-muted-foreground font-normal ml-2">
                  ({entries.length} entrée{entries.length > 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>

          <EmotionalJournalTimeline
            entries={entries}
            isLoading={isLoading}
            onDelete={handleDelete}
            onToggleFavorite={(id: string, isFav: boolean) => toggleFavorite({ entryId: id, isFavorite: isFav })}
          />
        </div>

        {/* Info RGPD */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <p>
            <strong>🔒 Confidentialité :</strong> Tes données sont privées et sécurisées. 
            Tu peux exporter ou supprimer tes données à tout moment conformément au RGPD (Art. 17 & 20).
          </p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon?: React.FC<{ className?: string }>;
  emoji?: string;
  value?: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, emoji, value, label }) => (
  <Card>
    <CardContent className="p-3 text-center">
      {emoji ? (
        <p className="text-2xl mb-1">{emoji}</p>
      ) : Icon ? (
        <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
      ) : null}
      {value !== undefined && (
        <p className="text-lg font-bold">{value}</p>
      )}
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default EmotionalJournalPage;
