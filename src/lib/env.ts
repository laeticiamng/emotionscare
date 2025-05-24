
/**
 * Centralized environment variables management
 */

// Supabase configuration - using actual project values
export const SUPABASE_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';

// API URLs
export const API_URL = 
  import.meta.env.VITE_PUBLIC_API_URL || 
  'https://api.example.com';

export const WEB_URL = 
  import.meta.env.VITE_PUBLIC_WEB_URL || 
  'http://localhost:3000';

// Environment
export const APP_ENV = 
  import.meta.env.MODE || 
  'development';

// API keys - these will be empty in frontend and should be used in edge functions
export const OPENAI_API_KEY = '';
export const HUME_API_KEY = '';
export const MUSICGEN_API_KEY = '';

// Firebase configuration - optional for this project
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Check if essential environment variables are set in development mode
export const checkEnvVars = () => {
  if (APP_ENV === 'development') {
    console.log('✅ Supabase configured with project values');
    console.log('📍 Project URL:', SUPABASE_URL);
  }
};

// Run check on import
checkEnvVars();
