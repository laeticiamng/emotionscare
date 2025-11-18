
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
    // Mock weather data - in a real app this would come from a weather API
    const mockWeatherData = () => {
      const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'drizzle'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)] as 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'drizzle';
      
      const descriptions = {
        'sunny': 'Ensoleillé',
        'partly-cloudy': 'Partiellement nuageux',
        'cloudy': 'Nuageux',
        'rainy': 'Pluvieux',
        'drizzle': 'Bruine légère'
      };
      
      const suggestions = {
        'sunny': 'Idéal pour une activité extérieure qui élève l\'humeur.',
        'partly-cloudy': 'Bon moment pour une marche contemplative.',
        'cloudy': 'Parfait pour un moment de lecture méditative.',
        'rainy': 'Propice à l\'introspection et à l\'écriture.',
        'drizzle': 'Idéal pour écouter de la musique douce et réfléchir.'
      };
      
      const temperature = Math.floor(Math.random() * 20) + 10; // Random temp between 10-30°C
      
      return {
        temperature,
        description: descriptions[condition],
        condition,
        emotionalSuggestion: suggestions[condition]
      };
    };
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setWeather(mockWeatherData());
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
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
