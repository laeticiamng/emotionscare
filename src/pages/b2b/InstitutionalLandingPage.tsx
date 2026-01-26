/**
 * InstitutionalLandingPage - Page d'entrée B2B EmotionsCare
 * Positionnement éthique clair : bien-être, pas surveillance
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Building2,
  Heart,
  Shield,
  Music,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  QrCode,
  Link2,
  KeyRound,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

// Ce que EmotionsCare EST et N'EST PAS
const positioning = {
  is: [
    { text: 'Un espace de régulation émotionnelle', icon: Heart },
    { text: 'Un outil de bien-être volontaire', icon: Sparkles },
    { text: 'Une aide à la détente et à la sérénité', icon: Music },
    { text: 'Anonyme et confidentiel', icon: Lock },
  ],
  isNot: [
    { text: 'Un outil de surveillance', icon: Eye },
    { text: 'Un système d\'évaluation individuelle', icon: XCircle },
    { text: 'Un remplacement du soin médical', icon: AlertTriangle },
    { text: 'Un outil de mesure de performance', icon: XCircle },
  ],
};

const accessMethods = [
  {
    id: 'link',
    title: 'Lien Organisation',
    description: 'Accès via un lien unique fourni par votre entreprise',
    icon: Link2,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'qr',
    title: 'QR Code',
    description: 'Scannez le QR code affiché dans vos locaux',
    icon: QrCode,
    color: 'bg-info/10 text-info',
  },
  {
    id: 'sso',
    title: 'Connexion SSO',
    description: 'Authentification via votre compte entreprise',
    icon: KeyRound,
    color: 'bg-success/10 text-success',
  },
];

const useCases = [
  { name: 'Hôpitaux & Établissements de santé', icon: '🏥' },
  { name: 'Entreprises à forte charge mentale', icon: '🏢' },
  { name: 'Universités & Écoles', icon: '🎓' },
  { name: 'Institutions publiques', icon: '🏛️' },
  { name: 'Équipes projet sous pression', icon: '⚡' },
];

const ethicalCommitments = [
  {
    title: 'Anonymisation stricte',
    description: 'Aucune donnée personnelle n\'est partagée avec l\'employeur. Seules des tendances agrégées anonymes sont disponibles.',
    icon: EyeOff,
  },
  {
    title: 'Utilisation volontaire',
    description: 'L\'accès à EmotionsCare est toujours volontaire. Aucune obligation, aucune pression.',
    icon: Heart,
  },
  {
    title: 'Pas de profilage',
    description: 'Nous ne créons jamais de profils individuels. L\'objectif est collectif, pas le contrôle.',
    icon: Shield,
  },
  {
    title: 'Transparence totale',
    description: 'Vous savez exactement quelles données sont collectées et comment elles sont utilisées.',
    icon: CheckCircle,
  },
];

export default function InstitutionalLandingPage() {
  const navigate = useNavigate();

  usePageSEO({
    title: 'EmotionsCare Entreprises & Institutions - Bien-être émotionnel collectif',
    description: 'Solution de bien-être émotionnel pour les entreprises. Anonyme, éthique, sans surveillance. Espace de régulation, pas d\'évaluation.',
    keywords: 'bien-être entreprise, santé mentale travail, QVT, QVCT, prévention burn-out',
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Aller au contenu principal
      </a>

      {/* Hero Section avec positionnement clair */}
      <section className="relative py-16 lg:py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-6xl" id="main-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-6 px-4 py-2" variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Entreprises & Institutions
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Bien-être émotionnel</span>
              <br />
              pour vos équipes
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              EmotionsCare accompagne vos collaborateurs dans leur équilibre émotionnel,
              sans jamais surveiller, évaluer ou profiler.
            </p>

            {/* Bannière éthique */}
            <Alert className="max-w-2xl mx-auto border-primary/30 bg-primary/5">
              <Shield className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary font-semibold">
                Espace de régulation, pas d'évaluation
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                EmotionsCare ne transmet aucune donnée personnelle à l'employeur.
                Utilisation volontaire, anonymat garanti.
              </AlertDescription>
            </Alert>
          </motion.div>

          {/* Ce que EmotionsCare EST vs N'EST PAS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {/* EST */}
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-6 w-6" />
                  EmotionsCare EST
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positioning.is.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-success/10">
                      <item.icon className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* N'EST PAS */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-6 w-6" />
                  EmotionsCare N'EST PAS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positioning.isNot.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-destructive/10">
                      <item.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <span className="text-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate('/b2b/access')}
            >
              Accéder à l'espace bien-être
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/b2b/demo')}
            >
              Demander une démo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modes d'accès */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Accès simple et sécurisé
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plusieurs options pour accéder à EmotionsCare selon votre organisation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {accessMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={cn('p-3 rounded-xl w-fit', method.color)}>
                      <method.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements éthiques */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Cadre éthique
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Nos engagements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une charte éthique stricte pour protéger vos collaborateurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {ethicalCommitments.map((commitment, index) => (
              <motion.div
                key={commitment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <commitment.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{commitment.title}</CardTitle>
                        <CardDescription className="text-base">
                          {commitment.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Pour qui ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              EmotionsCare s'adapte à tous les environnements professionnels
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-base px-4 py-2 cursor-default"
                >
                  <span className="mr-2">{useCase.icon}</span>
                  {useCase.name}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Prêt à prendre soin de vos équipes ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Déployez EmotionsCare dans votre organisation en quelques jours.
              Sans complexité, sans risque, avec un impact positif immédiat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={() => navigate('/contact')}
              >
                Nous contacter
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/b2b/access')}
              >
                Accès institutionnel
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
