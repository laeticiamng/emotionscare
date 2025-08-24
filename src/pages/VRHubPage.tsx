import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VirtualReality, Mountain, Waves, TreePine, Smartphone, Headphones, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VRHubPage: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();

  const vrExperiences = [
    {
      id: 'meditation',
      name: 'Méditation Cosmique',
      description: 'Voyage méditatif dans l\'espace',
      duration: '15-30 min',
      difficulty: 'Débutant',
      category: 'relaxation',
      benefits: ['Réduction du stress', 'Clarté mentale', 'Relaxation profonde'],
      preview: 'from-purple-600 to-blue-600'
    },
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      description: 'Immersion dans une forêt magique apaisante',
      duration: '20-45 min',
      difficulty: 'Tous niveaux',
      category: 'nature',
      benefits: ['Connexion nature', 'Apaisement', 'Ressourcement'],
      preview: 'from-green-600 to-teal-600'
    },
    {
      id: 'ocean',
      name: 'Profondeurs Marines',
      description: 'Exploration sous-marine relaxante',
      duration: '10-25 min',
      difficulty: 'Débutant',
      category: 'aquatic',
      benefits: ['Calme intérieur', 'Réduction anxiété', 'Focus'],
      preview: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'mountain',
      name: 'Sommet Zen',
      description: 'Méditation au sommet des montagnes',
      duration: '25-40 min',
      difficulty: 'Intermédiaire',
      category: 'altitude',
      benefits: ['Perspective', 'Confiance', 'Sérénité'],
      preview: 'from-gray-600 to-slate-600'
    },
    {
      id: 'therapy',
      name: 'Thérapie Guidée',
      description: 'Session thérapeutique avec coach virtuel',
      duration: '30-60 min',
      difficulty: 'Avancé',
      category: 'therapy',
      benefits: ['Gestion émotions', 'Développement personnel', 'Guérison'],
      preview: 'from-pink-600 to-rose-600'
    },
    {
      id: 'stress',
      name: 'Anti-Stress Express',
      description: 'Techniques rapides de gestion du stress',
      duration: '5-15 min',
      difficulty: 'Tous niveaux',
      category: 'wellness',
      benefits: ['Stress relief', 'Énergie positive', 'Équilibre'],
      preview: 'from-orange-600 to-red-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes', icon: VirtualReality },
    { id: 'relaxation', name: 'Relaxation', icon: Waves },
    { id: 'nature', name: 'Nature', icon: TreePine },
    { id: 'therapy', name: 'Thérapie', icon: Headphones },
    { id: 'wellness', name: 'Bien-être', icon: Mountain }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredExperiences = activeCategory === 'all' 
    ? vrExperiences 
    : vrExperiences.filter(exp => exp.category === activeCategory);

  const launchExperience = async (experienceId: string) => {
    setSelectedExperience(experienceId);
    setIsLaunching(true);
    
    // Simulation du lancement VR
    setTimeout(() => {
      setIsLaunching(false);
      toast({
        title: "Expérience VR lancée",
        description: "Mettez votre casque VR pour commencer l'expérience",
      });
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-700';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-700';
      case 'Avancé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <VirtualReality className="h-8 w-8" />
            Hub Réalité Virtuelle
          </h1>
          <p className="text-muted-foreground">
            Expériences immersives thérapeutiques pour votre bien-être émotionnel
          </p>
        </div>

        {/* Statut VR */}
        <Card className="mb-6 border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Casque VR détecté</p>
                  <p className="text-sm text-muted-foreground">
                    Oculus Quest 2 connecté et prêt
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                En ligne
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filtres par catégorie */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Expériences VR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <Card 
              key={experience.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedExperience === experience.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedExperience(experience.id)}
            >
              <CardHeader className="pb-3">
                {/* Preview visuel */}
                <div className={`h-32 rounded-lg bg-gradient-to-br ${experience.preview} flex items-center justify-center mb-3`}>
                  <VirtualReality className="h-12 w-12 text-white/80" />
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{experience.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {experience.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Métadonnées */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durée: {experience.duration}</span>
                  <Badge className={getDifficultyColor(experience.difficulty)}>
                    {experience.difficulty}
                  </Badge>
                </div>

                {/* Bénéfices */}
                <div>
                  <p className="text-sm font-medium mb-2">Bénéfices:</p>
                  <div className="flex flex-wrap gap-1">
                    {experience.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bouton de lancement */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    launchExperience(experience.id);
                  }}
                  disabled={isLaunching && selectedExperience === experience.id}
                  className="w-full"
                >
                  {isLaunching && selectedExperience === experience.id ? (
                    <>Lancement...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Lancer l'expérience
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compatibilité et exigences */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Compatibilité & Exigences</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="headsets" className="space-y-4">
              <TabsList>
                <TabsTrigger value="headsets">Casques VR</TabsTrigger>
                <TabsTrigger value="mobile">VR Mobile</TabsTrigger>
                <TabsTrigger value="requirements">Exigences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="headsets" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Oculus Quest 2/3', 'HTC Vive', 'Valve Index',
                    'PlayStation VR', 'Oculus Rift S', 'Pico 4'
                  ].map((headset) => (
                    <div key={headset} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{headset}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="mobile" className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">VR Mobile disponible</p>
                    <p className="text-sm text-muted-foreground">
                      Utilisez votre smartphone avec un casque VR cardboard
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Connexion Internet:</span>
                    <span className="font-medium">Haut débit recommandé</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espace requis:</span>
                    <span className="font-medium">2m x 2m minimum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée de batterie:</span>
                    <span className="font-medium">2-3 heures d'autonomie</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default VRHubPage;