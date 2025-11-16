import { FastifyPluginAsync } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';

export const securityPlugin: FastifyPluginAsync = async app => {
  // Register Helmet for security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Configure CORS
  const originsEnv = process.env.ALLOWED_ORIGINS;
  const allowedOrigins = originsEnv
    ? originsEnv.split(',').map(o => o.trim()).filter(Boolean)
    : false;

  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.log.info({ allowedOrigins }, 'Security plugin registered with CORS and Helmet');
};

export default securityPlugin;
