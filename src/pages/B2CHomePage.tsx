import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
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
import { withLandingUtm } from "@/lib/utm";

/**
 * B2C HOME PAGE - EMOTIONSCARE  
 * Page d'accueil B2C accessible WCAG 2.1 AA
 */
export default function B2CHomePage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const goTo = (path: string) => navigate(withLandingUtm(path));

  const moduleCategories = useMemo(() => [
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
  ], []);

  const getFadeInProps = (delay = 0, duration = 0.5) =>
    shouldReduceMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration, delay } };

  const getScaleInProps = (delay = 0, duration = 0.3) =>
    shouldReduceMotion
      ? { initial: { opacity: 1, scale: 1 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration, delay } };

  const hoverEffect = shouldReduceMotion ? undefined : { scale: 1.02 };

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={1}
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-access" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller à l'accès rapide
      </a>

      <Header />
      
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <motion.div {...getFadeInProps()} className="space-y-8">
          {/* Welcome Section */}
          <header className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Bienvenue dans votre espace de bien-être
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez nos modules innovants pour améliorer votre santé émotionnelle. 
              Chaque outil est conçu pour s'adapter à vos besoins uniques.
            </p>
          </header>

          {/* Module Categories */}
          {moduleCategories.map((category, categoryIndex) => (
            <motion.section
              key={category.title}
              {...getFadeInProps(categoryIndex * 0.1)}
              className="space-y-4"
              aria-labelledby={`category-${categoryIndex}`}
            >
              <header className="text-left">
                <h2 id={`category-${categoryIndex}`} className="text-2xl font-semibold">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={module.name}
                    {...getScaleInProps(categoryIndex * 0.1 + moduleIndex * 0.05)}
                    whileHover={hoverEffect}
                    className="cursor-pointer"
                    onClick={() => goTo(module.path)}
                  >
                    <Card
                      className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary"
                      tabIndex={0}
                      role="button"
                      aria-describedby={`module-desc-${categoryIndex}-${moduleIndex}`}
                    >
                       <CardHeader className="pb-3">
                         <div className="flex items-start justify-between">
                           <div className="flex items-center space-x-3">
                             <div className={`p-2 rounded-lg bg-background border`} aria-hidden="true">
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
                         <CardDescription
                           id={`module-desc-${categoryIndex}-${moduleIndex}`}
                           className="text-sm leading-relaxed"
                         >
                           {module.description}
                         </CardDescription>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="mt-3 w-full justify-center hover:bg-primary/10"
                           aria-label={`Commencer ${module.name}: ${module.description}`}
                         >
                           Commencer
                         </Button>
                       </CardContent>
                     </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}

          {/* Quick Access */}
          <Card 
            id="quick-access" 
            className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
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
                  onClick={() => goTo('/app/scan')}
                  className="flex flex-col h-20 space-y-2"
                  aria-label="Scanner mes émotions - Analyse faciale en temps réel"
                >
                  <Scan className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs">Scanner</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goTo('/app/flash-glow')}
                  className="flex flex-col h-20 space-y-2"
                  aria-label="Flash Glow - Session de thérapie lumière de 2 minutes"
                >
                  <Zap className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs">Flash 2min</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goTo('/app/music')}
                  className="flex flex-col h-20 space-y-2"
                  aria-label="Musique thérapeutique - Sons adaptatifs personnalisés"
                >
                  <Music className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs">Musique</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goTo('/app/journal')}
                  className="flex flex-col h-20 space-y-2"
                  aria-label="Journal émotionnel - Consignez vos ressentis"
                >
                  <PenTool className="h-5 w-5" aria-hidden="true" />
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