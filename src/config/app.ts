/**
 * Configuration principale de l'application EmotionsCare
 * Centralise tous les paramètres de production
 */

export const APP_CONFIG = {
  // Informations application
  name: 'EmotionsCare',
  version: '1.2.0',
  description: "Plateforme d'intelligence émotionnelle premium",
  
  // Environnement
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
  
  // URLs et APIs
  supabaseUrl: 'https://yaincoxihiqdksxgrsrk.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU',
  
  // Limites et quotas
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxMusicGeneration: 5, // par jour pour free tier
    maxAIRequests: 100, // par jour pour standard
    sessionTimeout: 24 * 60 * 60 * 1000, // 24h
  },
  
  // Features flags
  features: {
    humeAI: true,
    openAI: true,
    musicGeneration: true,
    vrBreathing: true,
    analytics: true,
    b2bDashboard: true,
  },
  
  // Thème et design
  theme: {
    primaryColor: 'hsl(220, 14%, 96%)',
    accentColor: 'hsl(210, 40%, 98%)',
    borderRadius: '0.5rem',
    animationDuration: 300,
  },
  
  // Monitoring et analytics  
  monitoring: {
    sentryEnabled: true,
    analyticsEnabled: true,
    performanceTracking: true,
  }
} as const;

export type AppConfig = typeof APP_CONFIG;