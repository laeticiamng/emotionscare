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
  ThumbsUp,
  User,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import CallToAction from '@/components/home/CallToAction';

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
      {/* Hero Section - Amélioré avec des animations et transitions */}
      <section className="relative py-20 px-4 rounded-3xl bg-gradient-to-br from-white to-[#F0F9FF] mb-16 overflow-hidden transform transition-all duration-700 hover:shadow-xl">
        <div 
          className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
          style={{ opacity: "0.4", mixBlendMode: "overlay" }}
        />
        
        {/* Cercles d'ambiance animés */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-100/30 to-blue-100/30 blur-[70px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-rose-100/30 to-amber-100/30 blur-[70px] animate-pulse-slow animation-delay-2000"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-gray-900 animate-fade-in">
            Prenez soin de votre <span className="text-primary animate-gradient-text">état émotionnel</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Votre journal, votre musique, votre calme. Trouvez l'équilibre dont vous avez besoin.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                  <Link to="/dashboard">
                    Accéder à mon espace
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:-translate-y-1">
                  <Link to="/scan">
                    Faire un scan émotionnel
                    <Heart className="h-4 w-4 ml-2 transition-all group-hover:scale-110 group-hover:text-rose-500" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                  <Link to="/register">
                    S'inscrire
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:-translate-y-1">
                  <Link to="/login">
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* NEW B2C/B2B ACCESS SECTION */}
      {!isAuthenticated && (
        <motion.section 
          className="mb-16 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Choisissez votre espace</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Accédez à l'environnement adapté à vos besoins, que vous soyez un particulier ou une entreprise
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* B2C Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-800/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Particulier</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Accédez à votre espace personnel pour prendre soin de votre bien-être émotionnel
                </p>
                <Button 
                  onClick={() => window.location.href = '/login'}
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-md"
                >
                  <User className="mr-2 h-5 w-5" />
                  Espace Particulier
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {/* B2B Card */}
              <div className="bg-gradient-to-br from-gray-50 to-indigo-100 dark:from-gray-900/50 dark:to-indigo-900/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Entreprise</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Solutions de bien-être émotionnel pour vos équipes et votre organisation
                </p>
                <Button 
                  onClick={() => window.location.href = '/business'}
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300 shadow-sm"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Espace Entreprise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Modules Section - Améliorée avec des animations */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Nos modules thérapeutiques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const ModuleIcon = module.icon;
            
            return (
              <div 
                key={module.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 animate-fade-in hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${module.bgColor} p-3 rounded-lg transition-transform duration-300 group-hover:scale-110`}>
                    <ModuleIcon className={`h-6 w-6 ${module.color} transition-transform duration-300`} />
                  </div>
                  {module.badge && (
                    <Badge variant="outline" className="font-normal animate-pulse">
                      {module.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <Button asChild variant="outline" className="w-full transition-all duration-300 overflow-hidden group-hover:bg-primary/10">
                  <Link to={isAuthenticated ? module.path : "/login"} className="relative">
                    {isAuthenticated ? 'Accéder' : 'Connexion requise'}
                    <ArrowRight className="h-4 w-4 ml-2 inline transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Améliorée avec des animations */}
      <section className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 transform transition-all duration-500 hover:bg-primary/10 hover:shadow-lg overflow-hidden relative">
        {/* Élément décoratif animé */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/10 animate-float"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-primary/5 animate-float-delay"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-1 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Améliorez votre bien-être dès aujourd'hui</h2>
            <p className="text-lg mb-6 text-gray-600">
              Rejoignez notre communauté d'utilisateurs qui ont trouvé un meilleur équilibre émotionnel grâce à EmotionsCare.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <Link to={isAuthenticated ? "/scan" : "/register"}>
                  Commencer maintenant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:-translate-y-1">
                <Link to="/about">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="w-full max-w-md aspect-video bg-gradient-to-br from-primary/50 to-primary/30 rounded-xl flex items-center justify-center transform transition-all duration-500 hover:scale-[1.03] hover:shadow-lg">
              <ThumbsUp className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Améliorée avec des animations */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Fonctionnalités clés</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="bg-rose-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
              <Heart className="h-8 w-8 text-rose-500 transition-all duration-300 hover:scale-110" />
            </div>
            <h3 className="text-xl font-medium mb-2">Analyse émotionnelle</h3>
            <p className="text-gray-600">
              Analyse avancée par IA de vos émotions à travers le texte et la voix
            </p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="bg-blue-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
              <Headphones className="h-8 w-8 text-blue-500 transition-all duration-300 hover:scale-110" />
            </div>
            <h3 className="text-xl font-medium mb-2">Musicothérapie</h3>
            <p className="text-gray-600">
              Musique adaptative générée en fonction de votre état émotionnel
            </p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="bg-amber-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
              <MessageCircle className="h-8 w-8 text-amber-500 transition-all duration-300 hover:scale-110" />
            </div>
            <h3 className="text-xl font-medium mb-2">Coaching IA</h3>
            <p className="text-gray-600">
              Conseils personnalisés pour améliorer votre bien-être émotionnel
            </p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="bg-emerald-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
              <Video className="h-8 w-8 text-emerald-500 transition-all duration-300 hover:scale-110" />
            </div>
            <h3 className="text-xl font-medium mb-2">VR thérapeutique</h3>
            <p className="text-gray-600">
              Expériences immersives pour calmer l'esprit et réduire l'anxiété
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Améliorée avec des animations */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Foire aux questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-fade-in transform transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ animationDelay: "100ms" }}>
            <h3 className="text-xl font-medium mb-2">Comment fonctionne l'analyse émotionnelle ?</h3>
            <p className="text-gray-600">
              Notre système utilise des algorithmes d'intelligence artificielle pour analyser votre texte ou votre voix et détecter votre état émotionnel actuel. Il propose ensuite des recommandations adaptées pour améliorer votre bien-être.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-fade-in transform transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ animationDelay: "200ms" }}>
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
