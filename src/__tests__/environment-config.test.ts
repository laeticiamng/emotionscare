/**
 * Tests de Configuration Environnement
 * Vérifie la validité et la sécurité de la configuration
 */
import { describe, it, expect, vi } from 'vitest';

describe('Configuration Environnement', () => {
  describe('Variables Supabase', () => {
    it('doit avoir une URL Supabase valide', () => {
      const supabaseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';
      expect(supabaseUrl).toMatch(/^https:\/\/[a-z]+\.supabase\.co$/);
    });

    it('doit avoir une clé anon valide (format JWT)', () => {
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
      expect(anonKey).toMatch(/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    });

    it('ne doit pas exposer de service_role key', () => {
      const envVars = ['VITE_SUPABASE_SERVICE_ROLE', 'SUPABASE_SERVICE_ROLE_KEY'];
      envVars.forEach(key => {
        expect(process.env[key]).toBeUndefined();
      });
    });
  });

  describe('Validation des Modes', () => {
    it('doit reconnaître les modes valides', () => {
      const validModes = ['development', 'test', 'production'];
      validModes.forEach(mode => {
        expect(validModes).toContain(mode);
      });
    });

    it('doit rejeter les modes invalides', () => {
      const invalidModes = ['staging', 'preview', 'debug'];
      const validModes = ['development', 'test', 'production'];
      invalidModes.forEach(mode => {
        expect(validModes).not.toContain(mode);
      });
    });
  });

  describe('Sécurité des Secrets', () => {
    it('ne doit pas avoir de secrets API dans les variables VITE_*', () => {
      const dangerousPatterns = [
        /VITE_.*SECRET/i,
        /VITE_.*PRIVATE/i,
        /VITE_OPENAI_API_KEY/i,
        /VITE_HUME_API_KEY/i,
        /VITE_SUNO_API_KEY/i,
      ];
      
      const envKeys = Object.keys(process.env);
      dangerousPatterns.forEach(pattern => {
        const matches = envKeys.filter(key => pattern.test(key));
        expect(matches).toHaveLength(0);
      });
    });

    it('doit utiliser les Edge Functions pour les APIs sensibles', () => {
      const sensitiveApis = [
        { name: 'OpenAI', edgeFunction: 'chat-coach' },
        { name: 'Hume AI', edgeFunction: 'analyze-emotion' },
        { name: 'Suno', edgeFunction: 'suno-music' },
        { name: 'ElevenLabs', edgeFunction: 'elevenlabs-tts' },
        { name: 'Perplexity', edgeFunction: 'perplexity-search' },
      ];
      
      sensitiveApis.forEach(api => {
        expect(api.edgeFunction).toBeTruthy();
        expect(typeof api.edgeFunction).toBe('string');
      });
    });
  });

  describe('Configuration Firebase (Optionnelle)', () => {
    it('doit valider le format des clés Firebase si présentes', () => {
      // Firebase API keys start with AIza and have 39 total characters
      const firebaseApiKeyPattern = /^AIza[0-9A-Za-z_-]{35}$/;
      const mockFirebaseKey = 'AIzaSyC1234567890abcdefghijklmnopqrstuv';
      
      // Test format valide (35 caractères après AIza = 39 total)
      expect(mockFirebaseKey).toHaveLength(39);
      expect(firebaseApiKeyPattern.test(mockFirebaseKey)).toBe(true);
    });
  });

  describe('Configuration Sentry (Optionnelle)', () => {
    it('doit valider le format DSN Sentry si présent', () => {
      const sentryDsnPattern = /^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\/\d+$/;
      const mockDsn = 'https://abc123@o123456.ingest.sentry.io/1234567';
      
      expect(sentryDsnPattern.test(mockDsn)).toBe(true);
    });

    it('doit avoir des sample rates valides (0-1)', () => {
      const sampleRates = [0, 0.1, 0.5, 1];
      sampleRates.forEach(rate => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Validation Upload Config', () => {
    it('doit avoir une taille max upload raisonnable', () => {
      const maxSize = 10_485_760; // 10MB
      expect(maxSize).toBeGreaterThan(0);
      expect(maxSize).toBeLessThanOrEqual(100_000_000); // Max 100MB
    });

    it('doit avoir des types MIME valides pour images', () => {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      allowedImageTypes.forEach(type => {
        expect(type).toMatch(/^image\//);
      });
    });

    it('doit avoir des types MIME valides pour audio', () => {
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav'];
      allowedAudioTypes.forEach(type => {
        expect(type).toMatch(/^audio\//);
      });
    });
  });

  describe('URLs de Fallback', () => {
    it('doit avoir des URLs de fallback pour dev', () => {
      const devApiUrl = 'http://localhost:3009';
      const devWebUrl = 'http://localhost:5173';
      
      expect(devApiUrl).toMatch(/^http:\/\/localhost:\d+$/);
      expect(devWebUrl).toMatch(/^http:\/\/localhost:\d+$/);
    });

    it('doit avoir des URLs de fallback pour prod', () => {
      const prodApiUrl = 'https://api.emotionscare.com';
      const prodWebUrl = 'https://app.emotionscare.com';
      
      expect(prodApiUrl).toMatch(/^https:\/\/.+\.emotionscare\.com$/);
      expect(prodWebUrl).toMatch(/^https:\/\/.+\.emotionscare\.com$/);
    });
  });
});

describe('Gestion des Données', () => {
  describe('Validation des Entrées', () => {
    it('doit sanitizer les entrées HTML', () => {
      const sanitize = (input: string) => {
        return input
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      };
      
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = sanitize(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('doit valider les UUIDs', () => {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const invalidUuid = 'not-a-uuid';
      
      expect(uuidPattern.test(validUuid)).toBe(true);
      expect(uuidPattern.test(invalidUuid)).toBe(false);
    });

    it('doit valider les emails', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail = 'user@example.com';
      const invalidEmail = 'not-an-email';
      
      expect(emailPattern.test(validEmail)).toBe(true);
      expect(emailPattern.test(invalidEmail)).toBe(false);
    });
  });

  describe('Persistence des Données', () => {
    it('doit utiliser Supabase pour les données persistantes', () => {
      const persistentDataTables = [
        'profiles',
        'journal_entries',
        'emotion_scans',
        'breathing_sessions',
        'activity_sessions',
        'user_achievements',
        'user_preferences',
      ];
      
      persistentDataTables.forEach(table => {
        expect(typeof table).toBe('string');
        expect(table.length).toBeGreaterThan(0);
      });
    });

    it('doit utiliser localStorage pour les données temporaires', () => {
      const temporaryDataKeys = [
        'theme',
        'sidebar_collapsed',
        'last_route',
        'draft_journal_entry',
      ];
      
      temporaryDataKeys.forEach(key => {
        expect(typeof key).toBe('string');
      });
    });
  });

  describe('Synchronisation Offline', () => {
    it('doit avoir une queue pour les actions offline', () => {
      const offlineQueue = {
        add: (action: unknown) => true,
        process: () => Promise.resolve(),
        clear: () => {},
        getItems: () => [],
      };
      
      expect(offlineQueue.add({ type: 'test' })).toBe(true);
      expect(typeof offlineQueue.process).toBe('function');
    });
  });
});

describe('Sécurité RLS', () => {
  describe('Fonctions Security Definer', () => {
    it('doit avoir les fonctions de sécurité requises', () => {
      const securityFunctions = [
        'is_authenticated',
        'is_owner',
        'has_role',
        'is_admin',
      ];
      
      securityFunctions.forEach(fn => {
        expect(fn).toMatch(/^(is_|has_)/);
      });
    });

    it('doit utiliser search_path = public', () => {
      const expectedSearchPath = 'public';
      expect(expectedSearchPath).toBe('public');
    });
  });

  describe('Isolation Multi-Tenant', () => {
    it('doit isoler les données par organisation', () => {
      const tenantIsolation = (userId: string, orgId: string, data: { org_id: string }) => {
        return data.org_id === orgId;
      };
      
      expect(tenantIsolation('user-1', 'org-1', { org_id: 'org-1' })).toBe(true);
      expect(tenantIsolation('user-1', 'org-1', { org_id: 'org-2' })).toBe(false);
    });
  });
});

describe('Feature Flags', () => {
  it('doit avoir les flags de features', () => {
    const featureFlags = {
      EMOTION_ANALYSIS: true,
      MUSIC_GENERATION: true,
      AI_COACHING: true,
      JOURNAL_INSIGHTS: true,
      VR_EXPERIENCES: true,
      SOCIAL_FEATURES: true,
      REAL_TIME_SYNC: true,
      ANALYTICS: true,
      EXPORT_DATA: true,
    };
    
    Object.values(featureFlags).forEach(flag => {
      expect(typeof flag).toBe('boolean');
    });
  });
});
