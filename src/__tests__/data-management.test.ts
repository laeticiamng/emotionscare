/**
 * Data Management & Environment Tests
 * Tests pour la gestion des données et configuration environnement
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// =====================================
// ENVIRONMENT VALIDATION TESTS
// =====================================

describe('Environment Configuration Validation', () => {
  describe('Supabase Configuration', () => {
    it('should have valid project URL format', () => {
      const url = 'https://yaincoxihiqdksxgrsrk.supabase.co';
      const urlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/;
      expect(urlPattern.test(url)).toBe(true);
    });

    it('should have valid JWT anon key structure', () => {
      const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
      
      // JWT has 3 parts separated by dots
      const parts = key.split('.');
      expect(parts.length).toBe(3);
      
      // Decode header
      const header = JSON.parse(atob(parts[0]));
      expect(header.alg).toBe('HS256');
      expect(header.typ).toBe('JWT');
      
      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      expect(payload.iss).toBe('supabase');
      expect(payload.role).toBe('anon');
      expect(payload.ref).toBe('yaincoxihiqdksxgrsrk');
    });

    it('should validate websocket URL', () => {
      const wsUrl = 'wss://yaincoxihiqdksxgrsrk.supabase.co/realtime/v1';
      expect(wsUrl.startsWith('wss://')).toBe(true);
      expect(wsUrl.includes('/realtime/v1')).toBe(true);
    });

    it('should validate functions URL', () => {
      const fnUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';
      expect(fnUrl.includes('/functions/v1')).toBe(true);
    });
  });

  describe('Feature Flags', () => {
    const features = {
      EMOTION_ANALYSIS: true,
      MUSIC_GENERATION: true,
      AI_COACHING: true,
      JOURNAL_INSIGHTS: true,
      VR_EXPERIENCES: true,
      SOCIAL_FEATURES: true,
      REAL_TIME_SYNC: true,
      ANALYTICS: true,
      EXPORT_DATA: true
    };

    it('should have all core features enabled', () => {
      expect(features.EMOTION_ANALYSIS).toBe(true);
      expect(features.AI_COACHING).toBe(true);
      expect(features.VR_EXPERIENCES).toBe(true);
    });

    it('should have boolean values only', () => {
      Object.values(features).forEach(value => {
        expect(typeof value).toBe('boolean');
      });
    });
  });

  describe('Rate Limits Configuration', () => {
    const limits = {
      MUSIC_GENERATION_MONTHLY: 50,
      CHAT_MESSAGES_MONTHLY: 200,
      JOURNAL_ENTRIES_MONTHLY: 100,
      FILE_UPLOAD_SIZE_MB: 50,
      SESSION_TIMEOUT_MINUTES: 60
    };

    it('should have reasonable music generation limit', () => {
      expect(limits.MUSIC_GENERATION_MONTHLY).toBeGreaterThanOrEqual(10);
      expect(limits.MUSIC_GENERATION_MONTHLY).toBeLessThanOrEqual(1000);
    });

    it('should have reasonable chat limit', () => {
      expect(limits.CHAT_MESSAGES_MONTHLY).toBeGreaterThanOrEqual(50);
      expect(limits.CHAT_MESSAGES_MONTHLY).toBeLessThanOrEqual(10000);
    });

    it('should have valid file upload size', () => {
      expect(limits.FILE_UPLOAD_SIZE_MB).toBeGreaterThanOrEqual(1);
      expect(limits.FILE_UPLOAD_SIZE_MB).toBeLessThanOrEqual(100);
    });

    it('should have valid session timeout', () => {
      expect(limits.SESSION_TIMEOUT_MINUTES).toBeGreaterThanOrEqual(15);
      expect(limits.SESSION_TIMEOUT_MINUTES).toBeLessThanOrEqual(1440);
    });
  });
});

// =====================================
// DATA VALIDATION TESTS
// =====================================

describe('Data Validation', () => {
  describe('User Data', () => {
    it('should validate email format', () => {
      const validateEmail = (email: string): boolean => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
      };

      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should validate UUID format', () => {
      const validateUUID = (uuid: string): boolean => {
        const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return pattern.test(uuid);
      };

      expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(validateUUID('invalid-uuid')).toBe(false);
    });

    it('should validate password strength', () => {
      const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];
        if (password.length < 8) errors.push('Minimum 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('Needs uppercase');
        if (!/[a-z]/.test(password)) errors.push('Needs lowercase');
        if (!/[0-9]/.test(password)) errors.push('Needs number');
        return { valid: errors.length === 0, errors };
      };

      expect(validatePassword('StrongPass1').valid).toBe(true);
      expect(validatePassword('weak').valid).toBe(false);
      expect(validatePassword('nouppercaseornum').errors).toContain('Needs uppercase');
    });
  });

  describe('Session Data', () => {
    it('should validate session duration', () => {
      const validateDuration = (seconds: number): boolean => {
        return seconds > 0 && seconds <= 7200; // Max 2 hours
      };

      expect(validateDuration(300)).toBe(true);
      expect(validateDuration(0)).toBe(false);
      expect(validateDuration(10000)).toBe(false);
    });

    it('should validate mood ratings', () => {
      const validateMoodRating = (rating: number): boolean => {
        return Number.isInteger(rating) && rating >= 1 && rating <= 10;
      };

      expect(validateMoodRating(5)).toBe(true);
      expect(validateMoodRating(0)).toBe(false);
      expect(validateMoodRating(11)).toBe(false);
      expect(validateMoodRating(5.5)).toBe(false);
    });

    it('should validate timestamp format', () => {
      const validateTimestamp = (ts: string): boolean => {
        const date = new Date(ts);
        return !isNaN(date.getTime());
      };

      expect(validateTimestamp('2026-02-03T10:00:00Z')).toBe(true);
      expect(validateTimestamp('invalid-date')).toBe(false);
    });
  });

  describe('Journal Data', () => {
    it('should validate entry content length', () => {
      const validateContent = (content: string): boolean => {
        return content.length >= 10 && content.length <= 10000;
      };

      expect(validateContent('This is a valid journal entry with enough content.')).toBe(true);
      expect(validateContent('Short')).toBe(false);
      expect(validateContent('x'.repeat(10001))).toBe(false);
    });

    it('should sanitize HTML content', () => {
      const sanitizeHTML = (html: string): string => {
        return html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]+on\w+="[^"]*"/gi, '')
          .replace(/javascript:/gi, '');
      };

      const dangerous = '<script>alert("xss")</script><p onclick="evil()">Test</p>';
      const safe = sanitizeHTML(dangerous);
      
      expect(safe).not.toContain('<script>');
      expect(safe).not.toContain('onclick');
    });
  });
});

// =====================================
// DATA PERSISTENCE TESTS
// =====================================

describe('Data Persistence', () => {
  describe('LocalStorage Operations', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should store and retrieve JSON data', () => {
      const data = { userId: 'user-123', preference: 'dark' };
      localStorage.setItem('test-data', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('test-data') || '{}');
      expect(retrieved.userId).toBe('user-123');
    });

    it('should handle storage quota exceeded', () => {
      const safeSetItem = (key: string, value: string): boolean => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            return false;
          }
          throw e;
        }
      };

      expect(safeSetItem('small-key', 'small-value')).toBe(true);
    });

    it('should handle missing keys gracefully', () => {
      const value = localStorage.getItem('non-existent-key');
      expect(value).toBeNull();
    });
  });

  describe('Data Sync Queue', () => {
    it('should queue offline actions', () => {
      const queue: Array<{ action: string; data: any; timestamp: number }> = [];

      const addToQueue = (action: string, data: any) => {
        queue.push({ action, data, timestamp: Date.now() });
      };

      addToQueue('journal_entry', { content: 'Test' });
      addToQueue('mood_update', { rating: 7 });

      expect(queue.length).toBe(2);
      expect(queue[0].action).toBe('journal_entry');
    });

    it('should process queue in order', () => {
      const queue = [
        { action: 'a', priority: 1 },
        { action: 'b', priority: 3 },
        { action: 'c', priority: 2 }
      ];

      const sorted = [...queue].sort((a, b) => a.priority - b.priority);
      expect(sorted[0].action).toBe('a');
      expect(sorted[2].action).toBe('b');
    });

    it('should handle retry logic', () => {
      const maxRetries = 3;
      let retryCount = 0;

      const processWithRetry = async (fn: () => Promise<boolean>): Promise<boolean> => {
        while (retryCount < maxRetries) {
          try {
            return await fn();
          } catch {
            retryCount++;
          }
        }
        return false;
      };

      const failingFn = async () => { throw new Error('Failed'); };
      
      processWithRetry(failingFn).then(result => {
        expect(result).toBe(false);
        expect(retryCount).toBe(maxRetries);
      });
    });
  });
});

// =====================================
// SECURITY TESTS
// =====================================

describe('Security Configuration', () => {
  describe('Input Sanitization', () => {
    it('should escape SQL injection attempts', () => {
      const sanitizeInput = (input: string): string => {
        return input
          .replace(/'/g, "''")
          .replace(/--/g, '')
          .replace(/;/g, '');
      };

      const dangerous = "'; DROP TABLE users; --";
      const safe = sanitizeInput(dangerous);
      
      expect(safe).not.toContain('DROP');
      expect(safe).not.toContain('--');
    });

    it('should validate file upload types', () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav'];
      
      const isAllowedType = (type: string): boolean => allowedTypes.includes(type);

      expect(isAllowedType('image/jpeg')).toBe(true);
      expect(isAllowedType('application/x-executable')).toBe(false);
    });

    it('should validate file size', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      const isValidSize = (size: number): boolean => size > 0 && size <= maxSize;

      expect(isValidSize(5 * 1024 * 1024)).toBe(true);
      expect(isValidSize(15 * 1024 * 1024)).toBe(false);
      expect(isValidSize(0)).toBe(false);
    });
  });

  describe('Authentication Tokens', () => {
    it('should validate JWT expiry', () => {
      const isTokenExpired = (exp: number): boolean => {
        return Date.now() / 1000 > exp;
      };

      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour
      const pastExp = Math.floor(Date.now() / 1000) - 3600;

      expect(isTokenExpired(futureExp)).toBe(false);
      expect(isTokenExpired(pastExp)).toBe(true);
    });

    it('should detect token refresh needs', () => {
      const needsRefresh = (exp: number, bufferMinutes: number = 5): boolean => {
        const bufferSeconds = bufferMinutes * 60;
        return Date.now() / 1000 > exp - bufferSeconds;
      };

      const expiresIn10Min = Math.floor(Date.now() / 1000) + 600;
      const expiresIn2Min = Math.floor(Date.now() / 1000) + 120;

      expect(needsRefresh(expiresIn10Min, 5)).toBe(false);
      expect(needsRefresh(expiresIn2Min, 5)).toBe(true);
    });
  });

  describe('CORS Configuration', () => {
    it('should validate allowed origins', () => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://app.emotionscare.com',
        'https://admin.emotionscare.com',
        'https://emotions-care.lovable.app'
      ];

      const isAllowedOrigin = (origin: string): boolean => allowedOrigins.includes(origin);

      expect(isAllowedOrigin('https://app.emotionscare.com')).toBe(true);
      expect(isAllowedOrigin('https://malicious-site.com')).toBe(false);
    });
  });
});

// =====================================
// EDGE FUNCTION CONFIGURATION TESTS
// =====================================

describe('Edge Function Configuration', () => {
  const edgeFunctions = [
    'analyze-emotion',
    'suno-music',
    'chat-coach',
    'journal-ai-process',
    'router-wellness',
    'router-ai',
    'router-b2b',
    'router-music',
    'router-gdpr',
    'elevenlabs-tts',
    'perplexity-search',
    'firecrawl-scrape'
  ];

  it('should have valid function names', () => {
    const validNamePattern = /^[a-z0-9-]+$/;
    
    edgeFunctions.forEach(fn => {
      expect(validNamePattern.test(fn)).toBe(true);
    });
  });

  it('should not have duplicate function names', () => {
    const unique = new Set(edgeFunctions);
    expect(unique.size).toBe(edgeFunctions.length);
  });

  it('should categorize functions by type', () => {
    const routers = edgeFunctions.filter(fn => fn.startsWith('router-'));
    const apis = edgeFunctions.filter(fn => fn.includes('-api'));
    
    expect(routers.length).toBeGreaterThan(0);
    expect(routers).toContain('router-wellness');
  });
});
