
/**
 * Validation et configuration centralisée des variables d'environnement
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  webUrl: string;
  appEnv: 'development' | 'production' | 'staging';
  isDevelopment: boolean;
  isProduction: boolean;
}

class EnvironmentValidator {
  private config: EnvConfig;

  constructor() {
    this.config = this.validateAndSetup();
  }

  private validateAndSetup(): EnvConfig {
    // URLs Supabase - utiliser les valeurs du projet
    const supabaseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';

    // URLs API avec fallbacks
    const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || 'https://api.example.com';
    const webUrl = import.meta.env.VITE_PUBLIC_WEB_URL || 'http://localhost:3000';
    
    // Environnement
    const appEnv = (import.meta.env.MODE as EnvConfig['appEnv']) || 'development';

    const config: EnvConfig = {
      supabaseUrl,
      supabaseAnonKey,
      apiUrl,
      webUrl,
      appEnv,
      isDevelopment: appEnv === 'development',
      isProduction: appEnv === 'production',
    };

    // Validation
    this.validateConfig(config);

    return config;
  }

  private validateConfig(config: EnvConfig): void {
    const errors: string[] = [];

    if (!config.supabaseUrl || !config.supabaseUrl.startsWith('https://')) {
      errors.push('SUPABASE_URL is invalid or missing');
    }

    if (!config.supabaseAnonKey || config.supabaseAnonKey.length < 10) {
      errors.push('SUPABASE_ANON_KEY is invalid or missing');
    }

    if (errors.length > 0) {
      console.error('❌ Environment validation failed:', errors);
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }

    if (config.isDevelopment) {
      console.log('✅ Environment validation passed');
      console.log('📍 Configuration:', {
        supabaseUrl: config.supabaseUrl,
        apiUrl: config.apiUrl,
        appEnv: config.appEnv,
      });
    }
  }

  public getConfig(): EnvConfig {
    return { ...this.config };
  }

  public get supabaseUrl(): string {
    return this.config.supabaseUrl;
  }

  public get supabaseAnonKey(): string {
    return this.config.supabaseAnonKey;
  }

  public get apiUrl(): string {
    return this.config.apiUrl;
  }

  public get webUrl(): string {
    return this.config.webUrl;
  }

  public get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  public get isProduction(): boolean {
    return this.config.isProduction;
  }
}

export const env = new EnvironmentValidator();
export default env;
