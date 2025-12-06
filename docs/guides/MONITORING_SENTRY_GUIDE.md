# 🔍 Guide Monitoring Sentry - Edge Functions RGPD

## Configuration Sentry

### 1. Ajouter le Secret Sentry DSN

Le système de secrets Lovable/Supabase doit contenir `SENTRY_DSN`.

```bash
# Via l'interface Supabase
# Settings > Edge Functions > Secrets
# Ajouter: SENTRY_DSN=https://your_key@o123456.ingest.sentry.io/789012
```

Ou via CLI :
```bash
supabase secrets set SENTRY_DSN=your_dsn_here
```

### 2. Variables d'Environnement Optionnelles

```bash
# Environnement (production, staging, development)
SENTRY_ENVIRONMENT=production

# Version/Release pour tracking
SENTRY_RELEASE=v1.0.0

# Sample rate des traces (0.1-0.2 recommandé)
SENTRY_TRACES_SAMPLE_RATE=0.15

# Debug mode
DEBUG=true
```

## Utilisation dans les Edge Functions

### Exemple : Wrapper Simple

```typescript
// supabase/functions/my-rgpd-function/index.ts
import { serve } from '../_shared/serve.ts';
import { withMonitoring, logger } from '../_shared/monitoring-wrapper.ts';

serve(
  withMonitoring('my-rgpd-function', async (req, context) => {
    // Votre logique métier ici
    logger.info('Début du traitement', context);
    
    try {
      const body = await req.json();
      
      // ... traitement ...
      
      logger.info('Traitement réussi', context, { itemsProcessed: 42 });
      
      return { success: true, data: {} };
    } catch (error) {
      logger.error('Erreur traitement', error, context);
      throw error;
    }
  })
);
```

### Exemple : Avec Appel Supabase

```typescript
import { serve } from '../_shared/serve.ts';
import { withMonitoring, withSupabaseCall, logger } from '../_shared/monitoring-wrapper.ts';
import { createClient } from '../_shared/supabase.ts';

serve(
  withMonitoring('compliance-audit-latest', async (req, context) => {
    const supabase = createClient(req);
    
    // Appel Supabase avec monitoring
    const audit = await withSupabaseCall(
      'fetch_latest_audit',
      () => supabase
        .from('compliance_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      context
    );
    
    logger.info('Audit récupéré', context, { auditId: audit.id });
    
    return { audit };
  })
);
```

### Exemple : Mesure de Performance

```typescript
import { measureTime } from '../_shared/monitoring-wrapper.ts';

// Mesurer une opération spécifique
const results = await measureTime(
  'complex_calculation',
  async () => {
    // Opération coûteuse
    return await heavyComputation();
  },
  context
);
```

## Fonctionnalités du Monitoring

### 1. Logs Structurés

Tous les logs sont structurés avec :
- ✅ Nom de la fonction
- ✅ Request ID unique
- ✅ User ID (si authentifié)
- ✅ Timestamp
- ✅ Metadata personnalisée

```typescript
logger.info('Message', context, { customData: 'value' });
// ℹ️  [function-name] Message { customData: 'value' }
```

### 2. Breadcrumbs Sentry

Chaque action importante est enregistrée :
- Requêtes HTTP reçues
- Appels Supabase
- Opérations métier
- Erreurs capturées

### 3. Capture d'Erreurs

Les erreurs sont automatiquement :
- Loggées dans la console
- Envoyées à Sentry avec contexte complet
- Sanitizées (emails, UUIDs, téléphones masqués)

### 4. Métriques de Performance

- Temps de réponse total
- Temps par opération
- Headers de performance (`X-Response-Time`)

## Dashboard Sentry

Une fois configuré, vous verrez dans Sentry :

### Issues
- Stack traces complètes
- Contexte de la requête
- User ID impliqué
- Breadcrumbs d'activité

### Performance
- Transactions par fonction
- Durée P50, P75, P95, P99
- Opérations lentes identifiées

### Releases
- Suivi des déploiements
- Erreurs par version
- Comparaison entre releases

## Alertes Automatiques

### Configuration des Alertes Sentry

1. **Alertes Erreurs Critiques**
```
IF error rate > 5% 
THEN notify #alerts-rgpd
```

2. **Alertes Performance**
```
IF p95 response time > 5s
THEN notify #performance
```

3. **Alertes Volume**
```
IF requests > 1000/min
THEN notify #traffic
```

### Intégrations Disponibles

