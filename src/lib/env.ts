
/**
 * Centralized environment variables management
 */

// Supabase configuration
export const SUPABASE_URL = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://placeholder-supabase-url.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key-for-development';

// API URLs
export const API_URL = 
  import.meta.env.NEXT_PUBLIC_API_URL || 
  import.meta.env.VITE_PUBLIC_API_URL || 
  'https://api.example.com';

export const WEB_URL = 
  import.meta.env.NEXT_PUBLIC_WEB_URL || 
  import.meta.env.VITE_PUBLIC_WEB_URL || 
  'http://localhost:3000';

// Environment
export const APP_ENV = 
  import.meta.env.NEXT_PUBLIC_APP_ENV || 
  import.meta.env.MODE || 
  'development';

// OpenAI and other API keys
export const OPENAI_API_KEY = 
  import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY || 
  import.meta.env.VITE_OPENAI_API_KEY || 
  '';

export const HUME_API_KEY = 
  import.meta.env.NEXT_PUBLIC_HUME_API_KEY || 
  import.meta.env.VITE_HUME_API_KEY || 
  '';

export const MUSICGEN_API_KEY = 
  import.meta.env.NEXT_PUBLIC_MUSICGEN_API_KEY || 
  import.meta.env.VITE_MUSICGEN_API_KEY || 
  '';

// Firebase configuration
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
    const requiredVars: Record<string, string> = {
      'SUPABASE_URL': SUPABASE_URL,
      'SUPABASE_ANON_KEY': SUPABASE_ANON_KEY,
      'API_URL': API_URL
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => value === '' || value.includes('placeholder'))
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.warn(`Environment variables missing or using placeholder values: ${missingVars.join(', ')}`);
    }
  }
};

// Run check on import
checkEnvVars();
