import React, { useState } from 'react';
import { UnifiedPageLayout as PageLayout } from '@/components/ui/unified-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, MessageCircle, Brain, Zap, VolumeX, 
  BookOpen, Puzzle, Settings, Play, Eye, 
  TrendingUp, Target, Heart, Circle, Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import des modules
import { MusicModule } from '@/components/modules/MusicModule';
import { SupportModule } from '@/components/modules/SupportModule';
import { PredictiveAnalyticsModule } from '@/components/modules/PredictiveAnalyticsModule';
import { OptimizationModule } from '@/components/modules/OptimizationModule';
import { ScanModule } from '@/components/modules/ScanModule';
import { JournalModule } from '@/components/modules/JournalModule';
import { MoodMixerModule } from '@/components/modules/MoodMixerModule';
import { RespirationModule } from '@/components/modules/RespirationModule';
import { FlashGlowModule } from '@/components/modules/FlashGlowModule';
import { BossGritModule } from '@/components/modules/BossGritModule';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'inactive' | 'beta';
  category: 'core' | 'ai' | 'enhancement';
  component: React.ComponentType;
}

const modules: Module[] = [
  // Core modules
  {
    id: 'scan',
    name: 'Scan Émotionnel',
    description: 'Analyse multi-modale de vos émotions en temps réel (texte, voix, facial)',
    icon: Eye,
    status: 'active',
    category: 'core',
    component: ScanModule
  },
  {
    id: 'journal',
    name: 'Journal Émotionnel',
    description: 'Documentez vos émotions et suivez votre évolution personnelle',
    icon: BookOpen,
    status: 'active',
    category: 'core',
    component: JournalModule
  },
  {
    id: 'music',
    name: 'Module Musical',
    description: 'Génération et recommandation de musique thérapeutique adaptée aux émotions',
    icon: Music,
    status: 'active',
    category: 'core',
    component: MusicModule
  },
  {
    id: 'respiration',
    name: 'Respiration Guidée',
    description: 'Exercices de respiration pour gérer le stress et améliorer votre bien-être',
    icon: Play,
    status: 'active',
    category: 'core',
    component: RespirationModule
  },

  // AI-powered modules
  {
    id: 'analytics',
    name: 'Analytics Prédictives',
    description: 'Intelligence artificielle prédictive pour anticiper les besoins émotionnels',
    icon: Brain,
    status: 'beta',
    category: 'ai',
    component: PredictiveAnalyticsModule
  },
  {
    id: 'support',
    name: 'Support & Assistance',
    description: 'Assistant IA pour le support utilisateur et les questions fréquentes',
    icon: MessageCircle,
    status: 'active',
    category: 'ai',
    component: SupportModule
  },

  // Enhancement modules
  {
    id: 'mood-mixer',
    name: 'Mood Mixer',
    description: 'Mélangez et ajustez vos émotions pour créer l\'état d\'esprit parfait',
    icon: Puzzle,
    status: 'active',
    category: 'enhancement',
    component: MoodMixerModule
  },
  {
    id: 'flash-glow',
    name: 'Flash Glow',
    description: 'Thérapie par la lumière pour stimuler votre bien-être émotionnel',
    icon: Zap,
    status: 'active',
    category: 'enhancement',
    component: FlashGlowModule
  },
  {
    id: 'boss-grit',
    name: 'Boss Grit',
    description: 'Développez votre mental de leader avec des défis progressifs',
    icon: Settings,
    status: 'beta',
    category: 'enhancement',
    component: BossGritModule
  },
  {
    id: 'optimization',
    name: 'Optimisation Performance',
    description: 'Surveillance et optimisation en temps réel de l\'application',
    icon: TrendingUp,
    status: 'active',
    category: 'enhancement',
    component: OptimizationModule
  },

  // In development
  {
    id: 'nyvee',
    name: 'Nyvée',
    description: 'Module de visualisation avancée et d\'immersion sensorielle',
    icon: Eye,
    status: 'inactive',
    category: 'enhancement',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'ar',
    name: 'Réalité Augmentée',
    description: 'Expériences immersives en réalité augmentée pour le bien-être',
    icon: VolumeX,
    status: 'inactive',
    category: 'enhancement',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'ambition',
    name: 'Ambition Tracker',
    description: 'Suivi et optimisation de vos objectifs à long terme',
    icon: Target,
    status: 'inactive',
    category: 'ai',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'bounce-back',
    name: 'Bounce Back',
    description: 'Techniques de résilience et de récupération émotionnelle',
    icon: Heart,
    status: 'inactive',
    category: 'core',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'story-synth',
    name: 'Story Synth',
    description: 'Génération d\'histoires personnalisées basées sur vos émotions',
    icon: BookOpen,
    status: 'inactive',
    category: 'ai',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'activity',
    name: 'Activité Adaptative',
    description: 'Recommandations d\'activités basées sur votre état émotionnel',
    icon: Target,
    status: 'inactive',
    category: 'ai',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'auras',
    name: 'Auras',
    description: 'Visualisation et harmonisation de votre énergie personnelle',
    icon: Circle,
    status: 'inactive',
    category: 'enhancement',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  },
  {
    id: 'screen-silk',
    name: 'Screen Silk',
    description: 'Interface adaptive qui s\'ajuste à votre état émotionnel',
    icon: Monitor,
    status: 'inactive',
    category: 'enhancement',
    component: () => <div className="p-8 text-center text-muted-foreground">Module en développement</div>
  }
];

