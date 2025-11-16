import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRETS: z.string().min(1, 'JWT_SECRETS is required'),
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY is required'),
  // Add other required environment variables as needed
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

export const envValidationPlugin: FastifyPluginAsync = async app => {
  try {
    envSchema.parse(process.env);
    app.log.info('Environment variables validated successfully');
  } catch (err) {
    app.log.error({ err }, 'Invalid environment configuration');
    throw new Error('Environment validation failed. Check your .env file and ensure all required variables are set.');
  }
};

export default envValidationPlugin;
