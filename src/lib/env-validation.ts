
const requiredEnvVars = {
  supabaseUrl: 'https://yaincoxihiqdksxgrsrk.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU',
  isDevelopment: import.meta.env.DEV || false,
  isProduction: import.meta.env.PROD || false
};

export const env = {
  ...requiredEnvVars,
  // Validation des variables critiques
  get isValid() {
    return !!(this.supabaseUrl && this.supabaseAnonKey);
  }
};

// Log d'environnement en développement
if (env.isDevelopment) {
  console.log('🔧 Environment validated:', env.isValid ? 'OK' : 'MISSING VARS');
}

export default env;
