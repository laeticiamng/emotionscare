// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, TrendingUp, Calendar, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  emotionalTags: string[];
  aiInsights: string[];
  suggestions: AISuggestion[];
  createdAt: string;
  patterns: EmotionalPattern[];
}

interface AISuggestion {
  type: 'reflection' | 'action' | 'technique' | 'resource';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface EmotionalPattern {
  pattern: string;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: string;
}

const IntelligentJournal: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  const loadEntries = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const formattedEntries: JournalEntry[] = data?.map(entry => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood || 'neutral',
        emotionalTags: entry.emotional_tags || [],
        aiInsights: entry.ai_insights || [],
        suggestions: entry.suggestions || [],
        createdAt: entry.created_at,
        patterns: entry.patterns || []
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      // Entries loading error
    }
  }, [user]);

  const analyzeEntry = useCallback(async (content: string): Promise<{
    mood: string;
    emotionalTags: string[];
    insights: string[];
    suggestions: AISuggestion[];
    patterns: EmotionalPattern[];
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-journal', {
        body: {
          content,
          userId: user?.id,
          previousEntries: entries.slice(0, 5).map(e => ({
            content: e.content,
            mood: e.mood,
            date: e.createdAt
          }))
        }
      });

      if (error) throw error;

      return {
        mood: data.mood,
        emotionalTags: data.emotional_tags,
        insights: data.insights,
        suggestions: data.suggestions,
        patterns: data.patterns
      };
    } catch (error) {
      // Entry analysis error
      throw error;
    }
  }, [user, entries]);

  const saveEntry = useCallback(async () => {
    if (!currentEntry.trim() || !user) return;

    setIsAnalyzing(true);

    try {
      // Analyze the entry with AI
      const analysis = await analyzeEntry(currentEntry);

      // Save to database
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: currentEntry,
          mood: analysis.mood,
          emotional_tags: analysis.emotionalTags,
          ai_insights: analysis.insights,
          suggestions: analysis.suggestions,
          patterns: analysis.patterns
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: JournalEntry = {
        id: data.id,
        content: currentEntry,
        mood: analysis.mood,
        emotionalTags: analysis.emotionalTags,
        aiInsights: analysis.insights,
        suggestions: analysis.suggestions,
        createdAt: data.created_at,
        patterns: analysis.patterns
      };

      setEntries(prev => [newEntry, ...prev]);
      setSuggestions(analysis.suggestions);
      setPatterns(analysis.patterns);
      setAiInsights(analysis.insights);
      setCurrentEntry('');

      toast({
        title: "Entrée sauvegardée",
        description: "Votre journal a été analysé et sauvegardé avec succès",
      });

    } catch (error) {
      // Entry save error
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'entrée",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentEntry, user, analyzeEntry, toast]);

  const generateSmartPrompts = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('journal-smart-prompts', {
        body: {
          userId: user?.id,
          recentEntries: entries.slice(0, 3),
          currentMood: entries[0]?.mood || 'neutral'
        }
      });

      if (error) throw error;

      return data.prompts || [];
    } catch (error) {
      // Prompts generation error
      return [];
    }
  }, [user, entries]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Journal Intelligent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="write">Écrire</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="Comment vous sentez-vous aujourd'hui ? Partagez vos pensées, émotions et expériences..."
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {currentEntry.length}/1000 caractères
                  </div>
                  <Button 
                    onClick={saveEntry} 
                    disabled={!currentEntry.trim() || isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isAnalyzing ? 'Analyse en cours...' : 'Analyser & Sauvegarder'}
                  </Button>
                </div>

                {/* Smart Prompts */}
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Suggestions d'écriture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" size="sm" className="text-left justify-start">
                      "Qu'est-ce qui vous a apporté le plus de joie aujourd'hui ?"
                    </Button>
                    <Button variant="ghost" size="sm" className="text-left justify-start">
                      "Comment votre humeur a-t-elle évolué cette semaine ?"
                    </Button>
                    <Button variant="ghost" size="sm" className="text-left justify-start">
                      "Quelle leçon avez-vous apprise récemment ?"
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Suggestions Personnalisées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge 
                            variant={suggestion.priority === 'high' ? 'default' : 'secondary'}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {aiInsights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Insights IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm">{insight}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              {patterns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Patterns Émotionnels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patterns.map((pattern, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{pattern.pattern}</h4>
                          <Badge 
                            variant={pattern.trend === 'increasing' ? 'default' : 
                                   pattern.trend === 'decreasing' ? 'destructive' : 'secondary'}
                          >
                            {pattern.trend}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Fréquence: {pattern.frequency}x cette semaine
                        </div>
                        <p className="text-sm bg-muted p-2 rounded">
                          💡 {pattern.recommendation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <Badge variant="outline">{entry.mood}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{entry.content}</p>
                    
                    {entry.emotionalTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.emotionalTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentJournal;