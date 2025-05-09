
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
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
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
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-8">
      {/* Hero Section - Améliorée avec un dégradé doux et une mise en page centrée */}
      <section className="relative py-20 px-4 rounded-3xl bg-gradient-to-br from-white to-[#F0F9FF] mb-16">
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')"
          style={{ opacity: "0.4", mixBlendMode: "overlay" }}
          className="rounded-3xl"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-gray-900 animate-fade-in">
            Prenez soin de votre <span className="text-primary">état émotionnel</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Votre journal, votre musique, votre calme. Trouvez l'équilibre dont vous avez besoin.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <Link to="/dashboard">
                    Accéder à mon espace
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/scan">
                    Faire un scan émotionnel
                    <Heart className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <Link to="/register">
                    S'inscrire
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modules Section - Améliorée avec des cartes plus visuelles */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos modules thérapeutiques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const ModuleIcon = module.icon;
            
            return (
              <div 
                key={module.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${module.bgColor} p-3 rounded-lg`}>
                    <ModuleIcon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  {module.badge && (
                    <Badge variant="outline" className="font-normal">
                      {module.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={isAuthenticated ? module.path : "/login"}>
                    {isAuthenticated ? 'Accéder' : 'Connexion requise'}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Nouveau bloc d'appel à l'action */}
      <section className="bg-primary/10 rounded-2xl p-8 md:p-12 mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Améliorez votre bien-être dès aujourd'hui</h2>
            <p className="text-lg mb-6 text-gray-600">
              Rejoignez notre communauté d'utilisateurs qui ont trouvé un meilleur équilibre émotionnel grâce à EmotionsCare.
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

      {/* Features Section - Présentation des fonctionnalités clés */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Fonctionnalités clés</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-rose-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Analyse émotionnelle</h3>
            <p className="text-gray-600">
              Analyse avancée par IA de vos émotions à travers le texte et la voix
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Headphones className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Musicothérapie</h3>
            <p className="text-gray-600">
              Musique adaptative générée en fonction de votre état émotionnel
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Coaching IA</h3>
            <p className="text-gray-600">
              Conseils personnalisés pour améliorer votre bien-être émotionnel
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Video className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">VR thérapeutique</h3>
            <p className="text-gray-600">
              Expériences immersives pour calmer l'esprit et réduire l'anxiété
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Ajout d'une section de questions fréquentes */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Foire aux questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium mb-2">Comment fonctionne l'analyse émotionnelle ?</h3>
            <p className="text-gray-600">
              Notre système utilise des algorithmes d'intelligence artificielle pour analyser votre texte ou votre voix et détecter votre état émotionnel actuel. Il propose ensuite des recommandations adaptées pour améliorer votre bien-être.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium mb-2">Mes données sont-elles sécurisées ?</h3>
            <p className="text-gray-600">
              Absolument. Nous prenons la confidentialité très au sérieux. Toutes vos données sont cryptées et ne sont jamais partagées avec des tiers. Vous pouvez également activer le mode confidentiel pour une sécurité renforcée.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
