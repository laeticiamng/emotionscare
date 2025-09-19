/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_WEB_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_UPLOAD_MAX_SIZE?: string;
  readonly VITE_ALLOWED_IMAGE_TYPES?: string;
  readonly VITE_ALLOWED_AUDIO_TYPES?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly NEXT_PUBLIC_OPENAI_API_KEY?: string;
  readonly VITE_OPENAI_BASE_URL?: string;
  readonly VITE_HUME_API_KEY?: string;
  readonly NEXT_PUBLIC_HUME_API_KEY?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_COMMIT_SHA?: string;
  readonly VITE_SENTRY_RELEASE?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
  readonly GITHUB_SHA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
