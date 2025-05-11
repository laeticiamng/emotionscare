import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  Users,
  Calendar,
  Headphones,
  Headset,
  MessageSquare,
  Trophy
} from "lucide-react";

interface FeaturesTourProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

const FeaturesTour: React.FC<FeaturesTourProps> = ({ onContinue, onBack, emotion, onResponse }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <BarChart4 className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Suivi des émotions</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Visualisez l'évolution de vos émotions au fil du temps.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Users className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Communauté</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Partagez vos expériences avec une communauté bienveillante.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Calendar className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Défis personnalisés</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Relevez des défis adaptés à votre état émotionnel.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Headset className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Musique adaptative</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Laissez la musique vous accompagner selon vos émotions.
          </p>
        </CardContent>
      </Card>
      
      <div className="col-span-2 flex justify-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={onContinue}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default FeaturesTour;
