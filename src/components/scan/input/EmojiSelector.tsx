import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Search, Heart, Clock, TrendingUp, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useScanSettings } from '@/hooks/useScanSettings';

// Extended emoji list with categories
const EMOJI_CATEGORIES = {
  happy: {
    label: 'Joie',
    icon: '😊',
    emojis: ["😊", "😃", "😄", "🥰", "😍", "🤗", "😁", "🥳", "😸", "💖"]
  },
  sad: {
    label: 'Tristesse',
    icon: '😢',
    emojis: ["😢", "😭", "😔", "😞", "😥", "🥺", "😿", "💔", "😩", "😪"]
  },
  angry: {
    label: 'Colère',
    icon: '😠',
    emojis: ["😠", "😡", "🤬", "😤", "👿", "💢", "🔥", "😾", "💥", "⚡"]
  },
  anxious: {
    label: 'Anxiété',
    icon: '😨',
    emojis: ["😨", "😰", "😱", "😳", "🤯", "😵", "🫣", "😬", "🥴", "😓"]
  },
  calm: {
    label: 'Calme',
    icon: '😌',
    emojis: ["😴", "😪", "🥱", "😌", "🧘‍♀️", "🌙", "☁️", "🍃", "🌊", "✨"]
  },
  love: {
    label: 'Amour',
    icon: '❤️',
    emojis: ["❤️", "💕", "💗", "💓", "💘", "💝", "🥰", "😘", "🫶", "💑"]
  }
};

interface EmojiSelectorProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ emojis, onEmojiClick, onClear }) => {
  const { 
    emojiFavorites, emojiHistory, emojiStats,
    updateEmojiFavorites, updateEmojiHistory, updateEmojiStats 
  } = useScanSettings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(emojiFavorites);
  const [history, setHistory] = useState<string[]>(emojiHistory);
  const [stats, setStats] = useState<Record<string, number>>(emojiStats);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Sync from hook
  useEffect(() => {
    setFavorites(emojiFavorites);
    setHistory(emojiHistory);
    setStats(emojiStats);
  }, [emojiFavorites, emojiHistory, emojiStats]);

  // Get all emojis flat
  const allEmojis = useMemo(() => {
    const all: string[] = [];
    Object.values(EMOJI_CATEGORIES).forEach(cat => {
      all.push(...cat.emojis);
    });
    return [...new Set(all)];
  }, []);

  // Filter emojis based on search and category
  const filteredEmojis = useMemo(() => {
    let result: string[] = [];
    
    if (activeCategory === 'all') {
      result = allEmojis;
    } else if (activeCategory === 'favorites') {
      result = favorites;
    } else if (activeCategory === 'history') {
      result = history;
    } else if (activeCategory === 'trending') {
      result = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([emoji]) => emoji);
    } else {
      result = EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES]?.emojis || [];
    }

    if (searchQuery) {
      // Simple search - could be enhanced with emoji names
      result = result.filter(emoji => emoji.includes(searchQuery));
    }

    return result;
  }, [activeCategory, searchQuery, favorites, history, stats, allEmojis]);

  // Top 5 most used emojis for suggestions
  const suggestions = useMemo(() => {
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emoji]) => emoji);
  }, [stats]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiClick(emoji);
    
    // Update history
    const newHistory = [emoji, ...history.filter(e => e !== emoji)].slice(0, 20);
    setHistory(newHistory);
    updateEmojiHistory(newHistory);
    
    // Update stats
    const newStats = { ...stats, [emoji]: (stats[emoji] || 0) + 1 };
    setStats(newStats);
    updateEmojiStats(newStats);
  };

  const toggleFavorite = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(emoji)
      ? favorites.filter(f => f !== emoji)
      : [...favorites, emoji];
    setFavorites(newFavorites);
    updateEmojiFavorites(newFavorites);
  };

  const isFavorite = (emoji: string) => favorites.includes(emoji);

  const getEmojiUsageCount = (emoji: string) => stats[emoji] || 0;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Selected emojis display */}
        <AnimatePresence>
          {emojis && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-3 bg-primary/10 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl">{emojis}</span>
                <Badge variant="secondary" className="text-xs">
                  {emojis.length} emoji{emojis.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4 mr-1" /> Effacer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Suggestions based on most used */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Vos favoris</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-6 text-xs"
              >
                Masquer
              </Button>
            </div>
            <div className="flex gap-2">
              {suggestions.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl h-10 w-10 rounded-full hover:bg-background/80 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="all" className="text-xs px-2 py-1 h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tous
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs px-2 py-1 h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="h-3 w-3 mr-1" />
              Favoris ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs px-2 py-1 h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Récents
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs px-2 py-1 h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              Tendances
            </TabsTrigger>
            {Object.entries(EMOJI_CATEGORIES).map(([key, cat]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="text-xs px-2 py-1 h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat.icon} {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Emoji grid */}
          <div className="mt-4">
            {filteredEmojis.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun emoji trouvé</p>
                {activeCategory === 'favorites' && (
                  <p className="text-xs mt-1">Cliquez sur ❤️ pour ajouter des favoris</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
                {filteredEmojis.map((emoji, index) => (
                  <Tooltip key={`${emoji}-${index}`}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                      >
                        <motion.button
                          onClick={() => handleEmojiClick(emoji)}
                          className="text-2xl h-11 w-11 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {emoji}
                          {/* Usage indicator */}
                          {getEmojiUsageCount(emoji) > 5 && (
                            <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                              {getEmojiUsageCount(emoji)}
                            </span>
                          )}
                        </motion.button>
                        
                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFavorite(emoji, e)}
                          className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-full p-0.5 shadow-sm"
                        >
                          <Heart 
                            className={`h-3 w-3 ${isFavorite(emoji) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                          />
                        </button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>Utilisé {getEmojiUsageCount(emoji)} fois</p>
                      {isFavorite(emoji) && <p className="text-amber-500">⭐ Favori</p>}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </Tabs>

        {/* Stats footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{Object.keys(stats).length} emojis utilisés</span>
          <span>{Object.values(stats).reduce((a, b) => a + b, 0)} utilisations totales</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EmojiSelector;