- **Slack** : Notifications temps réel
- **PagerDuty** : Alertes on-call
- **Email** : Résumés quotidiens/hebdomadaires
- **Webhooks** : Intégrations custom

## Tests du Monitoring

### Test 1 : Erreur Simple

```typescript
// Tester la capture d'erreur
serve(
  withMonitoring('test-function', async (req, context) => {
    logger.info('Démarrage test', context);
    throw new Error('Test error pour Sentry');
  })
);
```

Appeler la fonction et vérifier que l'erreur apparaît dans Sentry.

### Test 2 : Performance

```bash
# Lancer des tests de charge
k6 run tests/load/k6-edge-functions-rgpd.js
```

Vérifier dans Sentry > Performance les métriques de réponse.

### Test 3 : Breadcrumbs

```typescript
serve(
  withMonitoring('test-breadcrumbs', async (req, context) => {
    logger.info('Étape 1', context);
    await someOperation();
    
    logger.info('Étape 2', context);
    await anotherOperation();
    
    logger.warn('Attention', context, { detail: 'something' });
    
    throw new Error('Fin du test');
  })
);
```

Dans Sentry, vérifier que toutes les étapes apparaissent dans les breadcrumbs.

## Edge Functions RGPD à Monitorer

### Priorité Haute (Critique)

1. **compliance-audit/latest**
   ```typescript
   import { withMonitoring } from '../_shared/monitoring-wrapper.ts';
   
   serve(withMonitoring('compliance-audit-latest', handler));
   ```

2. **gdpr-alert-detector**
   ```typescript
   serve(withMonitoring('gdpr-alert-detector', handler));
   ```

3. **dsar-handler**
   ```typescript
   serve(withMonitoring('dsar-handler', handler));
   ```

### Priorité Moyenne

4. **compliance-audit/history**
5. **gdpr-compliance-score**
6. **gdpr-data-export**
7. **gdpr-data-deletion**

### Priorité Basse

8. **health-check**
9. **gdpr-assistant**
10. Autres fonctions non critiques

## Bonnes Pratiques

### ✅ Faire

- Utiliser `withMonitoring` pour toutes les Edge Functions critiques
- Logger les étapes importantes avec `logger.info`
- Utiliser `measureTime` pour les opérations coûteuses
- Ajouter du contexte métier dans les logs
- Tester les erreurs en développement

### ❌ Ne pas faire

- Logger des données sensibles (passwords, tokens)
- Surcharger les logs (éviter les boucles)
- Ignorer les warnings Sentry
- Oublier de tester les alertes
- Laisser `DEBUG=true` en production

## Monitoring du Dashboard de Santé

Le `SystemHealthDashboard` vérifie automatiquement toutes les 5 minutes :

- ✅ Connexion Supabase
- ✅ Tables RGPD (privacy_policies, etc.)
- ✅ Edge Functions critiques
- ✅ LocalStorage

Visible sur : `/system-health` (à ajouter au routing)

## Métriques Clés à Surveiller

### Disponibilité
- **Target** : 99.9% uptime
- **Alerte** : < 99.5%

### Performance
- **P95** : < 2s
- **P99** : < 5s
- **Alerte** : P95 > 3s

### Erreurs
- **Rate** : < 1%
- **Alerte** : > 5%

### Volume
- **Normal** : 100-1000 req/min
- **Alerte** : > 10,000 req/min

## Coûts Sentry

### Plan Gratuit
- 5,000 erreurs/mois
- 10,000 transactions/mois
- Rétention 30 jours

### Plan Developer ($26/mois)
- 50,000 erreurs/mois
- 100,000 transactions/mois
- Rétention 90 jours

### Optimisation
- Sample rate 10-20% (`SENTRY_TRACES_SAMPLE_RATE=0.15`)
- Filtrer les erreurs non critiques
- Utiliser les quotas par projet

## Support

### Documentation
- [Sentry Deno SDK](https://docs.sentry.io/platforms/javascript/guides/deno/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### Debugging
```bash
# Voir les logs Edge Function
supabase functions logs <function-name>

# Avec filtre
supabase functions logs <function-name> --filter="error"

# Temps réel
supabase functions logs <function-name> --follow
```

---

**Commandes Rapides** :
```bash
# Ajouter le secret Sentry
supabase secrets set SENTRY_DSN=your_dsn

# Déployer une fonction avec monitoring
supabase functions deploy compliance-audit

# Voir les logs
supabase functions logs compliance-audit --follow

# Tester avec charge
k6 run tests/load/k6-edge-functions-rgpd.js
```

**Dernière mise à jour** : 2025-11-10
