
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  LineChart, 
  Brain, 
  Music, 
  HeadphonesIcon, 
  Headset, 
  MessageSquare, 
  BookOpenText,
  Activity
} from 'lucide-react';

interface FeaturesTourProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

const FeaturesTour: React.FC<FeaturesTourProps> = ({ 
  onContinue, 
  onBack,
  emotion,
  onResponse
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const handleFeatureSelect = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const handleContinue = () => {
    onResponse('selected_features', selectedFeatures);
    onResponse('feature_tour_completed', true);
    onContinue();
  };
  
  // Adapt content based on emotional state
  const getEmotionBasedContent = () => {
    switch (emotion) {
      case 'joy':
      case 'energetic':
        return {
          title: "Découvrez toutes nos fonctionnalités !",
          subtitle: "Explorez l'éventail de possibilités qui s'offrent à vous.",
          buttonText: "Explorer davantage"
        };
      case 'calm':
      case 'focus':
        return {
          title: "Voici nos fonctionnalités essentielles",
          subtitle: "Prenez le temps de découvrir les outils qui vous aideront au quotidien.",
          buttonText: "Continuer sereinement"
        };
      case 'sad':
      case 'anxiety':
      case 'stress':
        return {
          title: "Des outils pour vous accompagner",
          subtitle: "Découvrez les fonctionnalités qui peuvent vous aider à améliorer votre bien-être.",
          buttonText: "Avancer ensemble"
        };
      default:
        return {
          title: "Découvrez nos fonctionnalités",
          subtitle: "Explorez les outils qui composent EmotionsCare.",
          buttonText: "Continuer"
        };
    }
  };
  
  const content = getEmotionBasedContent();
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {content.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {content.subtitle}
        </p>
      </motion.div>
      
      <Tabs defaultValue="wellness" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="wellness">Bien-être</TabsTrigger>
          <TabsTrigger value="tools">Outils</TabsTrigger>
          <TabsTrigger value="community">Communauté</TabsTrigger>
          <TabsTrigger value="immersive">Immersion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wellness" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              title="Journal émotionnel" 
              description="Suivez et analysez vos émotions au quotidien pour mieux vous comprendre."
              icon={BookOpenText}
              id="journal"
              selected={selectedFeatures.includes('journal')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Coach IA" 
              description="Recevez des conseils personnalisés basés sur votre profil émotionnel."
              icon={Brain}
              id="coach"
              selected={selectedFeatures.includes('coach')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Suivi de progression" 
              description="Visualisez l'évolution de votre bien-être émotionnel au fil du temps."
              icon={Activity}
              id="tracker"
              selected={selectedFeatures.includes('tracker')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Tableau de bord" 
              description="Un aperçu complet de votre état émotionnel et des recommandations."
              icon={LineChart}
              id="dashboard"
              selected={selectedFeatures.includes('dashboard')}
              onSelect={handleFeatureSelect}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              title="Scan émotionnel" 
              description="Analysez rapidement votre état émotionnel à tout moment."
              icon={Activity}
              id="scan"
              selected={selectedFeatures.includes('scan')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Musique adaptative" 
              description="Écoutez des playlists générées selon votre état émotionnel actuel."
              icon={Music}
              id="music"
              selected={selectedFeatures.includes('music')}
              onSelect={handleFeatureSelect}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              title="Buddy émotionnel" 
              description="Connectez-vous avec un partenaire de soutien émotionnel."
              icon={MessageSquare}
              id="buddy"
              selected={selectedFeatures.includes('buddy')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Équipe" 
              description="Suivez le bien-être de votre équipe et favorisez un environnement positif."
              icon={MessageSquare}
              id="team"
              selected={selectedFeatures.includes('team')}
              onSelect={handleFeatureSelect}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="immersive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              title="Sessions VR" 
              description="Immergez-vous dans des expériences de réalité virtuelle apaisantes."
              icon={Headset}
              id="vr"
              selected={selectedFeatures.includes('vr')}
              onSelect={handleFeatureSelect}
            />
            <FeatureCard 
              title="Audio immersif" 
              description="Profitez de sessions audio pour la méditation et la relaxation."
              icon={HeadphonesIcon}
              id="audio"
              selected={selectedFeatures.includes('audio')}
              onSelect={handleFeatureSelect}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button onClick={handleContinue}>
          {content.buttonText} ({selectedFeatures.length} fonctionnalités sélectionnées)
        </Button>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  id,
  selected,
  onSelect
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect(id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end mt-4">
          <Button variant={selected ? "default" : "outline"} size="sm">
            {selected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesTour;
