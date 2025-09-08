/**
 * PAGE D'AIDE PREMIUM EMOTIONSCARE - Version Complète
 * Centre d'aide interactif avec recherche intelligente et support 24/7
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Video, 
  Download, 
  ExternalLink,
  Star,
  Clock,
  Users,
  Zap,
  Shield,
  Heart,
  Brain,
  Music,
  Camera,
  Headphones,
  ChevronRight,
  PlayCircle,
  FileText,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Header, Footer } from '@/components/layout';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);

  // Configuration complète des catégories d'aide
  const helpCategories = [
    {
      id: 'getting-started',
      title: "Premiers pas",
      description: "Commencez votre parcours EmotionsCare",
      icon: <Heart className="w-6 h-6" />,
      color: "text-red-500 bg-red-50 dark:bg-red-950/20",
      articles: [
        {
          title: "Créer votre compte EmotionsCare",
          description: "Guide complet d'inscription et configuration",
          duration: "5 min",
          difficulty: "Débutant",
          views: 1250
        },
        {
          title: "Configuration de votre profil",
          description: "Personnalisez votre expérience EmotionsCare",
          duration: "3 min",
          difficulty: "Débutant",
          views: 980
        },
        {
          title: "Comprendre l'interface EmotionsCare",
          description: "Tour d'horizon des fonctionnalités principales",
          duration: "8 min",
          difficulty: "Débutant",
          views: 2100
        },
        {
          title: "Vos premiers exercices de bien-être",
          description: "Commencer votre parcours émotionnel",
          duration: "10 min",
          difficulty: "Débutant",
          views: 1650
        }
      ]
    },
    {
      id: 'scan-emotion',
      title: "Scanner Émotionnel",
      description: "Maîtrisez l'analyse émotionnelle IA",
      icon: <Camera className="w-6 h-6" />,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
      articles: [
        {
          title: "Utiliser le scanner facial",
          description: "Analyse d'émotions par reconnaissance faciale",
          duration: "6 min",
          difficulty: "Intermédiaire",
          views: 3200
        },
        {
          title: "Analyse vocale en temps réel",
          description: "Comprendre vos émotions par la voix",
          duration: "4 min",
          difficulty: "Débutant",
          views: 1800
        },
        {
          title: "Scanner de texte émotionnel",
          description: "Analyse de sentiment dans vos écrits",
          duration: "5 min",
          difficulty: "Intermédiaire",
          views: 1450
        },
        {
          title: "Interpréter les résultats IA",
          description: "Comprendre les scores et recommandations",
          duration: "12 min",
          difficulty: "Avancé",
          views: 2700
        }
      ]
    },
    {
      id: 'music-therapy',
      title: "Thérapie Musicale",
      description: "Musique générée par IA avec Suno",
      icon: <Music className="w-6 h-6" />,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
      articles: [
        {
          title: "Génération de musique thérapeutique",
          description: "Comment Suno crée votre musique personnalisée",
          duration: "8 min",
          difficulty: "Débutant",
          views: 4100
        },
        {
          title: "Personnaliser vos playlists émotionnelles",
          description: "Adapter la musique à votre état d'esprit",
          duration: "6 min",
          difficulty: "Intermédiaire",
          views: 2850
        },
        {
          title: "Utiliser le lecteur EmotionsCare",
          description: "Fonctionnalités avancées du lecteur",
          duration: "4 min",
          difficulty: "Débutant",
          views: 1950
        },
        {
          title: "Créer des séances musicales guidées",
          description: "Programmer des sessions de musicothérapie",
          duration: "10 min",
          difficulty: "Avancé",
          views: 1200
        }
      ]
    },
    {
      id: 'ai-coach',
      title: "Coach IA Nyvée",
      description: "Votre assistant bien-être personnel",
      icon: <Brain className="w-6 h-6" />,
      color: "text-green-500 bg-green-50 dark:bg-green-950/20",
      articles: [
        {
          title: "Présentation de Nyvée, votre coach IA",
          description: "Découvrez les capacités de votre assistant",
          duration: "7 min",
          difficulty: "Débutant",
          views: 3600
        },
        {
          title: "Conversations efficaces avec l'IA",
          description: "Techniques pour optimiser vos échanges",
          duration: "9 min",
          difficulty: "Intermédiaire",
          views: 2400
        },
        {
          title: "Programmes de coaching personnalisés",
          description: "Créer votre parcours sur mesure",
          duration: "15 min",
          difficulty: "Avancé",
          views: 1800
        },
        {
          title: "Suivi des progrès et analytics",
          description: "Mesurer l'efficacité de votre coaching",
          duration: "8 min",
          difficulty: "Intermédiaire",
          views: 1650
        }
      ]
    },
    {
      id: 'wellbeing',
      title: "Outils Bien-être",
      description: "Respiration, VR et méditation",
      icon: <Headphones className="w-6 h-6" />,
      color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20",
      articles: [
        {
          title: "Exercices de respiration guidée",
          description: "Techniques de relaxation et gestion du stress",
          duration: "12 min",
          difficulty: "Débutant",
          views: 2900
        },
        {
          title: "Thérapie VR immersive",
          description: "Utiliser la réalité virtuelle pour le bien-être",
          duration: "10 min",
          difficulty: "Intermédiaire",
          views: 1700
        },
        {
          title: "Méditation active et passive",
          description: "Différentes approches méditatives",
          duration: "14 min",
          difficulty: "Débutant",
          views: 2200
        },
        {
          title: "Créer vos routines personnalisées",
          description: "Combiner les outils pour un maximum d'efficacité",
          duration: "18 min",
          difficulty: "Avancé",
          views: 1100
        }
      ]
    },
    {
      id: 'enterprise',
      title: "Solutions Entreprise",
      description: "Gestion d'équipes et analytics RH",
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20",
      articles: [
        {
          title: "Configurer votre espace entreprise",
          description: "Installation et paramétrage B2B",
          duration: "20 min",
          difficulty: "Avancé",
          views: 850
        },
        {
          title: "Gestion des équipes et permissions",
          description: "Organiser vos collaborateurs",
          duration: "15 min",
          difficulty: "Intermédiaire",
          views: 650
        },
        {
          title: "Analytics RH et rapports bien-être",
          description: "Mesurer le bien-être organisationnel",
          duration: "25 min",
          difficulty: "Avancé",
          views: 420
        },
        {
          title: "Politiques de confidentialité RGPD",
          description: "Conformité et sécurité des données",
          duration: "12 min",
          difficulty: "Avancé",
          views: 380
        }
      ]
    }
  ];

  // Ressources rapides
  const quickResources = [
    {
      title: "Vidéos tutoriels",
      description: "Guides vidéo pas à pas",
      icon: <PlayCircle className="w-6 h-6" />,
      badge: "30+ vidéos",
      color: "text-red-500"
    },
    {
      title: "Documentation API",
      description: "Intégrations développeurs",
      icon: <FileText className="w-6 h-6" />,
      badge: "Dev",
      color: "text-blue-500"
    },
    {
      title: "Téléchargements",
      description: "Resources et outils",
      icon: <Download className="w-6 h-6" />,
      badge: "Gratuit",
      color: "text-green-500"
    },
    {
      title: "Statut du service",
      description: "Disponibilité en temps réel",
      icon: <CheckCircle className="w-6 h-6" />,
      badge: "99.9%",
      color: "text-emerald-500"
    }
  ];

  // Support channels
  const supportChannels = [
    {
      title: "Chat en direct",
      description: "Support immédiat avec nos experts",
      icon: <MessageCircle className="w-5 h-5" />,
      availability: "24/7",
      responseTime: "< 2 min",
      color: "bg-blue-500"
    },
    {
      title: "Email support",
      description: "Assistance détaillée par email",
      icon: <Mail className="w-5 h-5" />,
      availability: "24/7",
      responseTime: "< 4h",
      color: "bg-purple-500"
    },
    {
      title: "Appel vidéo",
      description: "Consultation personnalisée",
      icon: <Video className="w-5 h-5" />,
      availability: "Lun-Ven",
      responseTime: "Sur RDV",
      color: "bg-green-500"
    },
    {
      title: "Support téléphonique",
      description: "Assistance vocale dédiée",
      icon: <Phone className="w-5 h-5" />,
      availability: "9h-18h",
      responseTime: "Immédiat",
      color: "bg-orange-500"
    }
  ];

  // FAQs populaires
  const popularFaqs = [
    {
      question: "Comment fonctionne l'analyse émotionnelle par IA ?",
      answer: "Notre IA utilise des modèles avancés d'apprentissage automatique pour analyser vos expressions faciales, votre voix et vos textes...",
      category: "IA"
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont cryptées et conformes RGPD. Nous n'utilisons jamais vos données personnelles à des fins commerciales...",
      category: "Sécurité"
    },
    {
      question: "Puis-je utiliser EmotionsCare hors ligne ?",
      answer: "Certaines fonctionnalités comme les exercices de respiration sont disponibles hors ligne. L'IA nécessite une connexion...",
      category: "Technique"
    },
    {
      question: "Comment upgrader vers Premium ?",
      answer: "Vous pouvez upgrader à tout moment depuis votre tableau de bord. Premium inclut l'accès illimité à l'IA, la génération musicale...",
      category: "Abonnement"
    }
  ];

  // Stats du centre d'aide
  const helpStats = [
    { label: "Articles disponibles", value: "150+", icon: <Book className="w-4 h-4" /> },
    { label: "Vidéos tutoriels", value: "30+", icon: <Video className="w-4 h-4" /> },
    { label: "Satisfaction client", value: "98%", icon: <Star className="w-4 h-4" /> },
    { label: "Temps de réponse moyen", value: "< 2min", icon: <Clock className="w-4 h-4" /> }
  ];

  // Filtrage des articles
  useEffect(() => {
    if (!searchQuery) {
      setFilteredArticles([]);
      return;
    }

    const allArticles = helpCategories.flatMap(category => 
      category.articles.map(article => ({
        ...article,
        category: category.title,
        categoryId: category.id
      }))
    );

    const filtered = allArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredArticles(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Centre d'aide intelligent
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Comment pouvons-nous
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-green-600 to-primary bg-clip-text text-transparent">
              vous aider ?
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Découvrez tout ce que vous devez savoir sur EmotionsCare. 
            De la configuration initiale aux fonctionnalités avancées, nous vous accompagnons dans votre parcours bien-être.
          </p>

          {/* Search Premium */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Rechercher dans notre base de connaissances..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 focus:border-primary/50 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-background/50"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchQuery && filteredArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-2xl z-50 max-h-96 overflow-auto"
                >
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {filteredArticles.length} résultat(s) trouvé(s)
                    </p>
                    {filteredArticles.slice(0, 5).map((article, index) => (
                      <div key={index} className="p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                        <h4 className="font-medium text-sm">{article.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{article.description}</p>
                        <Badge variant="outline" className="text-xs mt-2">
                          {article.category}
                        </Badge>
                      </div>
                    ))}
                    {filteredArticles.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        +{filteredArticles.length - 5} autres résultats
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {helpStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Ressources Rapides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickResources.map((resource, index) => (
              <Card key={index} className="cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", 
                    resource.color === "text-red-500" && "bg-red-50 text-red-500 dark:bg-red-950/20",
                    resource.color === "text-blue-500" && "bg-blue-50 text-blue-500 dark:bg-blue-950/20",
                    resource.color === "text-green-500" && "bg-green-50 text-green-500 dark:bg-green-950/20",
                    resource.color === "text-emerald-500" && "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20"
                  )}>
                    {resource.icon}
                  </div>
                  <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                    {resource.title}
                    <Badge variant="secondary" className="text-xs">
                      {resource.badge}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs defaultValue="categories" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
            </div>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {helpCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn("p-3 rounded-xl", category.color)}>
                            {category.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {category.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.articles.map((article, articleIndex) => (
                            <div key={articleIndex} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {article.duration}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {article.difficulty}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {article.views} vues
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
                <div className="space-y-6">
                  {popularFaqs.map((faq, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground mb-3">{faq.answer}</p>
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-2">Support EmotionsCare</h2>
                <p className="text-center text-muted-foreground mb-12">
                  Notre équipe d'experts est là pour vous accompagner 24h/24, 7j/7
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {supportChannels.map((channel, index) => (
                    <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white", channel.color)}>
                          {channel.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{channel.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Disponibilité:</span>
                            <span className="font-medium">{channel.availability}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Réponse:</span>
                            <span className="font-medium">{channel.responseTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Contact Form */}
                <Card className="max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                    <CardTitle>Contactez notre équipe</CardTitle>
                    <CardDescription>
                      Décrivez votre problème et nous vous répondrons rapidement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Votre nom" />
                      <Input placeholder="Votre email" type="email" />
                    </div>
                    <Input placeholder="Sujet de votre demande" />
                    <textarea 
                      className="w-full p-3 border border-input rounded-lg resize-none h-32"
                      placeholder="Décrivez votre problème en détail..."
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer le message
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat en direct
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Notre équipe d'experts est disponible pour vous accompagner personnellement 
                dans votre utilisation d'EmotionsCare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Démarrer une conversation
                </Button>
                <Button size="lg" variant="outline">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Planifier un appel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;