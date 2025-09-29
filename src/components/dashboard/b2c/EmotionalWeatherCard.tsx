
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionalWeatherCardProps {
  className?: string;
}

const EmotionalWeatherCard: React.FC<EmotionalWeatherCardProps> = ({ className = '' }) => {
  // Simuler l'état émotionnel actuel (ceci serait normalement récupéré depuis une API)
  const currentMood = {
    main: 'Calme',
    description: 'Vous semblez détendu aujourd\'hui',
    icon: 'cloud-sun',
    color: 'text-blue-500'
  };

  const renderIcon = () => {
    switch (currentMood.icon) {
      case 'sun':
        return <Sun className="h-16 w-16 text-yellow-500" />;
      case 'cloud':
        return <Cloud className="h-16 w-16 text-gray-500" />;
      case 'cloud-rain':
        return <CloudRain className="h-16 w-16 text-blue-700" />;
      case 'cloud-sun':
      default:
        return <CloudSun className="h-16 w-16 text-blue-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Votre météo émotionnelle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {renderIcon()}
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">{currentMood.main}</h3>
          <p className="text-muted-foreground">{currentMood.description}</p>
          
          <div className="grid grid-cols-4 gap-2 mt-6 w-full">
            {['Hier', 'Aujourd\'hui', 'Demain', 'Après-demain'].map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-1">{day}</span>
                <div className="bg-muted p-2 rounded-full">
                  {index === 0 && <Cloud className="h-5 w-5 text-gray-500" />}
                  {index === 1 && <CloudSun className="h-5 w-5 text-blue-500" />}
                  {index === 2 && <Sun className="h-5 w-5 text-yellow-500" />}
                  {index === 3 && <Sun className="h-5 w-5 text-yellow-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalWeatherCard;
