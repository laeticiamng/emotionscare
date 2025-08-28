
import React, { useEffect } from 'react';
import { PageRoot } from '@/components/common/PageRoot';
import { useMoodSession } from '@/hooks/useMoodSession';
import MoodCards from '@/components/mood/MoodCards';
import MoodGlass from '@/components/mood/MoodGlass';
import MusicPlayer from '@/components/mood/MusicPlayer';
import MicroPrompts from '@/components/mood/MicroPrompts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

const MoodMixerPage: React.FC = () => {
  const [energy, setEnergy] = useState([50]);
  const [emotion, setEmotion] = useState([50]);
  const [focus, setFocus] = useState([50]);

  const getMixName = () => {
    const e = energy[0];
    const em = emotion[0];
    const f = focus[0];

    if (e > 80 && em > 70) return 'Explosion de Joie';
    if (e < 30 && em > 70) return 'Calme Béatitude';
    if (f > 80 && e > 60) return 'Productivité Maximale';
    if (em < 30 && e < 30) return 'Reset Complet';
    return 'Équilibre Personnel';
  };

  const moods = [
    {
      title: 'Énergie Pure',
      description: 'Musique dynamique et motivante pour booster votre énergie',
      icon: <Zap className="h-8 w-8" />,
      gradient: 'from-red-500 to-orange-500',
      action: () => {
        setEnergy([90]);
        setEmotion([80]);
        setFocus([60]);
      }
    },
    {
      title: 'Zen Profond',
      description: 'Sons apaisants pour la relaxation et la méditation',
      icon: <Heart className="h-8 w-8" />,
      gradient: 'from-blue-500 to-purple-500',
      action: () => {
        setEnergy([20]);
        setEmotion([90]);
        setFocus([40]);
      }
    },
    {
      title: 'Focus Laser',
      description: 'Ambiances de concentration pour le travail intense',
      icon: <Headphones className="h-8 w-8" />,
      gradient: 'from-green-500 to-teal-500',
      action: () => {
        setEnergy([60]);
        setEmotion([50]);
        setFocus([95]);
      }
    },
    {
      title: 'Créativité Flow',
      description: 'Musique inspirante pour libérer votre créativité',
      icon: <Music className="h-8 w-8" />,
      gradient: 'from-purple-500 to-pink-500',
      action: () => {
        setEnergy([70]);
        setEmotion([80]);
        setFocus([75]);
      }
    }
  ];

  return (
    <PageLayout
      header={{
        title: 'Mood Mixer',
        subtitle: 'Créez votre ambiance sonore parfaite',
        description: 'Ajustez vos paramètres émotionnels pour générer une playlist personnalisée qui correspond exactement à votre état d\'esprit et vos objectifs.',
        icon: Palette,
        gradient: 'from-purple-500/20 to-pink-500/5',
        badge: 'IA Musicale',
        stats: [
          {
            label: 'Mix Créés',
            value: '24',
            icon: Music,
            color: 'text-blue-500'
          },
          {
            label: 'Satisfaction',
            value: '89%',
            icon: Heart,
            color: 'text-purple-500'
          },
          {
            label: 'Temps Total',
            value: '2h47',
            icon: Timer,
            color: 'text-green-500'
          },
          {
            label: 'Amélioration',
            value: '+15%',
            icon: TrendingUp,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: 'Nouveau Mix',
            onClick: () => console.log('Create new mix'),
            variant: 'default',
            icon: Palette
          },
          {
            label: 'Mes Favoris',
            onClick: () => console.log('Show favorites'),
            variant: 'outline',
            icon: Heart
          }
        ]
      }}
      tips={{
        title: 'Optimisez votre expérience Mood Mixer',
        items: [
          {
            title: 'Expérimentez',
            content: 'N\'hésitez pas à tester différentes combinaisons pour découvrir de nouveaux styles',
            icon: Shuffle
          },
          {
            title: 'Sauvegardez',
            content: 'Enregistrez vos mix favoris pour les retrouver facilement',
            icon: Heart
          },
          {
            title: 'Contexte',
            content: 'Adaptez vos réglages selon l\'activité : travail, sport, relaxation...',
            icon: BarChart3
          }
        ],
        cta: {
          label: 'Guide du Mood Mixer',
          onClick: () => console.log('Mood mixer guide')
        }
      }}
    >
      <div className="space-y-8">
        {/* Contrôleur de Mix Principal */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Mix Actuel: <span className="text-primary">{getMixName()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Slider Énergie */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  Énergie
                </label>
                <span className="text-sm text-muted-foreground">{energy[0]}%</span>
              </div>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-30"></div>
            </div>

            {/* Slider Émotion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Émotion
                </label>
                <span className="text-sm text-muted-foreground">{emotion[0]}%</span>
              </div>
              <Slider
                value={emotion}
                onValueChange={setEmotion}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"></div>
            </div>

            {/* Slider Focus */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-green-500" />
                  Focus
                </label>
                <span className="text-sm text-muted-foreground">{focus[0]}%</span>
              </div>
              <Slider
                value={focus}
                onValueChange={setFocus}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500 opacity-30"></div>
            </div>

            {/* Contrôles de Lecture */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
              >
                <Play className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 w-16 rounded-full"
              >
                <Shuffle className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Presets d'Ambiance */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Ambiances Prédéfinies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moods.map((mood, index) => (
              <FeatureCard
                key={index}
                title={mood.title}
                description={mood.description}
                icon={mood.icon}
                gradient={mood.gradient}
                action={{
                  label: 'Appliquer',
                  onClick: mood.action
                }}
                className="hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MoodMixerPage;
