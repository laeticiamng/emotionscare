import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Clock,
  Filter,
  Copy,
  Send,
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  template: string;
  color: string;
  category: string;
}

interface MessageTemplate {
  id: string;
  title: string;
  preview: string;
  fullText: string;
  emotion: string;
  context: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    icon: '😰',
    label: 'Je suis anxieux',
    template: "Je suis vraiment stressé en ce moment. J'ai du mal à me concentrer et mes pensées tournent en boucle.",
    color: 'bg-red-100 dark:bg-red-900',
    category: 'emotions',
  },
  {
    id: '2',
    icon: '😢',
    label: 'Je suis triste',
    template: "Je me sens triste et un peu déprimé. Rien ne m'intéresse vraiment en ce moment.",
    color: 'bg-blue-100 dark:bg-blue-900',
    category: 'emotions',
  },
  {
    id: '3',
    icon: '😊',
    label: 'Je suis heureux',
    template: "Ça va vraiment bien en ce moment! Je voulais partager cette bonne énergie avec vous.",
    color: 'bg-yellow-100 dark:bg-yellow-900',
    category: 'emotions',
  },
  {
    id: '4',
    icon: '😤',
    label: 'Je suis en colère',
    template: "Je suis vraiment frustré et en colère. Il y a quelque chose qui ne va vraiment pas chez moi en ce moment.",
    color: 'bg-orange-100 dark:bg-orange-900',
    category: 'emotions',
  },
  {
    id: '5',
    icon: '🧘',
    label: 'Respiration guidée',
    template: "J'ai besoin de me calmer. Peux-tu me guider avec une respiration relaxante?",
    color: 'bg-green-100 dark:bg-green-900',
    category: 'wellness',
  },
  {
    id: '6',
    icon: '💭',
    label: 'Journaling',
    template: "Je veux explorer mes pensées. Comment puis-je commencer à journaliser?",
    color: 'bg-purple-100 dark:bg-purple-900',
    category: 'wellness',
  },
  {
    id: '7',
    icon: '🎵',
    label: 'Musique calmante',
    template: "Quelle musique recommandes-tu pour me relaxer?",
    color: 'bg-indigo-100 dark:bg-indigo-900',
    category: 'wellness',
  },
  {
    id: '8',
    icon: '🎯',
    label: 'Conseil pro',
    template: "J'ai besoin de conseils sur comment gérer [problème spécifique]",
    color: 'bg-cyan-100 dark:bg-cyan-900',
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

const EMOTION_COLORS = {
  'Joie': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Tristesse': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'Anxiété': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'Neutre': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export const CoachQuickActions = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredActions = activeCategory === 'all'
    ? QUICK_ACTIONS
    : QUICK_ACTIONS.filter((action) => action.category === activeCategory);

  const handleCopyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendTemplate = (template: string) => {
    // Logique pour envoyer le template comme message
    console.log('Sending template:', template);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Actions rapides & Templates
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Lancez rapidement une conversation ou utilisez des templates pré-écrits
        </p>
      </div>

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
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleSendTemplate(action.template)}
                className={`p-4 rounded-lg border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left ${action.color}`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {action.label}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {action.template}
                </p>
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <Button size="sm" variant="ghost" className="w-full h-7 text-xs">
                    <Send className="w-3 h-3 mr-1" />
                    Envoyer
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Templates de messages */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {MESSAGE_TEMPLATES.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {template.title}
                      </CardTitle>
                      <CardDescription>{template.preview}</CardDescription>
                    </div>
                    <Badge
                      className={`flex-shrink-0 ${EMOTION_COLORS[template.emotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS['Neutre']}`}
                    >
                      {template.emotion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Aperçu du template */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {template.fullText}
                      </p>
                    </div>

                    {/* Actions */}
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
                                className={EMOTION_COLORS[template.emotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS['Neutre']}
                              >
                                {template.emotion}
                              </Badge>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
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
                            <Button onClick={() => handleSendTemplate(template.fullText)}>
                              <Send className="w-4 h-4 mr-2" />
                              Envoyer à Coach
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleSendTemplate(template.fullText)}
                      >
                        <Send className="w-3 h-3 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Info box */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Lightbulb className="w-4 h-4" />
            Conseil
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200">
          Les templates sont des suggestions. N'hésitez pas à les adapter ou à écrire vos propres messages.
          Plus vous êtes authentique, mieux le coach peut vous aider!
        </CardContent>
      </Card>
    </div>
  );
};

// Petite icône importée depuis lucide-react
import { Eye } from 'lucide-react';
