// @ts-nocheck
/**
 * FAQPage - Questions Fréquentes EmotionsCare
 * SEO, accessibilité, catégories étendues, recherche fonctionnelle
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  HelpCircle, 
  Home, 
  ArrowRight, 
  MessageSquare,
  Shield,
  Zap,
  CreditCard,
  Settings,
  Camera,
  Music,
  Heart,
  Users,
  Lock,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { cn } from '@/lib/utils';

interface FAQQuestion {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  category: string;
  icon: React.ElementType;
  questions: FAQQuestion[];
}

const FAQS: FAQCategory[] = [
  {
    id: 'general',
    category: 'Général',
    icon: HelpCircle,
    questions: [
      { q: 'Comment créer un compte ?', a: 'Cliquez sur "S\'inscrire" en haut à droite et suivez les étapes. Vous pouvez vous inscrire avec votre email ou via Google/Apple.' },
      { q: 'L\'application est-elle gratuite ?', a: 'Oui, nous proposons un plan gratuit avec les fonctionnalités essentielles. Des plans Premium sont disponibles pour plus de fonctionnalités avancées.' },
      { q: 'Puis-je utiliser EmotionsCare sur mobile ?', a: 'Absolument ! EmotionsCare est une application web responsive accessible depuis n\'importe quel navigateur mobile.' },
      { q: 'Dans quelles langues l\'application est-elle disponible ?', a: 'EmotionsCare est actuellement disponible en français et en anglais. D\'autres langues seront ajoutées prochainement.' },
      { q: 'Comment supprimer mon compte ?', a: 'Allez dans Paramètres > Compte > Supprimer mon compte. Cette action est irréversible et supprime toutes vos données.' },
    ],
  },
  {
    id: 'features',
    category: 'Fonctionnalités',
    icon: Zap,
    questions: [
      { q: 'Comment fonctionne le scan émotionnel ?', a: 'Le scan utilise l\'IA pour analyser vos expressions faciales via la caméra de votre appareil. L\'analyse est effectuée localement et aucune image n\'est stockée.' },
      { q: 'Puis-je utiliser l\'app sans caméra ?', a: 'Oui ! Vous pouvez utiliser le journal vocal, la respiration guidée, la musicothérapie et d\'autres fonctionnalités sans caméra.' },
      { q: 'Qu\'est-ce que Flash Glow ?', a: 'Flash Glow est une session de boost énergétique de 2 minutes combinant respiration, visualisation et affirmations positives.' },
      { q: 'Comment fonctionne la musicothérapie ?', a: 'Notre système adapte automatiquement la musique à votre état émotionnel détecté, utilisant des fréquences et rythmes spécifiques pour améliorer votre humeur.' },
      { q: 'Puis-je utiliser l\'app sans VR ?', a: 'Absolument ! La VR est optionnelle et représente une expérience premium. Toutes les fonctionnalités principales sont accessibles sans casque VR.' },
      { q: 'Comment fonctionne le journal vocal ?', a: 'Le journal vocal vous permet d\'enregistrer vos pensées et émotions. Notre IA analyse le ton et le contenu pour vous fournir des insights personnalisés.' },
    ],
  },
  {
    id: 'billing',
    category: 'Compte & Facturation',
    icon: CreditCard,
    questions: [
      { q: 'Comment changer mon plan ?', a: 'Allez dans Paramètres > Abonnement pour voir les plans disponibles et changer à tout moment. La différence est calculée au prorata.' },
      { q: 'Puis-je annuler mon abonnement ?', a: 'Oui, vous pouvez annuler à tout moment sans frais. Votre accès Premium restera actif jusqu\'à la fin de la période payée.' },
      { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, Apple Pay et Google Pay.' },
      { q: 'Comment obtenir une facture ?', a: 'Toutes vos factures sont disponibles dans Paramètres > Facturation > Historique des paiements. Vous pouvez les télécharger en PDF.' },
      { q: 'Y a-t-il une période d\'essai ?', a: 'Oui, tous les nouveaux utilisateurs bénéficient de 7 jours d\'essai Premium gratuit sans engagement.' },
      { q: 'Comment appliquer un code promo ?', a: 'Lors du paiement, entrez votre code dans le champ "Code promotionnel" avant de valider. La réduction sera appliquée immédiatement.' },
    ],
  },
  {
    id: 'privacy',
    category: 'Sécurité & Confidentialité',
    icon: Shield,
    questions: [
      { q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous sommes conformes au RGPD.' },
      { q: 'Stockez-vous mes images ou vidéos ?', a: 'Non, jamais. L\'analyse faciale est effectuée localement sur votre appareil. Seuls les résultats anonymisés sont traités.' },
      { q: 'Puis-je exporter mes données ?', a: 'Oui, conformément au RGPD, vous pouvez exporter toutes vos données depuis Paramètres > Données > Exporter.' },
      { q: 'Qui a accès à mes données ?', a: 'Uniquement vous. Même notre équipe support n\'a pas accès à vos données personnelles sans votre autorisation explicite.' },
      { q: 'Comment supprimer toutes mes données ?', a: 'Allez dans Paramètres > Données > Supprimer mes données. La suppression est irréversible et effectuée sous 72h.' },
      { q: 'Mes données sont-elles partagées avec mon employeur (B2B) ?', a: 'Non. En mode B2B, seules des statistiques agrégées et anonymisées sont visibles par les RH. Vos données individuelles restent privées.' },
    ],
  },
  {
    id: 'b2b',
    category: 'Entreprises (B2B)',
    icon: Users,
    questions: [
      { q: 'Comment activer le mode entreprise ?', a: 'Contactez notre équipe commerciale via le formulaire B2B ou votre administrateur RH si votre entreprise est déjà cliente.' },
      { q: 'Qu\'est-ce que le dashboard RH ?', a: 'C\'est un tableau de bord qui affiche des indicateurs de bien-être agrégés et anonymisés pour l\'équipe, sans accès aux données individuelles.' },
      { q: 'Mes données personnelles sont-elles visibles par mon employeur ?', a: 'Non. Le dashboard RH n\'affiche que des statistiques globales. Vos scans et journaux restent strictement privés.' },
      { q: 'Combien de collaborateurs minimum pour le B2B ?', a: 'Les plans entreprise sont disponibles à partir de 10 collaborateurs. Des tarifs dégressifs sont appliqués pour les grandes organisations.' },
      { q: 'Y a-t-il une période d\'essai B2B ?', a: 'Oui, nous proposons un pilote de 30 jours pour tester la solution avec une équipe restreinte avant déploiement global.' },
    ],
  },
  {
    id: 'technical',
    category: 'Technique',
    icon: Settings,
    questions: [
      { q: 'Quels navigateurs sont supportés ?', a: 'Chrome, Firefox, Safari et Edge (versions récentes). Pour le scan facial, Chrome ou Firefox sont recommandés.' },
      { q: 'L\'application fonctionne-t-elle hors ligne ?', a: 'Partiellement. Certaines fonctionnalités comme la respiration guidée sont disponibles hors ligne grâce au cache.' },
      { q: 'Comment autoriser l\'accès à la caméra ?', a: 'Lors du premier scan, votre navigateur demandera l\'autorisation. Vous pouvez aussi l\'activer manuellement dans les paramètres du navigateur.' },
      { q: 'Le scan ne fonctionne pas, que faire ?', a: 'Vérifiez que votre caméra est bien connectée, que l\'éclairage est suffisant, et que vous avez autorisé l\'accès. Essayez aussi un autre navigateur.' },
      { q: 'Comment signaler un bug ?', a: 'Utilisez le formulaire de support ou envoyez un email à contact@emotionscare.com avec les détails du problème et des captures d\'écran.' },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  usePageSEO({
    title: 'FAQ - Questions Fréquentes - EmotionsCare',
    description: 'Trouvez les réponses à toutes vos questions sur EmotionsCare. Compte, fonctionnalités, facturation, sécurité et plus.',
    keywords: ['FAQ', 'questions', 'aide', 'EmotionsCare', 'support', 'bien-être'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const filteredFaqs = useMemo(() => {
    let filtered = FAQS;
    
    if (activeCategory) {
      filtered = filtered.filter(cat => cat.id === activeCategory);
    }
    
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
        ),
      })).filter(category => category.questions.length > 0);
    }
    
    return filtered;
  }, [searchTerm, activeCategory]);

  const totalQuestions = FAQS.reduce((acc, cat) => acc + cat.questions.length, 0);
  const filteredQuestionsCount = filteredFaqs.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation FAQ" className="bg-card border-b sticky top-0 z-40">
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
                <span className="font-semibold">FAQ</span>
              </div>
              <Badge variant="secondary" className="hidden md:inline-flex">
                {totalQuestions} questions
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/help">Centre d'aide</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retour au centre d'aide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/support">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Support
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Contacter le support</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold">Questions Fréquentes</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Trouvez rapidement des réponses à vos questions
            </p>
          </header>

          {/* Search */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg"
                  aria-label="Rechercher dans la FAQ"
                />
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {filteredQuestionsCount} résultat(s) pour "{searchTerm}"
                </p>
              )}
            </CardHeader>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filtrer par catégorie">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              Toutes
            </Button>
            {FAQS.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="gap-1"
                >
                  <IconComponent className="h-3 w-3" aria-hidden="true" />
                  {cat.category}
                </Button>
              );
            })}
          </div>

          {/* FAQ Content */}
          {filteredFaqs.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />
                    {category.category}
                    <Badge variant="outline" className="ml-auto">
                      {category.questions.length} questions
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`${category.id}-${qIdx}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}

          {/* No Results */}
          {filteredFaqs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                <p className="text-lg font-medium mb-2">Aucune question trouvée</p>
                <p className="text-muted-foreground mb-4">
                  Essayez un autre terme de recherche ou contactez notre support.
                </p>
                <Button asChild>
                  <Link to="/support">
                    <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                    Contacter le support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* CTA Support */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="py-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Vous n'avez pas trouvé votre réponse ?</h2>
              <p className="text-muted-foreground mb-4">
                Notre équipe support est disponible 24/7 pour vous aider.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/support">
                    <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                    Contacter le support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/help">
                    Centre d'aide
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-success" aria-hidden="true" />
              <span>Vos questions sont traitées de manière confidentielle</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground" aria-label="Liens du pied de page">
            <Link to="/help" className="hover:text-foreground">Centre d'aide</Link>
            <Link to="/support" className="hover:text-foreground">Support</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}