// @ts-nocheck
/**
 * HelpPage - Centre d'aide EmotionsCare
 * Navigation, SEO, accessibilité, catégories d'aide, recherche fonctionnelle
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Search,
  Book,
  MessageSquare,
  Mail,
  Phone,
  Video,
  FileText,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Home,
  Settings,
  ChevronRight,
  Sparkles,
  Camera,
  Music,
  Users,
  BarChart3,
  Bell,
  Lock,
  CreditCard,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { cn } from '@/lib/utils';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  articles: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}

interface QuickAnswer {
  question: string;
  answer: string;
  category: string;
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Premiers pas',
    description: 'Commencez votre parcours bien-être',
    icon: Sparkles,
    articles: [
      { title: 'Créer un compte', href: '/signup', description: 'Inscription en quelques étapes' },
      { title: 'Configurer votre profil', href: '/settings/profile', description: 'Personnalisez votre expérience' },
      { title: 'Votre premier scan émotionnel', href: '/app/scan', description: 'Découvrez le scan facial' },
      { title: 'Comprendre vos émotions', href: '/app/insights', description: 'Analyse et interprétation' },
    ],
  },
  {
    id: 'features',
    title: 'Fonctionnalités',
    description: 'Explorez toutes les options',
    icon: Zap,
    articles: [
      { title: 'Scan émotionnel', href: '/app/scan', description: 'Analyse faciale en temps réel' },
      { title: 'Journal vocal', href: '/app/journal', description: 'Exprimez-vous librement' },
      { title: 'Musicothérapie', href: '/app/music', description: 'Sons adaptatifs pour votre humeur' },
      { title: 'Respiration guidée', href: '/app/breathwork', description: 'Techniques de relaxation' },
      { title: 'Flash Glow', href: '/app/flash-glow', description: 'Boost énergétique rapide' },
    ],
  },
  {
    id: 'account',
    title: 'Compte & Paramètres',
    description: 'Gérez votre profil et vos préférences',
    icon: Settings,
    articles: [
      { title: 'Modifier mes informations', href: '/settings/profile', description: 'Nom, email, photo' },
      { title: 'Notifications', href: '/settings/notifications', description: 'Configurer les alertes' },
      { title: 'Confidentialité', href: '/settings/privacy', description: 'Contrôlez vos données' },
      { title: 'Supprimer mon compte', href: '/account/delete', description: 'Suppression définitive' },
    ],
  },
  {
    id: 'billing',
    title: 'Abonnement & Facturation',
    description: 'Plans, paiements et factures',
    icon: CreditCard,
    articles: [
      { title: 'Changer de plan', href: '/billing', description: 'Gratuit, Premium, Entreprise' },
      { title: 'Historique des paiements', href: '/billing', description: 'Factures et reçus' },
      { title: 'Annuler mon abonnement', href: '/billing', description: 'Sans engagement' },
      { title: 'Codes promo', href: '/billing', description: 'Appliquer une réduction' },
    ],
  },
  {
    id: 'privacy',
    title: 'Sécurité & Confidentialité',
    description: 'Protection de vos données',
    icon: Shield,
    articles: [
      { title: 'Politique de confidentialité', href: '/legal/privacy', description: 'Vos droits RGPD' },
      { title: 'Sécurité des données', href: '/legal/security', description: 'Chiffrement et protection' },
      { title: 'Exporter mes données', href: '/data-export', description: 'Portabilité des données' },
      { title: 'Gestion des cookies', href: '/legal/cookies', description: 'Préférences de suivi' },
    ],
  },
  {
    id: 'b2b',
    title: 'Espace Entreprise',
    description: 'Solutions B2B pour les organisations',
    icon: Users,
    articles: [
      { title: 'Dashboard RH', href: '/b2b/dashboard', description: 'Vue agrégée anonymisée' },
      { title: 'Gérer les équipes', href: '/b2b/teams', description: 'Organisation et suivi' },
      { title: 'Rapports et heatmaps', href: '/b2b/reports', description: 'Indicateurs bien-être' },
      { title: 'Conformité RGPD B2B', href: '/b2b/security', description: 'Données entreprise' },
    ],
  },
];

const QUICK_ANSWERS: QuickAnswer[] = [
  { question: 'Comment créer un compte ?', answer: 'Cliquez sur "S\'inscrire" en haut à droite et suivez les étapes simples.', category: 'Général' },
  { question: 'L\'application est-elle gratuite ?', answer: 'Oui, nous proposons un plan gratuit avec des fonctionnalités de base. Des plans premium sont disponibles.', category: 'Facturation' },
  { question: 'Comment fonctionne le scan émotionnel ?', answer: 'Le scan utilise l\'IA pour analyser vos expressions faciales afin d\'identifier votre état émotionnel en temps réel.', category: 'Fonctionnalités' },
  { question: 'Mes données sont-elles sécurisées ?', answer: 'Absolument. Toutes vos données sont chiffrées et stockées conformément au RGPD.', category: 'Sécurité' },
  { question: 'Comment annuler mon abonnement ?', answer: 'Allez dans Paramètres > Abonnement et cliquez sur "Annuler". Votre accès reste actif jusqu\'à la fin de la période.', category: 'Facturation' },
  { question: 'Puis-je utiliser l\'app sur mobile ?', answer: 'Oui, EmotionsCare est une application web responsive accessible depuis n\'importe quel appareil.', category: 'Général' },
];

const CONTACT_OPTIONS = [
  {
    title: 'Chat en Direct',
    description: 'Réponse immédiate 24/7',
    icon: MessageSquare,
    href: '/support',
    color: 'bg-primary',
  },
  {
    title: 'Email Support',
    description: 'Réponse sous 2h',
    icon: Mail,
    href: 'mailto:support@emotionscare.com',
    color: 'bg-success',
  },
  {
    title: 'Téléphone',
    description: 'Lun-Ven 9h-18h',
    icon: Phone,
    href: 'tel:+33123456789',
    color: 'bg-secondary',
  },
];

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  usePageSEO({
    title: 'Centre d\'Aide - EmotionsCare',
    description: 'Trouvez des réponses à vos questions sur EmotionsCare. Guide utilisateur, FAQ, support technique et contact.',
    keywords: ['aide', 'support', 'FAQ', 'EmotionsCare', 'bien-être', 'tutoriel'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  // Recherche filtrée
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return HELP_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return HELP_CATEGORIES.map(cat => ({
      ...cat,
      articles: cat.articles.filter(
        a => a.title.toLowerCase().includes(query) || 
             (a.description?.toLowerCase().includes(query))
      ),
    })).filter(cat => 
      cat.articles.length > 0 || 
      cat.title.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredQuickAnswers = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_ANSWERS;
    const query = searchQuery.toLowerCase();
    return QUICK_ANSWERS.filter(
      qa => qa.question.toLowerCase().includes(query) || qa.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation aide" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/"><Home className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Accueil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-semibold">Centre d'Aide</span>
              </div>
              <Badge variant="outline" className="hidden md:inline-flex gap-1 text-success border-success/30">
                <Heart className="h-3 w-3" aria-hidden="true" />
                Support 24/7
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/faq">FAQ</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Questions fréquentes</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/support">Support</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Contacter le support</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/contact">Contact</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nous contacter</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold">Comment pouvons-nous vous aider ?</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez des réponses à vos questions, explorez nos guides ou contactez notre équipe.
          </p>
        </header>

        {/* Search */}
        <section aria-label="Recherche" className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Rechercher dans l'aide... (ex: scan, abonnement, données)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg"
                  aria-label="Rechercher dans le centre d'aide"
                />
              </div>
              {searchQuery && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {filteredCategories.reduce((acc, cat) => acc + cat.articles.length, 0)} résultats pour "{searchQuery}"
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Answers */}
        {filteredQuickAnswers.length > 0 && (
          <section aria-labelledby="quick-answers-title" className="mb-12">
            <h2 id="quick-answers-title" className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
              Questions fréquentes
            </h2>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredQuickAnswers.slice(0, 6).map((qa, index) => (
                    <AccordionItem key={index} value={`qa-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">{qa.category}</Badge>
                          <span>{qa.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-20">
                        {qa.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/faq">
                      Voir toutes les questions
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Help Categories */}
        <section aria-labelledby="categories-title" className="mb-12">
          <h2 id="categories-title" className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" aria-hidden="true" />
            Explorer par catégorie
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  role="article"
                  aria-labelledby={`cat-${category.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <CardTitle id={`cat-${category.id}`} className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2" aria-label={`Articles ${category.title}`}>
                      {category.articles.slice(0, 4).map((article, idx) => (
                        <li key={idx}>
                          <Link 
                            to={article.href}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                          >
                            <ChevronRight className="h-3 w-3" aria-hidden="true" />
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Options */}
        <section aria-labelledby="contact-title" className="mb-12">
          <h2 id="contact-title" className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" aria-hidden="true" />
            Nous contacter
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CONTACT_OPTIONS.map((option, index) => {
              const IconComponent = option.icon;
              const isExternal = option.href.startsWith('mailto:') || option.href.startsWith('tel:');
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", option.color)}>
                        <IconComponent className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                        {isExternal ? (
                          <a 
                            href={option.href}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Contacter
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        ) : (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={option.href}>
                              Ouvrir
                              <ArrowRight className="h-3 w-3 ml-1" aria-hidden="true" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section aria-labelledby="links-title" className="mb-12">
          <h2 id="links-title" className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            Ressources utiles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link to="/onboarding">
                <Book className="h-5 w-5 mr-3 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">Guide de démarrage</div>
                  <div className="text-xs text-muted-foreground">Tutoriel interactif</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link to="/demo">
                <Video className="h-5 w-5 mr-3 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">Vidéos tutoriels</div>
                  <div className="text-xs text-muted-foreground">Démonstrations</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link to="/legal/privacy">
                <Shield className="h-5 w-5 mr-3 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">Confidentialité</div>
                  <div className="text-xs text-muted-foreground">Vos droits RGPD</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link to="/legal/terms">
                <FileText className="h-5 w-5 mr-3 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">CGU</div>
                  <div className="text-xs text-muted-foreground">Conditions d'utilisation</div>
                </div>
              </Link>
            </Button>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-success" aria-hidden="true" />
            <span>Vos données sont protégées conformément au RGPD</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground" aria-label="Liens du pied de page">
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <Link to="/support" className="hover:text-foreground">Support</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
            <Link to="/legal/terms" className="hover:text-foreground">CGU</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HelpPage;