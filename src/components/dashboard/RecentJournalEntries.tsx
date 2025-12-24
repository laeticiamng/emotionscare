// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Heart, Star, Search, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'emotionscare_journal_favorites';

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  snippet: string;
  mood?: 'excellent' | 'good' | 'neutral' | 'difficult' | 'very_difficult';
  tags?: string[];
  isFavorite?: boolean;
  wordCount?: number;
}

const MOOD_CONFIG = {
  excellent: { emoji: '😊', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  good: { emoji: '🙂', color: 'text-green-500', bg: 'bg-green-500/10' },
  neutral: { emoji: '😐', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  difficult: { emoji: '😔', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  very_difficult: { emoji: '😢', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const RecentJournalEntries: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load journal entries from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const formattedEntries: JournalEntry[] = (data || []).map(e => ({
          id: e.id,
          title: e.title || 'Sans titre',
          date: e.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          snippet: e.content?.substring(0, 150) || '',
          mood: e.mood as JournalEntry['mood'],
          tags: e.tags || [],
          wordCount: e.content?.split(/\s+/).filter(Boolean).length || 0
        }));

        setEntries(formattedEntries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        // Invalid data
      }
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  // Filter and search entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || favorites.includes(entry.id);
    
    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const avgMood = entries.reduce((sum, e) => {
    const moodValues = { excellent: 5, good: 4, neutral: 3, difficult: 2, very_difficult: 1 };
    return sum + (e.mood ? moodValues[e.mood] : 3);
  }, 0) / entries.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Journal récent
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/app/journal')}
          >
            Tout voir
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button
            variant={filter === 'favorites' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(filter === 'all' ? 'favorites' : 'all')}
          >
            <Star className={`h-4 w-4 ${filter === 'favorites' ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => {
              const moodConfig = entry.mood ? MOOD_CONFIG[entry.mood] : null;
              const isFavorite = favorites.includes(entry.id);
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/app/journal/${entry.id}`)}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {moodConfig && (
                        <span className={`text-lg ${moodConfig.color}`} title={entry.mood}>
                          {moodConfig.emoji}
                        </span>
                      )}
                      <h4 className="font-medium text-base truncate">{entry.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => toggleFavorite(entry.id, e)}
                      >
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {entry.snippet}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {entry.wordCount && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {entry.wordCount} mots
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              {searchQuery || filter === 'favorites' ? (
                <>
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucun résultat trouvé</p>
                </>
              ) : (
                <>
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucune entrée de journal pour le moment</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => navigate('/app/journal-new')}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Créer une entrée
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="mt-4 pt-3 border-t grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-primary">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Entrées</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-500">{totalWords}</p>
              <p className="text-xs text-muted-foreground">Mots</p>
            </div>
            <div>
              <p className="text-lg font-bold text-yellow-500">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favoris</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentJournalEntries;
