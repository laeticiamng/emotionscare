import { useAuth } from "@/contexts/AuthContext";
import { useFlags } from "@/core/flags";
import { AsyncState, CopyBadge } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Music, 
  Headphones, 
  Zap, 
  Users, 
  Brain,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";

export default function AppHomePage() {
  const { user } = useAuth();
  const flags = useFlags();
  const navigate = useNavigate();

  const modules = [
    // Mesure
    {
      title: "Mesure émotionnelle",
      description: "Scanner votre état du moment",
      icon: Heart,
      path: "/app/scan",
      category: "mesure",
      available: true
    },
    
    // Immersif  
    {
      title: "Respiration VR",
      description: "Immersion apaisante",
      icon: Sparkles,
      path: "/app/vr-breath",
      category: "immersif",
      available: flags.has('FF_VR')
    },
    {
      title: "Galaxie VR", 
      description: "Voyage relaxant",
      icon: Sparkles,
      path: "/app/vr-galaxy",
      category: "immersif",
      available: flags.has('FF_VR')
    },
    
    // Musique
    {
      title: "Musique apaisante",
      description: "Sons personnalisés",
      icon: Music,
      path: "/app/music", 
      category: "musique",
      available: flags.has('FF_PREMIUM_SUNO')
    },
    {
      title: "Mood Mixer",
      description: "Créer votre ambiance",
      icon: Headphones,
      path: "/app/mood-mixer",
      category: "musique", 
      available: flags.has('FF_PREMIUM_SUNO')
    },
    
    // Motivation
    {
      title: "Carte 1-minute",
      description: "Coach personnel",
      icon: Brain,
      path: "/app/coach",
      category: "motivation",
      available: true
    },
    {
      title: "Boss Grit",
      description: "Défi du jour",
      icon: Target,
      path: "/app/boss-grit",
      category: "motivation",
      available: true
    },
    {
      title: "Ambition Arcade",
      description: "Missions d'accomplissement",
      icon: TrendingUp,
      path: "/app/ambition-arcade", 
      category: "motivation",
      available: true
    },
    
    // Résilience
    {
      title: "Flash Glow",
      description: "Apaisement 2 minutes",
      icon: Zap,
      path: "/app/flash-glow",
      category: "resilience",
      available: true
    },
    {
      title: "Bounce Back", 
      description: "Rebondir après difficultés",
      icon: TrendingUp,
      path: "/app/bounce-back",
      category: "resilience",
      available: true
    },
    {
      title: "Respirer",
      description: "Exercices de respiration",
      icon: Heart,
      path: "/app/breath",
      category: "resilience", 
      available: true
    },
    {
      title: "Screen Silk",
      description: "Pause écran réparatrice",
      icon: Sparkles,
      path: "/app/screen-silk",
      category: "resilience",
      available: true
    },
    
    // Social 
    {
      title: "Auras",
      description: "Classement bienveillant",
      icon: Users,
      path: "/app/leaderboard",
      category: "social",
      available: true
    },
    
    // Autres
    {
      title: "Écrire / Dicter", 
      description: "Journal personnel",
      icon: Brain,
      path: "/app/journal",
      category: "other",
      available: true
    },
    {
      title: "Activité",
      description: "Suivi hebdomadaire",
      icon: TrendingUp, 
      path: "/app/activity",
      category: "other",
      available: true
    }
  ];

  const availableModules = modules.filter(m => m.available);
  const categorizedModules = {
    mesure: availableModules.filter(m => m.category === 'mesure'),
    immersif: availableModules.filter(m => m.category === 'immersif'), 
    musique: availableModules.filter(m => m.category === 'musique'),
    motivation: availableModules.filter(m => m.category === 'motivation'),
    resilience: availableModules.filter(m => m.category === 'resilience'),
    social: availableModules.filter(m => m.category === 'social'),
    other: availableModules.filter(m => m.category === 'other')
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue dans votre cocon
          </h1>
          <p className="text-muted-foreground">
            Choisissez votre moment bien-être du jour
          </p>
        </div>

        <AsyncState.Content>
          {/* Grille principale - 6 tuiles comme spécifié */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Tuile Mesure */}
            {categorizedModules.mesure.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.mesure[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <categorizedModules.mesure[0].icon className="h-6 w-6 text-primary" />
                    <CardTitle>Mesure</CardTitle>
                  </div>
                  <CardDescription>Scanner votre état émotionnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="durée" idx={0} />
                </CardContent>
              </Card>
            )}

            {/* Tuile Immersif */}
            {categorizedModules.immersif.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.immersif[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <CardTitle>Immersif</CardTitle>
                  </div>
                  <CardDescription>Expériences VR apaisantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="intensité" idx={1} />
                </CardContent>
              </Card>
            )}

            {/* Tuile Musique */}
            {categorizedModules.musique.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.musique[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Music className="h-6 w-6 text-primary" />
                    <CardTitle>Musique</CardTitle>
                  </div>
                  <CardDescription>Sons personnalisés et ambiances</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="durée" idx={2} />
                </CardContent>
              </Card>
            )}

            {/* Tuile Motivation */}
            {categorizedModules.motivation.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.motivation[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <CardTitle>Motivation</CardTitle>
                  </div>
                  <CardDescription>Coach et défis personnels</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="progression" idx={2} />
                </CardContent>
              </Card>
            )}

            {/* Tuile Résilience */}
            {categorizedModules.resilience.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.resilience[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle>Résilience</CardTitle>
                  </div>
                  <CardDescription>Techniques d'apaisement</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="intensité" idx={2} />
                </CardContent>
              </Card>
            )}

            {/* Tuile Social */}
            {categorizedModules.social.length > 0 && (
              <Card className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(categorizedModules.social[0].path)}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle>Social</CardTitle>
                  </div>
                  <CardDescription>Communauté bienveillante</CardDescription>
                </CardHeader>
                <CardContent>
                  <CopyBadge kind="progression" idx={1} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Accès rapide aux autres modules */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorizedModules.other.map((module) => (
              <Button 
                key={module.path}
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate(module.path)}
              >
                <module.icon className="h-5 w-5" />
                <span className="text-sm">{module.title}</span>
              </Button>
            ))}
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}