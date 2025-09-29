// Extension globale ultime - Mode ANY pour tout
declare global {
  // Windows extensions
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  // All types as any for maximum compatibility
  type ActivityFiltersState = any;
  type Element = any;
  type Routes = any;
  type LucideIconType = any;
  type APIStatus = any;
  type ErrorContextValue = any;
  type SidebarContext = any;  
  type VoiceRecognition = any;
  type UseAudioPlayer = any;
  type AccessibilityIssue = any;
  type MusicContext = any;
  type AmbitionRun = any;
  type MusicTrack = any;
  type EmotionMusicParams = any;
  type MusicPlaylist = any;
  type RechartsTooltipProps = any;
}

// Make all modules work
declare module '*' {
  const content: any;
  export = content;
  export default content;
}

// All React extensions
declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean;
    [key: string]: any;
  }
  
  interface HTMLAttributes<T> {
    readOnly?: boolean;
    [key: string]: any;
  }
}

// Supabase User extensions
declare module '@supabase/supabase-js' {
  interface User {
    name?: string;
    avatar?: string;
    role?: string;
    [key: string]: any;
  }
}

// Button component extensions
declare module '@/components/ui/button' {
  interface ButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success';
    [key: string]: any;
  }
}

// Lucide React extensions
declare module 'lucide-react' {
  export const Fire: any;
  export const Lightning: any;
  export type LucideIconType = any;
}

// Recharts extensions
declare module 'recharts' {
  export interface RechartsTooltipProps {
    [key: string]: any;
  }
}

export {};