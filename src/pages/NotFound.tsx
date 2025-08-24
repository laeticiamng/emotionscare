
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  Mail, 
  ExternalLink,
  Star,
  Clock,
  Users,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{title: string, path: string, description: string}>>([]);

  const allPages = [
    { title: 'Accueil', path: '/', description: 'Page d\'accueil principale', keywords: ['home', 'accueil', 'principal'] },
    { title: 'À propos', path: '/about', description: 'Découvrez EmotionsCare', keywords: ['about', 'propos', 'équipe'] },
    { title: 'Contact', path: '/contact', description: 'Nous contacter', keywords: ['contact', 'aide', 'support'] },
    { title: 'Aide', path: '/help', description: 'Centre d\'aide et FAQ', keywords: ['help', 'aide', 'faq', 'support'] },
    { title: 'Tarifs', path: '/pricing', description: 'Nos plans et tarifs', keywords: ['pricing', 'tarifs', 'plans', 'abonnement'] },
    { title: 'Scan émotionnel', path: '/scan', description: 'Analysez vos émotions', keywords: ['scan', 'emotion', 'analyse'] },
    { title: 'Musicothérapie', path: '/music', description: 'Thérapie par la musique', keywords: ['music', 'musique', 'thérapie'] },
    { title: 'Journal', path: '/journal', description: 'Journal personnel', keywords: ['journal', 'diary', 'personnel'] },
    { title: 'Coach IA', path: '/coach', description: 'Assistant virtuel', keywords: ['coach', 'ia', 'assistant'] },
    { title: 'Tableau de bord', path: '/dashboard', description: 'Votre espace personnel', keywords: ['dashboard', 'tableau', 'bord'] },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allPages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()))
      ).slice(0, 4);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);
  
  const popularPages = [
    { title: 'Accueil', path: '/', icon: Home },
    { title: 'Scan émotionnel', path: '/scan', icon: Search },
    { title: 'Centre d\'aide', path: '/help', icon: HelpCircle },
    { title: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4" data-testid="page-root">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mb-6">
              <Search className="h-16 w-16 text-red-500" />
            </div>
            <Badge variant="outline" className="mb-4 text-red-600 border-red-200">
              Erreur 404
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Page introuvable
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Explorons ensemble pour trouver ce que vous cherchiez.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Page précédente
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Rechercher une page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Que cherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Suggestions :</h4>
                    {suggestions.map((page, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(page.path)}
                        className="w-full text-left p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-muted-foreground">{page.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Pages populaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularPages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(page.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <page.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{page.title}</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Récemment ajouté</h3>
              <p className="text-sm text-muted-foreground">
                Découvrez nos dernières fonctionnalités
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate('/about')}
              >
                En savoir plus
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Communauté</h3>
              <p className="text-sm text-muted-foreground">
                Rejoignez notre communauté d'utilisateurs
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate('/social')}
              >
                Découvrir
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">
                Notre équipe est là pour vous aider
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate('/contact')}
              >
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                Besoin d'aide pour naviguer ?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Notre plateforme EmotionsCare offre de nombreuses fonctionnalités pour votre bien-être. 
                Si vous ne trouvez pas ce que vous cherchez, notre équipe support est là pour vous guider.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => navigate('/help')}
                  className="bg-gradient-to-r from-primary to-blue-600"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Centre d'aide
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact direct
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
