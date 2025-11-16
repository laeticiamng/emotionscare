import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

/**
 * Environment Schema
 *
 * Validates all critical environment variables at startup.
 * Add new variables here as they become required.
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Security & Authentication
  JWT_SECRETS: z
    .string()
    .min(1, 'JWT_SECRETS is required')
    .refine(
      val => val.split(',').every(secret => secret.length >= 32),
      'Each JWT secret must be at least 32 characters'
    ),
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS is required for CORS'),

  // Supabase (required)
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY is required'),

  // Optional but recommended in production
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Rate limiting (optional)
  RATE_LIMIT_MAX: z.string().optional(),
  RATE_LIMIT_WINDOW: z.string().optional(),
  RATE_LIMIT_ALLOWLIST: z.string().optional(),

  // Monitoring (optional but recommended for production)
  VITE_SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  // API URLs (optional)
  VITE_API_URL: z.string().url().optional().or(z.literal('')),
  VITE_WEB_URL: z.string().url().optional().or(z.literal('')),
  FRONTEND_URL: z.string().url().optional().or(z.literal('')),
});

/**
 * Validated environment variables
 * Access typed env vars via this export
 */
export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (!validatedEnv) {
    throw new Error('Environment not validated yet. Ensure envValidationPlugin is registered.');
  }
  return validatedEnv;
};

export const envValidationPlugin: FastifyPluginAsync = async app => {
  try {
    validatedEnv = envSchema.parse(process.env);

    // Log validation success with key info (without exposing secrets)
    app.log.info(
      {
        nodeEnv: validatedEnv.NODE_ENV,
        supabaseUrl: validatedEnv.VITE_SUPABASE_URL,
        allowedOrigins: validatedEnv.ALLOWED_ORIGINS,
        jwtSecretsCount: validatedEnv.JWT_SECRETS.split(',').length,
        rateLimitEnabled: !!validatedEnv.RATE_LIMIT_MAX,
        sentryEnabled: !!validatedEnv.VITE_SENTRY_DSN,
      },
      'Environment variables validated successfully'
    );

    // Warn in production if optional security features are missing
    if (validatedEnv.NODE_ENV === 'production') {
      if (!validatedEnv.VITE_SENTRY_DSN) {
        app.log.warn('VITE_SENTRY_DSN not set. Error monitoring is disabled.');
      }
      if (!validatedEnv.RATE_LIMIT_MAX) {
        app.log.warn('RATE_LIMIT_MAX not set. Using default rate limiting configuration.');
      }
      if (!validatedEnv.SUPABASE_SERVICE_ROLE_KEY) {
        app.log.warn('SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will be limited.');
      }
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const missingVars = err.errors
        .map(e => `  - ${e.path.join('.')}: ${e.message}`)
        .join('\n');

      app.log.error(
        { errors: err.errors },
        `Environment validation failed:\n${missingVars}`
      );

      throw new Error(
        `Environment validation failed. Please check your .env file:\n${missingVars}`
      );
    }

    app.log.error({ err }, 'Unexpected error during environment validation');
    throw err;
  }
};

export default envValidationPlugin;
