import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrivacyToggle } from '@/components/privacy/PrivacyToggle';
import { Camera, Mic, Heart, MapPin, Users, Palette } from 'lucide-react';

interface StepSensorsProps {
  onNext: () => void;
  onBack: () => void;
}

const sensorInfo = [
  {
    key: 'cam' as const,
    icon: Camera,
    title: 'Caméra',
    description: 'Pour les filtres émotions et analyses faciales'
  },
  {
    key: 'mic' as const,
    icon: Mic,
    title: 'Microphone',
    description: 'Pour l\'analyse vocale et la musicothérapie'
  },
  {
    key: 'hr' as const,
    icon: Heart,
    title: 'Fréquence cardiaque',
    description: 'Pour la cohérence cardiaque et le suivi wellness'
  },
  {
    key: 'gps' as const,
    icon: MapPin,
    title: 'Géolocalisation',
    description: 'Pour des conseils adaptés à ton environnement'
  },
  {
    key: 'social' as const,
    icon: Users,
    title: 'Partage social',
    description: 'Pour partager tes progrès avec tes proches'
  },
  {
    key: 'nft' as const,
    icon: Palette,
    title: 'NFT & collectibles',
    description: 'Pour collecter des œuvres d\'art personnalisées'
  }
];

export const StepSensors: React.FC<StepSensorsProps> = ({ onNext, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Capteurs & confidentialité</h2>
        <p className="text-muted-foreground">
          Active seulement ce dont tu as besoin. Tu peux changer ces réglages à tout moment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            Tes données, ton contrôle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrivacyToggle />
          
          <div className="text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip :</strong> Aucune permission ne sera demandée tant que tu n'actives pas un capteur.
              Tout reste sous ton contrôle.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={onNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
};