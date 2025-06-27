
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Video, 
  Download,
  ChevronRight,
  Star,
  Clock,
  User,
  Lightbulb,
  Settings,
  Shield,
  Smartphone
} from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: "Premiers pas",
      icon: Lightbulb,
      articles: 12,
      color: "from-blue-500 to-indigo-600",
      description: "Configuration et prise en main"
    },
    {
      title: "Fonctionnalités",
      icon: Settings,
      articles: 18,
      color: "from-green-500 to-emerald-600",
      description: "Guide des outils disponibles"
    },
    {
      title: "Sécurité & Confidentialité",
      icon: Shield,
      articles: 8,
      color: "from-purple-500 to-pink-600",
      description: "Protection de vos données"
    },
    {
      title: "Application mobile",
      icon: Smartphone,
      articles: 15,
      color: "from-orange-500 to-red-600",
      description: "Utilisation sur mobile"
    }
  ];

  const popularArticles = [
    {
      title: "Comment commencer avec EmotionsCare ?",
      views: 2540,
      rating: 4.8,
      readTime: "5 min",
      category: "Premiers pas"
    },
    {
      title: "Scanner mes émotions : guide complet",
      views: 1890,
      rating: 4.9,
      readTime: "8 min",
      category: "Fonctionnalités"
    },
    {
      title: "Configurer les notifications",
      views: 1420,
      rating: 4.6,
      readTime: "3 min",
      category: "Paramètres"
    },
    {
      title: "Mes données sont-elles sécurisées ?",
      views: 980,
      rating: 4.7,
      readTime: "6 min",
      category: "Sécurité"
    }
  ];

  const quickActions = [
    {
      title: "Tutoriels vidéo",
      description: "Regardez nos guides pas à pas",
      icon: Video,
      action: "Voir les vidéos",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Chat en direct",
      description: "Parlez à notre équipe support",
      icon: MessageCircle,
      action: "Démarrer le chat",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Base de connaissances",
      description: "Explorez tous nos articles",
      icon: Book,
      action: "Parcourir",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Téléchargements",
      description: "Guides PDF et ressources",
      icon: Download,
      action: "Télécharger",
      color: "bg-orange-100 text-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Centre d'aide EmotionsCare
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions et découvrez comment tirer le meilleur parti de votre expérience bien-être.
            </p>
            
            {/* Barre de recherche */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Comment pouvons-nous vous aider ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      {action.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Catégories populaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Catégories populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.title}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            {category.articles} articles
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Articles populaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Articles les plus consultés</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{article.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.views} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe support est là pour vous aider personnellement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter le support
                </Button>
                <Button variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Demander une démo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
