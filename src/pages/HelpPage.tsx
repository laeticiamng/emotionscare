import React from 'react';
import { motion } from 'framer-motion';
import { Search, Book, MessageCircle, Video, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HelpPage: React.FC = () => {
  const faqCategories = [
    {
      title: "Premiers pas",
      icon: <Book className="w-5 h-5" />,
      articles: [
        "Comment créer un compte EmotionsCare",
        "Configuration de votre profil",
        "Présentation de l'interface",
        "Premiers exercices recommandés"
      ]
    },
    {
      title: "Fonctionnalités",
      icon: <Video className="w-5 h-5" />,
      articles: [
        "Utiliser le scan émotionnel",
        "Personnaliser votre musique thérapeutique", 
        "Coaching IA: comment ça marche",
        "Tenir un journal numérique"
      ]
    },
    {
      title: "Entreprises (B2B)",
      icon: <MessageCircle className="w-5 h-5" />,
      articles: [
        "Configurer votre espace entreprise",
        "Gestion des équipes",
        "Rapports et analytics",
        "Politiques de confidentialité"
      ]
    }
  ];

  const quickActions = [
    {
      title: "Guides vidéo",
      description: "Tutoriels pas à pas",
      icon: <Video className="w-6 h-6" />,
      badge: "Nouveau"
    },
    {
      title: "Documentation",
      description: "Guides détaillés",
      icon: <Book className="w-6 h-6" />,
      badge: null
    },
    {
      title: "Contact support",
      description: "Assistance personnalisée",
      icon: <MessageCircle className="w-6 h-6" />,
      badge: "24/7"
    },
    {
      title: "Ressources",
      description: "Téléchargements utiles",
      icon: <Download className="w-6 h-6" />,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Centre d'aide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Trouvez rapidement les réponses à vos questions
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher dans l'aide..." 
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  {action.icon}
                </div>
                <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  {action.title}
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-8 mb-12"
        >
          {faqCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="text-primary">{category.icon}</div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a 
                        href="#" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {article}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Vous ne trouvez pas votre réponse ?</CardTitle>
              <CardDescription>
                Notre équipe support est là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat en direct
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;