import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { 
  Scan, 
  Music, 
  MessageCircle, 
  PenTool, 
  Eye, 
  Star,
  Zap,
  Wind,
  Camera,
  Heart,
  Target,
  Palette,
  Trophy,
  RefreshCw,
  BookOpen,
  Users,
  MessageSquare,
  Medal,
  Activity,
  Monitor
} from "lucide-react";
import { CopyBadge } from "@/components/transverse";

export default function B2CHomePage() {
  const navigate = useNavigate();

  const moduleCategories = [
    {
      title: "Mesure & Analyse",
      description: "Comprendre vos émotions",
      modules: [
        {
          name: "Analyse Émotionnelle",
          description: "Scanner vos émotions en temps réel",
          icon: Scan,
          path: "/app/scan",
          color: "text-blue-500",
          badge: { kind: "intensité", value: 75 }
        }
      ]
    },
    {
      title: "Expériences Immersives", 
      description: "Technologies de pointe",
      modules: [
        {
          name: "Respiration VR",
          description: "Méditation en réalité virtuelle",
          icon: Eye,
          path: "/app/vr-breath",
          color: "text-purple-500",
          badge: { kind: "durée", value: 10 }
        },
        {
          name: "Galaxie VR",
          description: "Exploration spatiale apaisante",
          icon: Star,
          path: "/app/vr-galaxy",
          color: "text-indigo-500",
          badge: { kind: "durée", value: 20 }
        }
      ]
    },
    {
      title: "Audio & Musique",
      description: "Thérapie sonore personnalisée",
      modules: [
        {
          name: "Musique Thérapeutique",
          description: "Compositions IA adaptées",
          icon: Music,
          path: "/app/music",
          color: "text-green-500",
          badge: { kind: "progression", value: 60 }
        },
        {
          name: "Mood Mixer",
          description: "Créer vos ambiances",
          icon: Palette,
          path: "/app/mood-mixer",
          color: "text-pink-500",
          badge: { kind: "intensité", value: 50 }
        }
      ]
    },
    {
      title: "Coaching & Motivation",
      description: "Accompagnement personnalisé",
      modules: [
        {
          name: "Coach IA",
          description: "Assistant personnel intelligent",
          icon: MessageCircle,
          path: "/app/coach",
          color: "text-orange-500",
          badge: { kind: "progression", value: 80 }
        },
        {
          name: "Boss Grit",
          description: "Développer votre résilience",
          icon: Target,
          path: "/app/boss-grit",
          color: "text-red-500",
          badge: { kind: "intensité", value: 85 }
        },
        {
          name: "Ambition Arcade",
          description: "Gamification de vos objectifs",
          icon: Trophy,
          path: "/app/ambition-arcade",
          color: "text-yellow-500",
          badge: { kind: "progression", value: 45 }
        }
      ]
    },
    {
      title: "Bien-être & Résilience",
      description: "Techniques de relaxation",
      modules: [
        {
          name: "Flash Glow",
          description: "Sessions de 2 minutes",
          icon: Zap,
          path: "/app/flash-glow",
          color: "text-cyan-500",
          badge: { kind: "durée", value: 2 }
        },
        {
          name: "Bounce Back",
          description: "Rebondir après les difficultés",
          icon: RefreshCw,
          path: "/app/bounce-back",
          color: "text-teal-500",
          badge: { kind: "progression", value: 70 }
        },
        {
          name: "Exercices Respiration",
          description: "Techniques de breathing",
          icon: Wind,
          path: "/app/breath",
          color: "text-sky-500",
          badge: { kind: "durée", value: 5 }
        },
        {
          name: "Screen Silk",
          description: "Pauses écran intelligentes",
          icon: Monitor,
          path: "/app/screen-silk",
          color: "text-slate-500",
          badge: { kind: "durée", value: 3 }
        }
      ]
    },
    {
      title: "Expression & Social",
      description: "Partage et créativité",
      modules: [
        {
          name: "Journal Privé",
          description: "Écrire ou dicter vos pensées",
          icon: PenTool,
          path: "/app/journal",
          color: "text-violet-500",
          badge: { kind: "progression", value: 90 }
        },
        {
          name: "Filtres AR",
          description: "Réalité augmentée émotionnelle",
          icon: Camera,
          path: "/app/face-ar",
          color: "text-emerald-500",
          badge: { kind: "intensité", value: 40 }
        },
        {
          name: "Story Synth",
          description: "Créer vos histoires",
          icon: BookOpen,
          path: "/app/story-synth",
          color: "text-amber-500",
          badge: { kind: "progression", value: 25 }
        }
      ]
    },
    {
      title: "Capteurs & Gamification",
      description: "Biométrie et récompenses",
      modules: [
        {
          name: "Bubble Beat",
          description: "Synchronisé avec votre cœur",
          icon: Heart,
          path: "/app/bubble-beat",
          color: "text-rose-500",
          badge: { kind: "intensité", value: 65 }
        },
        {
          name: "Classement",
          description: "Auras et achievements",
          icon: Medal,
          path: "/app/leaderboard",
          color: "text-gold-500",
          badge: { kind: "progression", value: 55 }
        },
        {
          name: "Activité",
          description: "Suivi de vos progrès",
          icon: Activity,
          path: "/app/activity",
          color: "text-lime-500",
          badge: { kind: "progression", value: 75 }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Bienvenue dans votre espace de bien-être
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez nos modules innovants pour améliorer votre santé émotionnelle. 
              Chaque outil est conçu pour s'adapter à vos besoins uniques.
            </p>
          </div>

          {/* Module Categories */}
          {moduleCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="text-left">
                <h2 className="text-2xl font-semibold">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={module.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: categoryIndex * 0.1 + moduleIndex * 0.05 
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => navigate(module.path)}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-background border`}>
                              <module.icon className={`h-6 w-6 ${module.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{module.name}</CardTitle>
                            </div>
                          </div>
                          <CopyBadge 
                            kind={module.badge.kind as any} 
                            value={module.badge.value}
                            className="text-xs"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                          {module.description}
                        </CardDescription>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3 w-full justify-center hover:bg-primary/10"
                        >
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Quick Access */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <span>Accès Rapide</span>
              </CardTitle>
              <CardDescription>
                Actions fréquentes et raccourcis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/scan')}
                  className="flex flex-col h-20 space-y-2"
                >
                  <Scan className="h-5 w-5" />
                  <span className="text-xs">Scanner</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/flash-glow')}
                  className="flex flex-col h-20 space-y-2"
                >
                  <Zap className="h-5 w-5" />
                  <span className="text-xs">Flash 2min</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/music')}
                  className="flex flex-col h-20 space-y-2"
                >
                  <Music className="h-5 w-5" />
                  <span className="text-xs">Musique</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/journal')}
                  className="flex flex-col h-20 space-y-2"
                >
                  <PenTool className="h-5 w-5" />
                  <span className="text-xs">Journal</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}