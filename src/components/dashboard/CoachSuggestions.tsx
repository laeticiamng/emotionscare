// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, BookOpen, Music, Brain, Sparkles, Check, Clock, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'emotionscare_coach_suggestions';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  duration: string;
  category: 'respiration' | 'meditation' | 'music' | 'journal' | 'exercise';
  relevanceScore: number;
  completedCount: number;
  lastCompleted?: string;
  savedForLater: boolean;
}

const CATEGORY_COLORS = {
  respiration: 'text-cyan-500 bg-cyan-500/10',
  meditation: 'text-purple-500 bg-purple-500/10',
  music: 'text-pink-500 bg-pink-500/10',
  journal: 'text-blue-500 bg-blue-500/10',
  exercise: 'text-green-500 bg-green-500/10',
};

const initialSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Exercice de respiration',
    description: 'Une courte séance de respiration consciente pour réduire le stress',
    icon: Heart,
    link: '/app/breath',
    duration: '3 min',
    category: 'respiration',
    relevanceScore: 95,
    completedCount: 0,
    savedForLater: false,
  },
  {
    id: '2',
    title: 'Méditation guidée',
    description: 'Une méditation de 5 minutes pour se recentrer et calmer l\'esprit',
    icon: Brain,
    link: '/app/meditation',
    duration: '5 min',
    category: 'meditation',
    relevanceScore: 88,
    completedCount: 0,
    savedForLater: false,
  },
  {
    id: '3',
    title: 'Musique relaxante',
    description: 'Une playlist adaptée à votre état émotionnel actuel',
    icon: Music,
    link: '/app/music',
    duration: '10 min',
    category: 'music',
    relevanceScore: 82,
    completedCount: 0,
    savedForLater: false,
  },
  {
    id: '4',
    title: 'Écriture gratitude',
    description: 'Notez 3 choses positives de votre journée dans votre journal',
    icon: BookOpen,
    link: '/app/journal',
    duration: '5 min',
    category: 'journal',
    relevanceScore: 75,
    completedCount: 0,
    savedForLater: false,
  },
];

const CoachSuggestions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [showSaved, setShowSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with initial suggestions to keep icons
        const merged = initialSuggestions.map(initial => {
          const saved = parsed.find((s: Suggestion) => s.id === initial.id);
          return saved ? { ...initial, ...saved } : initial;
        });
        setSuggestions(merged);
      } catch (e) {
        // Invalid data
      }
    }
  }, []);

  // Save to localStorage
  const saveSuggestions = (newSuggestions: Suggestion[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSuggestions));
    setSuggestions(newSuggestions);
  };

  const handleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = suggestions.map(s => 
      s.id === id 
        ? { ...s, completedCount: s.completedCount + 1, lastCompleted: new Date().toISOString() }
        : s
    );
    saveSuggestions(updated);
    
    const suggestion = suggestions.find(s => s.id === id);
    toast({
      title: '✓ Activité complétée !',
      description: `${suggestion?.title} - Bravo !`,
    });
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = suggestions.map(s => 
      s.id === id ? { ...s, savedForLater: !s.savedForLater } : s
    );
    saveSuggestions(updated);
  };

  const refreshSuggestions = () => {
    // Simulate refreshing suggestions with new relevance scores
    const updated = suggestions.map(s => ({
      ...s,
      relevanceScore: Math.floor(Math.random() * 30) + 70,
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
    saveSuggestions(updated);
    
    toast({
      title: '🔄 Suggestions mises à jour',
      description: 'Basées sur votre état actuel',
    });
  };

  // Filter and sort suggestions
  const displayedSuggestions = suggestions
    .filter(s => showSaved ? s.savedForLater : true)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, showSaved ? undefined : 3);

  const savedCount = suggestions.filter(s => s.savedForLater).length;
  const totalCompleted = suggestions.reduce((sum, s) => sum + s.completedCount, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Suggestions du coach
          </CardTitle>
          <div className="flex items-center gap-1">
            {savedCount > 0 && (
              <Button
                variant={showSaved ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
              >
                <Star className={`h-4 w-4 mr-1 ${showSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {savedCount}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refreshSuggestions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-2">
          <Progress value={(totalCompleted / (suggestions.length * 3)) * 100} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground">{totalCompleted} complétées</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayedSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              const categoryColor = CATEGORY_COLORS[suggestion.category];
              const wasCompletedToday = suggestion.lastCompleted && 
                new Date(suggestion.lastCompleted).toDateString() === new Date().toDateString();
              
              return (
                <motion.div 
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 hover:cursor-pointer transition-all ${
                    wasCompletedToday ? 'bg-green-500/5 border-green-500/20' : ''
                  }`}
                  onClick={() => navigate(suggestion.link)}
                >
                  <div className={`p-2 rounded-full ${categoryColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      {wasCompletedToday && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">
                          <Check className="h-3 w-3 mr-1" />
                          Fait
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{suggestion.description}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {suggestion.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.relevanceScore}% pertinent
                      </Badge>
                      {suggestion.completedCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ×{suggestion.completedCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => toggleSave(suggestion.id, e)}
                    >
                      <Star className={`h-4 w-4 ${suggestion.savedForLater ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => handleComplete(suggestion.id, e)}
                    >
                      <Check className="h-4 w-4 text-muted-foreground hover:text-green-500" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {displayedSuggestions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>{showSaved ? 'Aucune suggestion sauvegardée' : 'Aucune suggestion disponible'}</p>
              {showSaved && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowSaved(false)}
                >
                  Voir toutes les suggestions
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Quick action */}
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/app/coach')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Consulter le coach IA
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachSuggestions;
