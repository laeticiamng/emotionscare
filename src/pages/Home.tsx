
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  FileText, 
  Headphones, 
  Video, 
  MessageCircle, 
  ArrowRight, 
  BarChart, 
  Settings,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const modules = [
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel actuel par texte ou par reconnaissance vocale",
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-100",
      path: "/scan",
      badge: "Populaire"
    },
    {
      title: "Journal",
      description: "Suivez l'évolution de vos émotions et gardez une trace de vos ressentis",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      path: "/journal"
    },
    {
      title: "Musicothérapie",
      description: "Écoutez de la musique adaptée à votre état émotionnel pour vous aider",
      icon: Headphones,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      path: "/music",
      badge: "IA"
    },
    {
      title: "VR thérapie",
      description: "Immergez-vous dans des environnements adaptés à votre humeur",
      icon: Video,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      path: "/vr"
    },
    {
      title: "Coach IA",
      description: "Recevez des conseils personnalisés sur la gestion des émotions",
      icon: MessageCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      path: "/coach",
      badge: "Nouveau"
    },
    {
      title: "Tableau de bord",
      description: "Visualisez et analysez vos données émotionnelles",
      icon: BarChart,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      path: "/dashboard"
    }
  ];
  
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Bienvenue sur <span className="text-primary">EmotionsCare</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Votre espace dédié au bien-être et à l'équilibre professionnel.
        </p>
        
        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/dashboard">
                Voir mon tableau de bord
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/scan">
                Faire un scan émotionnel
                <Heart className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Se connecter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/register">
                S'inscrire
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Modules Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nos modules</h2>
          {isAuthenticated && (
            <Button asChild variant="ghost">
              <Link to="/dashboard" className="flex items-center gap-1">
                Tout voir <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            
            return (
              <Card key={module.title} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`${module.bgColor} p-2 rounded-lg`}>
                      <ModuleIcon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    {module.badge && (
                      <Badge variant="outline" className="font-normal">
                        {module.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={isAuthenticated ? module.path : "/login"}>
                      {isAuthenticated ? 'Accéder' : 'Connexion requise'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 rounded-2xl p-8 md:p-12 mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Améliorez votre bien-être aujourd'hui</h2>
            <p className="text-lg mb-6">
              Rejoignez notre communauté d'utilisateurs qui ont amélioré leur équilibre émotionnel et leur productivité grâce à EmotionsCare.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to={isAuthenticated ? "/scan" : "/register"}>
                  Commencer maintenant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md aspect-video bg-gradient-to-br from-primary/50 to-primary/30 rounded-xl flex items-center justify-center">
              <ThumbsUp className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Fonctionnalités clés</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-rose-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Analyse émotionnelle</h3>
            <p className="text-muted-foreground">
              Analyse avancée par IA de vos émotions à travers le texte et la voix
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Headphones className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Musicothérapie</h3>
            <p className="text-muted-foreground">
              Musique adaptative générée en fonction de votre état émotionnel
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Coaching IA</h3>
            <p className="text-muted-foreground">
              Conseils personnalisés pour améliorer votre bien-être émotionnel
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Settings className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Personnalisation</h3>
            <p className="text-muted-foreground">
              Une expérience entièrement adaptée à vos besoins spécifiques
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Foire aux questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Comment fonctionne l'analyse émotionnelle ?
            </h3>
            <p className="text-muted-foreground">
              Notre système utilise des algorithmes d'IA avancés pour analyser votre texte ou votre voix et détecter votre état émotionnel actuel. Il propose ensuite des recommandations adaptées pour améliorer votre bien-être.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Mes données sont-elles sécurisées ?
            </h3>
            <p className="text-muted-foreground">
              Absolument. Nous prenons la confidentialité très au sérieux. Toutes vos données sont cryptées et ne sont jamais partagées avec des tiers. Vous pouvez également activer le mode confidentiel pour une sécurité renforcée.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
