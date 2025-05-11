
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  Users,
  Calendar,
  Headset
} from "lucide-react";
import FeatureCard from '@/components/onboarding/FeatureCard';

interface FeaturesTourProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

// Define features data
const features = [
  {
    icon: BarChart4,
    title: "Suivi des émotions",
    description: "Visualisez l'évolution de vos émotions au fil du temps."
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Partagez vos expériences avec une communauté bienveillante."
  },
  {
    icon: Calendar,
    title: "Défis personnalisés",
    description: "Relevez des défis adaptés à votre état émotionnel."
  },
  {
    icon: Headset,
    title: "Musique adaptative",
    description: "Laissez la musique vous accompagner selon vos émotions."
  }
];

const FeaturesTour: React.FC<FeaturesTourProps> = ({ 
  onContinue, 
  onBack, 
  emotion, 
  onResponse 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
      
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
