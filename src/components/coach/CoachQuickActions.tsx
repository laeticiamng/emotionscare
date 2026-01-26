import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { logger } from '@/lib/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Zap,
  Lightbulb,
  MessageSquare,
  Filter,
  Send,
  Eye,
  Star,
  History,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAVORITES_KEY = 'coach_quick_actions_favorites';
const HISTORY_KEY = 'coach_quick_actions_history';
const CUSTOM_TEMPLATES_KEY = 'coach_custom_templates';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  template: string;
  color: string;
  category: string;
  usageCount?: number;
}

interface MessageTemplate {
  id: string;
  title: string;
  preview: string;
  fullText: string;
  emotion: string;
  context: string;
  isCustom?: boolean;
}

interface UsageHistory {
  id: string;
  type: 'action' | 'template';
  timestamp: string;
  label: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    icon: '😰',
    label: 'Je suis anxieux',
    template: "Je suis vraiment stressé en ce moment. J'ai du mal à me concentrer et mes pensées tournent en boucle.",
    color: 'bg-red-100 dark:bg-red-900/30',
    category: 'emotions',
  },
  {
    id: '2',
    icon: '😢',
    label: 'Je suis triste',
    template: "Je me sens triste et un peu déprimé. Rien ne m'intéresse vraiment en ce moment.",
    color: 'bg-blue-100 dark:bg-blue-900/30',
    category: 'emotions',
  },
  {
    id: '3',
    icon: '😊',
    label: 'Je suis heureux',
    template: "Ça va vraiment bien en ce moment! Je voulais partager cette bonne énergie avec vous.",
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
    category: 'emotions',
  },
  {
    id: '4',
    icon: '😤',
    label: 'Je suis en colère',
    template: "Je suis vraiment frustré et en colère. Il y a quelque chose qui ne va vraiment pas chez moi en ce moment.",
    color: 'bg-orange-100 dark:bg-orange-900/30',
    category: 'emotions',
  },
  {
    id: '5',
    icon: '🧘',
    label: 'Respiration guidée',
    template: "J'ai besoin de me calmer. Peux-tu me guider avec une respiration relaxante?",
    color: 'bg-green-100 dark:bg-green-900/30',
    category: 'wellness',
  },
  {
    id: '6',
    icon: '💭',
    label: 'Journaling',
    template: "Je veux explorer mes pensées. Comment puis-je commencer à journaliser?",
    color: 'bg-purple-100 dark:bg-purple-900/30',
    category: 'wellness',
  },
  {
    id: '7',
    icon: '🎵',
    label: 'Musique calmante',
    template: "Quelle musique recommandes-tu pour me relaxer?",
    color: 'bg-indigo-100 dark:bg-indigo-900/30',
    category: 'wellness',
  },
  {
    id: '8',
    icon: '🎯',
    label: 'Conseil pro',
    template: "J'ai besoin de conseils sur comment gérer [problème spécifique]",
    color: 'bg-cyan-100 dark:bg-cyan-900/30',
    category: 'advice',
  },
];

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    title: 'Partager ma mauvaise journée',
    preview: 'Explain what happened today and get supportive advice',
    fullText: "Aujourd'hui a été une mauvaise journée. Voici ce qui s'est passé:\n\n[Décrire les événements]\n\nJe me sens vraiment découragé et j'aimerais que tu m'aides à voir les choses différemment.",
    emotion: 'Tristesse',
    context: 'Difficultés quotidiennes',
  },
  {
    id: '2',
    title: 'Comprendre mes pensées négatives',
    preview: 'Explore recurring negative thought patterns',
    fullText: "Je me rends compte que je pense souvent:\n\n[Pensée négative]\n\nComment puis-je arrêter cette boucle de pensées? Comment puis-je être plus bienveillant avec moi-même?",
    emotion: 'Anxiété',
    context: 'Patterns de pensée',
  },
  {
    id: '3',
    title: 'Célébrer une victoire',
    preview: 'Share something good that happened',
    fullText: "Quelque chose de merveilleux m'est arrivé aujourd'hui:\n\n[Partager la bonne nouvelle]\n\nJe suis vraiment heureux et je voulais partager cette joie. Merci de m'écouter!",
    emotion: 'Joie',
    context: 'Moments positifs',
  },
  {
    id: '4',
    title: 'Gestion du stress professionnel',
    preview: 'Address work-related stress and find solutions',
    fullText: "Au travail, je stresse beaucoup à cause de:\n\n[Détailler les sources de stress]\n\nComment puis-je gérer cela sans que cela affecte ma santé mentale?",
    emotion: 'Anxiété',
    context: 'Professionnel',
  },
  {
    id: '5',
    title: 'Relation et conflit',
    preview: 'Explore relationship issues with compassion',
    fullText: "J'ai une tension avec [personne/groupe]. Le problème est:\n\n[Décrire la situation]\n\nComment puis-je améliorer cette relation?",
    emotion: 'Neutre',
    context: 'Relations',
  },
  {
    id: '6',
    title: 'Développement personnel',
    preview: 'Discuss personal growth and goals',
    fullText: "Je veux travailler sur [objectif]. Actuellement, je:\n\n[Situation actuelle]\n\nQuel serait un bon plan d'action?",
    emotion: 'Neutre',
    context: 'Croissance personnelle',
  },
];