export const ModulesPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview');

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Module['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'enhancement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeModules = modules.filter(m => m.status === 'active');
  const betaModules = modules.filter(m => m.status === 'beta');
  const inactiveModules = modules.filter(m => m.status === 'inactive');

  const selectedModuleData = selectedModule ? modules.find(m => m.id === selectedModule) : null;

  if (selectedModule && selectedModuleData) {
    const ModuleComponent = selectedModuleData.component;
    return (
      <PageLayout
        title={selectedModuleData.name}
        description={selectedModuleData.description}
        breadcrumbs={[
          { label: 'Modules', href: '/modules' },
          { label: selectedModuleData.name }
        ]}
        actions={
          <Button 
            variant="outline" 
            onClick={() => setSelectedModule(null)}
          >
            Retour aux modules
          </Button>
        }
      >
        <ModuleComponent />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Modules EmotionsCare"
      description="Découvrez et gérez tous les modules disponibles pour enrichir votre expérience"
    >
      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{modules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold">{activeModules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Beta</p>
                  <p className="text-2xl font-bold">{betaModules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Puzzle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">En développement</p>
                  <p className="text-2xl font-bold">{inactiveModules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous les modules</TabsTrigger>
            <TabsTrigger value="active">Actifs ({activeModules.length})</TabsTrigger>
            <TabsTrigger value="beta">Beta ({betaModules.length})</TabsTrigger>
            <TabsTrigger value="development">En développement ({inactiveModules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={setSelectedModule}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={setSelectedModule}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beta" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {betaModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={setSelectedModule}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="development" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={setSelectedModule}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const ModuleCard: React.FC<{
  module: Module;
  onSelect: (id: string) => void;
  getStatusColor: (status: Module['status']) => string;
  getCategoryColor: (category: Module['category']) => string;
}> = ({ module, onSelect, getStatusColor, getCategoryColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-primary/10">
              <module.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex gap-1">
              <Badge className={`text-xs ${getStatusColor(module.status)}`}>
                {module.status}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getCategoryColor(module.category)}`}>
                {module.category}
              </Badge>
            </div>
          </div>
          <div>
            <CardTitle className="text-lg">{module.name}</CardTitle>
            <CardDescription className="mt-2">
              {module.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col justify-end">
          <Button
            onClick={() => onSelect(module.id)}
            disabled={module.status === 'inactive'}
            className="w-full"
            variant={module.status === 'active' ? 'default' : 'outline'}
          >
            {module.status === 'inactive' ? 'Bientôt disponible' : 'Ouvrir le module'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModulesPage;