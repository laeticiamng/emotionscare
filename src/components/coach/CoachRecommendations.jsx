
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define proper TypeScript props interface
interface CoachRecommendationsProps {
  emotion?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const CoachRecommendations = ({ emotion, collapsed, onToggle }) => {
  // Sample recommendations based on emotion
  const getRecommendations = () => {
    switch (emotion) {
      case 'joie':
        return [
          'Profitez de cette énergie positive pour aborder un projet créatif',
          'Partagez ce sentiment avec un proche',
          'Notez dans votre journal ce qui a contribué à cette joie'
        ];
      case 'stress':
        return [
          'Prenez 5 minutes pour pratiquer une respiration profonde',
          'Faites une courte promenade à l\'extérieur si possible',
          'Écoutez un morceau de musique relaxante'
        ];
      case 'fatigue':
        return [
          'Accordez-vous une micro-pause de 10 minutes',
          'Hydratez-vous et prenez une collation nutritive',
          'Ajustez votre prochaine tâche pour qu\'elle soit moins exigeante'
        ];
      default:
        return [
          'Prenez un moment pour respirer profondément',
          'Notez vos pensées dans votre journal',
          'Explorez une musique adaptée à votre humeur actuelle'
        ];
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recommandations du Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {getRecommendations().map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
