// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { NavNode, NavContext } from '@/types/nav';
import { useNavAction } from '@/hooks/useNavAction';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { logger } from '@/lib/logger';

interface NavButtonProps {
  node: NavNode;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showLabel?: boolean;
  showBadge?: boolean;
}

/**
 * Bouton de navigation conforme - jamais "mort"
 * Toujours une action ou un fallback explicite
 */
export function NavButton({ 
  node, 
  variant = 'ghost',
  size = 'default',
  className,
  showLabel = true,
  showBadge = true,
}: NavButtonProps) {
  const { executeAction, getContext } = useNavAction();
  const { isAuthenticated } = useAuth();
  
  const context = getContext();
  const isGuarded = Boolean(node.guard);
  const guardPassed = checkGuard(node, context);
  const hasAction = Boolean(node.action);
  const hasChildren = Boolean(node.children?.length);
  
  // Un bouton est considéré comme "actif" s'il a une action ou des enfants
  const isActive = hasAction || hasChildren;
  
  // Un bouton est disabled s'il est gardé mais que la garde ne passe pas
  const isDisabled = isGuarded && !guardPassed;
  
  const handleClick = async () => {
    if (isDisabled) {
      // Action de fallback pour les boutons gardés
      handleGuardedAction(node, context);
      return;
    }

    if (node.action) {
      await executeAction(node.action);
    } else if (hasChildren) {
      // Ouvrir sous-menu ou naviguer vers la première action disponible
      logger.debug('Navigation action', { type, path, nodeId: node.id }, 'UI');
      if (path) window.location.href = path;
    } else {
      // Fallback pour les actions non encore implémentées
      handleFallbackAction(node);
    }
  };

  const getButtonContent = () => {
    const IconComponent = node.icon ? (Icons as any)[node.icon] : null;
    
    return (
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {showLabel && (
          <span className={cn(
            "text-sm font-medium",
            !showLabel && "sr-only"
          )}>
            {getNodeLabel(node)}
          </span>
        )}
        {showBadge && node.meta?.badge && (
          <Badge variant="secondary" className="text-xs">
            {node.meta.badge}
          </Badge>
        )}
        {showBadge && node.meta?.premium && (
          <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
            PRO
          </Badge>
        )}
      </div>
    );
  };

  const button = (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        "justify-start",
        isDisabled && "opacity-60 cursor-not-allowed",
        !isActive && "opacity-75",
        className
      )}
      aria-label={getNodeAriaLabel(node, context)}
    >
      {getButtonContent()}
    </Button>
  );

  // Tooltip pour expliquer pourquoi un bouton est désactivé ou son état
  const tooltipContent = getTooltipContent(node, context, isDisabled);
  
  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              {tooltipContent}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

/**
 * Utilitaires pour la logique de garde et les fallbacks
 */
function checkGuard(node: NavNode, context: NavContext): boolean {
  if (!node.guard) return true;

  if (node.guard.requiresAuth && !context.isAuthenticated) {
    return false;
  }

  if (node.guard.roles && context.user?.role) {
    if (!node.guard.roles.includes(context.user.role)) {
      return false;
    }
  }

  if (node.guard.featureFlag) {
    const flagEnabled = context.featureFlags?.[node.guard.featureFlag];
    if (!flagEnabled) return false;
  }

  if (node.guard.predicate) {
    return node.guard.predicate();
  }

  return true;
}

function handleGuardedAction(node: NavNode, context: NavContext) {
  if (node.guard?.requiresAuth && !context.isAuthenticated) {
    // Rediriger vers l'authentification
    window.location.href = '/mode-selection';
    return;
  }

  if (node.guard?.roles && context.user?.role) {
    // Montrer un message d'accès insuffisant
    alert(`Accès requis: ${node.guard.roles.join(', ')}`);
    return;
  }

  // Fallback générique
  alert('Cette fonctionnalité n\'est pas disponible pour le moment.');
}

function handleFallbackAction(node: NavNode) {
  // Action de contournement pour les fonctionnalités non implémentées
  const message = `La fonctionnalité "${getNodeLabel(node)}" est en cours de déploiement.

Voulez-vous :
• Explorer d'autres fonctionnalités ?
• Consulter le centre d'aide ?
• Nous envoyer vos suggestions ?`;

  if (confirm(message)) {
    logger.info('Community action triggered', null, 'UI');
    window.location.href = '/help';
  }
}

function getNodeLabel(node: NavNode): string {
  // Intégration i18n prévue pour une version future
  // const { t } = useTranslation();
  const labels: Record<string, string> = {
    'nav.home': 'Accueil',
    'nav.scan': 'Scan Émotionnel',
    'nav.music': 'Musicothérapie',
    'nav.coach': 'Coach IA',
    'nav.journal': 'Journal',
    'nav.learn': 'Apprentissage',
    'nav.learn.ecos': 'ECOS',
    'nav.learn.edn': 'EDN',
    'nav.analytics': 'Analytics',
    'nav.analytics.weekly': 'Barres Hebdo',
    'nav.analytics.heatmap': 'Scores & vibes',
    'nav.wellness': 'Bien-être',
    'nav.wellness.breathwork': 'Respiration',
    'nav.wellness.vr': 'VR',
    'nav.wellness.mood-mixer': 'Mood Mixer',
    'nav.games': 'Jeux',
    'nav.games.gamification': 'Gamification',
    'nav.games.ambition': 'Ambition Arcade',
    'nav.account': 'Compte',
    'nav.account.profile': 'Profil',
    'nav.account.preferences': 'Préférences',
    'nav.account.activity': 'Historique',
    'nav.account.notifications': 'Notifications',
    'nav.auth': 'Connexion',
    'nav.auth.login': 'Se connecter',
    'nav.auth.register': 'S\'inscrire',
    'nav.auth.choose-mode': 'Choisir le mode',
    'nav.help': 'Aide',
    'nav.help.center': 'Centre d\'aide',
    'nav.help.feedback': 'Feedback',
    'nav.help.contact': 'Contact',
  };
  
  return labels[node.labelKey] || node.labelKey;
}

function getNodeAriaLabel(node: NavNode, context: NavContext): string {
  const label = getNodeLabel(node);
  
  if (node.guard?.requiresAuth && !context.isAuthenticated) {
    return `${label} (connexion requise)`;
  }
  
  if (node.meta?.premium) {
    return `${label} (fonctionnalité premium)`;
  }
  
  return label;
}

function getTooltipContent(node: NavNode, context: NavContext, isDisabled: boolean): string | null {
  if (isDisabled) {
    if (node.guard?.requiresAuth && !context.isAuthenticated) {
      return "Connectez-vous pour accéder à cette fonctionnalité";
    }
    if (node.guard?.roles) {
      return `Accès réservé aux rôles: ${node.guard.roles.join(', ')}`;
    }
    return "Cette fonctionnalité n'est pas disponible";
  }
  
  if (node.meta?.description) {
    return node.meta.description;
  }
  
  return null;
}