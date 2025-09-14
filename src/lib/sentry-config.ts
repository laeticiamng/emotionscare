/**
 * Configuration Sentry pour traquer spécifiquement les erreurs "Cannot read properties of undefined (reading 'add')"
 */

interface SentryConfig {
  dsn?: string;
  environment: string;
  beforeSend?: (event: any) => any;
  integrations?: any[];
}

/**
 * Configuration Sentry optimisée pour détecter les erreurs critiques
 */
export function initializeSentry(): void {
  // Vérifier si Sentry est disponible
  if (typeof window === 'undefined' || !(window as any).Sentry) {
    console.warn('[Sentry] Sentry SDK not loaded, error tracking disabled');
    return;
  }

  const Sentry = (window as any).Sentry;

  const config: SentryConfig = {
    environment: process.env.NODE_ENV || 'development',
    
    beforeSend(event) {
      // Enrichir les événements liés aux erreurs "reading add"
      if (event.exception?.values?.[0]?.value?.includes("Cannot read properties of undefined (reading 'add')")) {
        // Ajouter des tags spécifiques
        event.tags = {
          ...event.tags,
          errorType: 'reading_add',
          critical: true,
          component: 'dom_manipulation'
        };

        // Ajouter du contexte supplémentaire
        event.contexts = {
          ...event.contexts,
          debugging: {
            suggestion: 'Use safe-helpers.ts functions instead of direct .add() calls',
            documentation: 'Check src/lib/safe-helpers.ts for safe alternatives',
            preventable: true
          }
        };

        // Augmenter la priorité
        event.level = 'error';
      }

      // Filtrer les erreurs en développement si nécessaire
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Sentry Error Report');
        console.error('Error:', event.exception?.values?.[0]?.value);
        console.error('Context:', event.contexts);
        console.error('Tags:', event.tags);
        console.groupEnd();
      }

      return event;
    }
  };

  try {
    Sentry.init(config);
    
    // Capturer les erreurs DOM spécifiques
    Sentry.addGlobalEventProcessor((event: any) => {
      if (event.exception?.values?.[0]?.stacktrace?.frames) {
        const frames = event.exception.values[0].stacktrace.frames;
        
        // Détecter si l'erreur vient d'une manipulation DOM
        const hasDOMFrame = frames.some((frame: any) => 
          frame.filename?.includes('AccessibilityEnhancer') ||
          frame.filename?.includes('theme-provider') ||
          frame.filename?.includes('MoodMixer') ||
          frame.function?.includes('classList')
        );

        if (hasDOMFrame) {
          event.tags = {
            ...event.tags,
            domError: true,
            feature: 'ui_interaction'
          };
        }
      }

      return event;
    });

    console.log('[Sentry] Error tracking initialized for "reading add" errors');
    
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}

/**
 * Reporter manuellement une erreur "reading add" avec contexte
 */
export function reportReadingAddError(
  error: Error,
  context: {
    component?: string;
    operation?: string;
    element?: string;
    attempted?: string;
  }
): void {
  if (typeof window === 'undefined' || !(window as any).Sentry) {
    console.warn('[Sentry] Cannot report error, Sentry not available');
    return;
  }

  const Sentry = (window as any).Sentry;

  Sentry.withScope((scope: any) => {
    scope.setLevel('error');
    scope.setTag('errorType', 'reading_add');
    scope.setTag('critical', true);
    
    if (context.component) scope.setTag('component', context.component);
    if (context.operation) scope.setTag('operation', context.operation);
    
    scope.setContext('errorDetails', {
      element: context.element || 'unknown',
      attempted: context.attempted || 'unknown operation',
      preventable: true,
      solution: 'Use safe-helpers.ts functions'
    });

    Sentry.captureException(error);
  });
}

/**
 * Monitorer les erreurs DOM en temps réel
 */
export function monitorDOMErrors(): void {
  if (typeof window === 'undefined') return;

  // Surveiller les erreurs globales
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && message.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(
        error || new Error(message),
        {
          component: source ? source.split('/').pop() : 'unknown',
          operation: 'dom_manipulation',
          attempted: 'add_operation'
        }
      );
    }

    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Surveiller les promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error?.message?.includes("Cannot read properties of undefined (reading 'add')")) {
      reportReadingAddError(
        error,
        {
          component: 'promise',
          operation: 'async_dom_manipulation'
        }
      );
    }
  });

  console.log('[Sentry] DOM error monitoring active');
}

// Auto-initialisation si Sentry est disponible
if (typeof window !== 'undefined' && (window as any).Sentry) {
  initializeSentry();
  monitorDOMErrors();
}