const EMOTION_COLORS: Record<string, string> = {
  'Joie': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100',
  'Tristesse': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
  'Anxiété': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100',
  'Neutre': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-100',
};

export const CoachQuickActions = () => {
  const [_selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<UsageHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<MessageTemplate[]>([]);
  const [actionUsage, setActionUsage] = useState<Record<string, number>>({});

  // Load data from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    const storedCustom = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedCustom) setCustomTemplates(JSON.parse(storedCustom));
    
    // Load action usage counts
    const usage: Record<string, number> = {};
    if (storedHistory) {
      const hist: UsageHistory[] = JSON.parse(storedHistory);
      hist.forEach(h => {
        usage[h.id] = (usage[h.id] || 0) + 1;
      });
    }
    setActionUsage(usage);
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addToHistory = (id: string, type: 'action' | 'template', label: string) => {
    const entry: UsageHistory = {
      id,
      type,
      timestamp: new Date().toISOString(),
      label,
    };
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    
    // Update usage count
    setActionUsage(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const filteredActions = QUICK_ACTIONS.filter(action => {
    const matchesCategory = activeCategory === 'all' || 
                           activeCategory === 'favorites' ? favorites.includes(action.id) :
                           action.category === activeCategory;
    const matchesSearch = action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.template.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // Sort by favorites first, then by usage
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    return (actionUsage[b.id] || 0) - (actionUsage[a.id] || 0);
  });

  const allTemplates = [...MESSAGE_TEMPLATES, ...customTemplates];
  const filteredTemplates = allTemplates.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fullText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendTemplate = (template: string, id: string, label: string) => {
    addToHistory(id, 'action', label);
    logger.debug('Sending template:', template, 'COMPONENT');
    setSelectedTemplate(null);
  };

  const handleSendAction = (action: QuickAction) => {
    addToHistory(action.id, 'action', action.label);
    logger.debug('Sending action:', action.template, 'COMPONENT');
  };

  // Get time-based suggestions
  const getTimeSuggestions = () => {
    const hour = new Date().getHours();
    if (hour < 12) return ['🧘 Respiration guidée', '😊 Je suis heureux'];
    if (hour < 18) return ['🎯 Conseil pro', '💭 Journaling'];
    return ['🎵 Musique calmante', '😰 Je suis anxieux'];
  };

  const suggestions = getTimeSuggestions();

  return (
    <TooltipProvider>
      <div className="space-y-6 w-full">
        {/* En-tête avec recherche */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Actions rapides & Templates
              </h2>
              <p className="text-muted-foreground">
                Lancez rapidement une conversation ou utilisez des templates pré-écrits
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {favorites.length} favoris
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-1"
              >
                <History className="w-4 h-4" />
                Historique
              </Button>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une action ou un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Suggestions contextuelles */}
        <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Suggestions pour ce moment</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/10">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Historique */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-dashed">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Récemment utilisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {history.slice(0, 8).map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs defaultValue="actions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="actions" className="gap-2">
              <Zap className="w-4 h-4" />
              Actions rapides
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Templates de messages
            </TabsTrigger>
          </TabsList>

          {/* Actions rapides */}
          <TabsContent value="actions" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className="gap-2"
              >
                <Filter className="w-3 h-3" />
                Tous
              </Button>
              <Button
                variant={activeCategory === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('favorites')}
                className="gap-1"
              >
                <Star className="w-3 h-3" />
                Favoris
              </Button>
              {['emotions', 'wellness', 'advice'].map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'emotions' && '😊 Émotions'}
                  {cat === 'wellness' && '🧘 Bien-être'}
                  {cat === 'advice' && '💡 Conseils'}
                </Button>
              ))}
            </div>

            {/* Grille d'actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div
                      className={`p-4 rounded-lg border-2 border-transparent hover:border-primary/30 transition-all text-left relative group ${action.color}`}
                    >
                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(action.id)}
                        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={favorites.includes(action.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(action.id) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </button>

                      {/* Usage count */}
                      {actionUsage[action.id] > 0 && (
                        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] px-1.5">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          {actionUsage[action.id]}
                        </Badge>
                      )}

                      <div className="text-2xl mb-2">{action.icon}</div>
                      <p className="font-semibold text-foreground text-sm">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {action.template}
                      </p>
                      <div className="mt-3 pt-3 border-t border-current/10">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-full h-7 text-xs"
                          onClick={() => handleSendAction(action)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Envoyer
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredActions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune action ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>

          {/* Templates de messages */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={template.isCustom ? 'border-primary/30' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {template.title}
                            {template.isCustom && (
                              <Badge variant="outline" className="text-xs">Personnalisé</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{template.preview}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => toggleFavorite(template.id)}>
                                <Star className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {favorites.includes(template.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </TooltipContent>
                          </Tooltip>
                          <Badge
                            className={`flex-shrink-0 ${EMOTION_COLORS[template.emotion] || EMOTION_COLORS['Neutre']}`}
                          >
                            {template.emotion}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-muted/50 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {template.fullText}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1" size="sm">
                                <Eye className="w-3 h-3 mr-2" />
                                Aperçu complet
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{template.title}</DialogTitle>
                                <DialogDescription className="flex gap-2 pt-2">
                                  <Badge variant="outline">{template.context}</Badge>
                                  <Badge
                                    className={EMOTION_COLORS[template.emotion] || EMOTION_COLORS['Neutre']}
                                  >
                                    {template.emotion}
                                  </Badge>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {template.fullText}
                                </p>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => handleCopyTemplate(template.fullText, template.id)}
                                >
                                  {copiedId === template.id ? '✓ Copié' : 'Copier le texte'}
                                </Button>
                                <Button onClick={() => handleSendTemplate(template.fullText, template.id, template.title)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Envoyer à Coach
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            className="flex-1"
                            size="sm"
                            onClick={() => handleSendTemplate(template.fullText, template.id, template.title)}
                          >
                            <Send className="w-3 h-3 mr-2" />
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info box */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lightbulb className="w-4 h-4" />
              Conseil
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les templates sont des suggestions. N'hésitez pas à les adapter ou à écrire vos propres messages.
            Plus vous êtes authentique, mieux le coach peut vous aider! ⭐ Ajoutez vos favoris pour un accès rapide.
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
