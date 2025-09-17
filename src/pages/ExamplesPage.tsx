import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Form, 
  Database, 
  Table, 
  MessageSquare, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle,
  Code2
} from 'lucide-react';
import { UnifiedPageLayout as PageLayout } from '@/components/ui/unified-page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Page d'exemples démontrant les composants et patterns de l'application
 * Sert de documentation vivante et de validation des fonctionnalités
 */
const ExamplesPage: React.FC = () => {
  const examples = [
    {
      id: 'forms',
      title: 'Formulaires avancés',
      description: 'Formulaires accessibles avec validation en temps réel, gestion d\'erreurs contextuelles et états de chargement.',
      icon: Form,
      href: '/examples/forms',
      features: ['Validation Zod', 'Accessibilité WCAG', 'Messages d\'erreur contextuels', 'États de chargement'],
      status: 'ready'
    },
    {
      id: 'api',
      title: 'Gestion des APIs',
      description: 'Patterns pour les appels API avec retry logic, transformation d\'erreurs et gestion d\'état optimisée.',
      icon: Database,
      href: '/examples/api',
      features: ['Client API centralisé', 'Retry automatique', 'Messages utilisateur', 'Hooks personnalisés'],
      status: 'ready'
    },
    {
      id: 'tables',
      title: 'Tables de données',
      description: 'Tables interactives avec tri, filtrage, pagination et actions contextuelles.',
      icon: Table,
      href: '/examples/tables',
      features: ['Tri multi-colonnes', 'Recherche globale', 'Pagination', 'Actions en lot'],
      status: 'coming-soon'
    },
    {
      id: 'dialogs',
      title: 'Dialogs et modales',
      description: 'Dialogs accessibles avec gestion du focus, confirmation d\'actions et états de chargement.',
      icon: MessageSquare,
      href: '/examples/dialogs',
      features: ['Focus management', 'Confirmation d\'actions', 'Échappement au clavier', 'Overlay personnalisable'],
      status: 'ready'
    },
    {
      id: 'security',
      title: 'Sécurité et validation',
      description: 'Démonstration des pratiques de sécurité, validation des données et gestion des permissions.',
      icon: Shield,
      href: '/examples/security',
      features: ['Validation côté client/serveur', 'Sanitisation des données', 'Gestion des rôles', 'Logs d\'audit'],
      status: 'coming-soon'
    },
    {
      id: 'performance',
      title: 'Optimisations performance',
      description: 'Techniques d\'optimisation : lazy loading, mise en cache, compression et monitoring.',
      icon: Zap,
      href: '/examples/performance',
      features: ['Lazy loading', 'Mise en cache intelligente', 'Code splitting', 'Web Vitals'],
      status: 'coming-soon'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      ready: {
        label: 'Prêt',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800'
      },
      'coming-soon': {
        label: 'Bientôt',
        variant: 'secondary' as const,
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800'
      },
      'in-progress': {
        label: 'En cours',
        variant: 'outline' as const,
        icon: Code2,
        className: 'bg-blue-100 text-blue-800'
      }
    };
    return configs[status as keyof typeof configs] || configs.ready;
  };

  return (
    <PageLayout
      title="Exemples et patterns"
      description="Documentation vivante des composants et bonnes pratiques de l'application"
      backUrl="/"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <Code2 className="w-5 h-5 mr-2 text-primary" />
            À propos de ces exemples
          </h2>
          <p className="text-muted-foreground mb-4">
            Cette section présente les composants et patterns utilisés dans l'application. 
            Chaque exemple démontre les bonnes pratiques d'accessibilité, de performance et d'expérience utilisateur.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Accessibilité WCAG AA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Sécurité intégrée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span>Performance optimisée</span>
            </div>
          </div>
        </div>

        {/* Grille des exemples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => {
            const statusConfig = getStatusConfig(example.status);
            const IconComponent = example.icon;
            const StatusIcon = statusConfig.icon;
            const isReady = example.status === 'ready';

            return (
              <Card 
                key={example.id}
                className={`group transition-all duration-200 ${
                  isReady ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-75'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    
                    <Badge className={statusConfig.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg">
                    {example.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm leading-relaxed">
                    {example.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Fonctionnalités */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Fonctionnalités
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {example.features.map((feature, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  {isReady ? (
                    <Button
                      asChild
                      className="w-full"
                      variant="outline"
                    >
                      <Link to={example.href}>
                        Voir l'exemple
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full"
                      variant="outline"
                    >
                      Bientôt disponible
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section d'architecture */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Principes d'architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Séparation des responsabilités</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Logique métier centralisée dans les services</li>
                <li>Composants UI purement présentationnels</li>
                <li>Hooks personnalisés pour la logique réutilisable</li>
                <li>Types TypeScript stricts pour la sécurité</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Expérience utilisateur</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>États de chargement et d'erreur explicites</li>
                <li>Messages d'erreur orientés utilisateur</li>
                <li>Actions réversibles avec confirmation</li>
                <li>Navigation cohérente et prévisible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExamplesPage;