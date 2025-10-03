// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import EmotionSelector from '@/components/emotion/EmotionSelector';
import MoodTracker from '@/components/emotion/MoodTracker';

interface EmotionEntry {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  ai_feedback?: string;
}

const UnifiedEmotionCheckin: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<EmotionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickCheckin, setShowQuickCheckin] = useState(false);

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;

      const entries = data?.map(entry => ({
        id: entry.id,
        emotion: entry.emojis || 'neutral',
        intensity: entry.score || 5,
        timestamp: entry.date,
        ai_feedback: entry.ai_feedback
      })) || [];

      setRecentEntries(entries);
    } catch (error) {
      // Entries loading error
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCheckin = async (emotion: any) => {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .insert([{
          emojis: emotion.name,
          score: emotion.intensity,
          text: `Check-in rapide: ${emotion.name}`,
          date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Recharger les entrées
      await loadRecentEntries();
      setShowQuickCheckin(false);
    } catch (error) {
      // Save entry error
    }
  };

  const mockMoodData = recentEntries.map((entry, index) => ({
    date: new Date(entry.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    mood: entry.intensity,
    emotion: entry.emotion,
    note: entry.ai_feedback
  }));

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Check-in rapide
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowQuickCheckin(!showQuickCheckin)}
            >
              {showQuickCheckin ? 'Masquer' : 'Nouveau'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showQuickCheckin && (
          <CardContent>
            <EmotionSelector 
              onEmotionSelect={handleQuickCheckin}
              showIntensity={true}
            />
          </CardContent>
        )}
      </Card>

      {/* Mood Tracker */}
      {mockMoodData.length > 0 && (
        <MoodTracker 
          data={mockMoodData}
        />
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Entrées récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune entrée émotionnelle pour le moment</p>
              <p className="text-sm mt-2">Commencez par un check-in rapide ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {entry.emotion === 'Heureux' ? '😊' : 
                       entry.emotion === 'Triste' ? '😢' : 
                       entry.emotion === 'Stressé' ? '😰' : '😐'}
                    </div>
                    <div>
                      <p className="font-medium">{entry.emotion}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {entry.intensity}/10
                    </Badge>
                    {entry.intensity >= 7 && (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
