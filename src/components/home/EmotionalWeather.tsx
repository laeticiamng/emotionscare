// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const EmotionalWeather: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({
    temperature: 0,
    description: '',
    condition: '' as 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'drizzle',
    emotionalSuggestion: ''
  });

  useEffect(() => {
    const loadEmotionalWeather = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        // Get user's recent emotional state to calculate "emotional weather"
        if (user) {
          const { data: scansData } = await supabase
            .from('emotion_scans')
            .select('valence, emotion, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(7);

          if (scansData && scansData.length > 0) {
            // Calculate average valence to determine emotional weather
            const avgValence = scansData.reduce((sum, s) => sum + (s.valence || 50), 0) / scansData.length;

            let condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'drizzle';
            if (avgValence >= 70) condition = 'sunny';
            else if (avgValence >= 55) condition = 'partly-cloudy';
            else if (avgValence >= 40) condition = 'cloudy';
            else if (avgValence >= 25) condition = 'drizzle';
            else condition = 'rainy';

            const descriptions = {
              'sunny': 'Ensoleillé - Vous rayonnez !',
              'partly-cloudy': 'Partiellement nuageux',
              'cloudy': 'Nuageux - Temps de réflexion',
              'rainy': 'Pluvieux - Période à traverser',
              'drizzle': 'Bruine légère - Légère mélancolie'
            };

            const suggestions = {
              'sunny': 'Votre énergie est au top ! Parfait pour partager votre bonne humeur.',
              'partly-cloudy': 'Un bon équilibre émotionnel. Continuez ainsi !',
              'cloudy': 'Parfait pour un moment de lecture méditative ou de musique calme.',
              'rainy': 'Prenez soin de vous. Une session de respiration pourrait aider.',
              'drizzle': 'Idéal pour écouter de la musique douce et tenir votre journal.'
            };

            setWeather({
              temperature: Math.round(avgValence),
              description: descriptions[condition],
              condition,
              emotionalSuggestion: suggestions[condition]
            });
            setLoading(false);
            return;
          }
        }

        // Fallback if no data
        setWeather({
          temperature: 50,
          description: 'Partiellement nuageux',
          condition: 'partly-cloudy',
          emotionalSuggestion: 'Faites un scan émotionnel pour découvrir votre météo intérieure.'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading emotional weather:', error);
        setWeather({
          temperature: 50,
          description: 'Partiellement nuageux',
          condition: 'partly-cloudy',
          emotionalSuggestion: 'Commencez votre journée avec un scan émotionnel.'
        });
        setLoading(false);
      }
    };

    loadEmotionalWeather();
  }, []);

  // Render the appropriate weather icon
  const renderWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly-cloudy':
        return <CloudSun className="h-8 w-8 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'drizzle':
        return <CloudDrizzle className="h-8 w-8 text-blue-300" />;
      default:
        return <CloudSun className="h-8 w-8 text-blue-400" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-primary" />
          Météo émotionnelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse h-24 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              {renderWeatherIcon()}
              <div className="ml-3">
                <div className="text-xl font-semibold flex items-center">
                  {weather.temperature}°C
                  <Thermometer className="h-4 w-4 ml-1 text-red-400" />
                </div>
                <div className="text-muted-foreground">{weather.description}</div>
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-1">Suggestion du jour</h4>
              <p className="text-sm text-muted-foreground">{weather.emotionalSuggestion}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionalWeather;
