
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  Users,
  Calendar,
  Headset,
  Shield,
  Lock
} from "lucide-react";
import FeatureCard from '@/components/onboarding/FeatureCard';

interface FeaturesTourProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

// Enhanced features data with privacy and security highlights
const features = [
  {
    icon: BarChart4,
    title: "Suivi des émotions",
    description: "Visualisez l'évolution de vos émotions au fil du temps.",
    tooltip: "Vos données émotionnelles sont anonymisées et chiffrées avec AES-256."
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Partagez vos expériences avec une communauté bienveillante.",
    badge: "RGPD",
    tooltip: "Contrôlez exactement ce que vous partagez et avec qui."
  },
  {
    icon: Calendar,
    title: "Défis personnalisés",
    description: "Relevez des défis adaptés à votre état émotionnel.",
  },
  {
    icon: Headset,
    title: "Musique adaptative",
    description: "Laissez la musique vous accompagner selon vos émotions."
  },
  {
    icon: Shield,
    title: "Confidentialité avancée",
    description: "Contrôle total sur vos données personnelles.",
    badge: "Premium",
    tooltip: "Chiffrement AES-256-GCM et TLS 1.3 avec gestion avancée des clés cryptographiques."
  },
  {
    icon: Lock,
    title: "Éthique et transparence",
    description: "Comprenez comment nous utilisons vos données.",
    tooltip: "Recevez des rapports automatisés sur l'utilisation de vos données."
  }
];

const FeaturesTour: React.FC<FeaturesTourProps> = ({ 
  onContinue, 
  onBack, 
  emotion, 
  onResponse 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Votre bien-être, notre priorité</h2>
        <p className="text-sm text-blue-600">
          EmotionsCare s'engage à protéger vos données avec les plus hauts standards de sécurité et d'éthique, tout en vous offrant une expérience émotionnelle exceptionnelle.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            badge={feature.badge}
            tooltip={feature.tooltip}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
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
