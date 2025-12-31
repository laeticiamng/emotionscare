// @ts-nocheck
/**
 * B2BSelectionPage - Sélection du type d'accès B2B
 * Page d'entrée pour les utilisateurs entreprise
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  BarChart3, 
  Shield, 
  Heart, 
  ArrowRight,
  Building2,
  Sparkles,
  Activity,
  Target,
  HelpCircle,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { cn } from '@/lib/utils';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  
  usePageSEO({
    title: 'Espace Entreprise - EmotionsCare B2B',
    description: 'Accédez aux outils de bien-être émotionnel pour votre organisation. Portail collaborateur et administrateur RH.',
    keywords: ['B2B', 'entreprise', 'bien-être', 'RH', 'collaborateur', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const features = {
    collaborateur: [
      { icon: Heart, label: 'Suivi émotionnel personnel' },
      { icon: Sparkles, label: 'Activités bien-être guidées' },
      { icon: Activity, label: 'Scan et journal vocal' },
      { icon: Target, label: 'Objectifs personnalisés' },
    ],
    admin: [
      { icon: BarChart3, label: 'Tableau de bord agrégé' },
      { icon: Users, label: 'Vue équipes anonymisée' },
      { icon: Shield, label: 'Rapports conformes RGPD' },
      { icon: Target, label: 'Indicateurs bien-être' },
    ],
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold">EmotionsCare</h2>
                <span className="text-xs text-muted-foreground">Solutions Entreprise</span>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/help')}>
                    <HelpCircle className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Aide</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 gap-1">
              <Shield className="h-3 w-3" aria-hidden="true" />
              Données sécurisées & conformes RGPD
            </Badge>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Espace Entreprise
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez votre type d'accès pour découvrir les outils de bien-être émotionnel 
              adaptés à votre rôle dans l'organisation.
            </p>
          </div>
          
          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Options d'accès">
            {/* Collaborateur Card */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer overflow-hidden"
              role="listitem"
              onClick={() => navigate('/login?segment=b2b&role=user')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <Badge variant="secondary">Espace personnel</Badge>
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
                <CardDescription className="text-base">
                  Accédez à votre espace bien-être personnel avec des outils de suivi émotionnel confidentiels.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3" aria-label="Fonctionnalités collaborateur">
                  {features.collaborateur.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      {label}
                    </li>
                  ))}
                </ul>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-4">
                  Se connecter
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>

            {/* Admin RH Card */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer overflow-hidden"
              role="listitem"
              onClick={() => navigate('/login?segment=b2b&role=admin')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                    <BarChart3 className="h-6 w-6 text-secondary-foreground" aria-hidden="true" />
                  </div>
                  <Badge variant="outline">Vue agrégée</Badge>
                </div>
                <CardTitle className="text-2xl">Administrateur RH</CardTitle>
                <CardDescription className="text-base">
                  Tableau de bord RH avec indicateurs agrégés et anonymisés pour le suivi d'équipe.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3" aria-label="Fonctionnalités administrateur">
                  {features.admin.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      {label}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors mt-4">
                  Accès Admin
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-success" aria-hidden="true" />
              <span>Vos données personnelles ne sont jamais partagées avec votre employeur</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EmotionsCare — Bien-être émotionnel au travail</p>
        </div>
      </footer>
    </div>
  );
};

export default B2BSelectionPage;