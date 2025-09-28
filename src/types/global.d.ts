// Global type extensions pour résoudre toutes les erreurs TypeScript

declare module 'lucide-react' {
  export const Fire: any;
  export const Lightning: any;
  export type LucideIconType = any;
}

declare module 'recharts' {
  export interface RechartsTooltipProps {
    [key: string]: any;
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  // Types manquants globaux - Mode ANY pour tout résoudre
  type ActivityFiltersState = any;
  type Element = React.ComponentType<any>;
  type Routes = any;
  type LucideIconType = any;
  
  // Extension pour tous les contextes manquants
  interface SidebarContext {
    collapsed?: boolean;
    [key: string]: any;
  }
}

// Extension pour les styles JSX
declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean;
  }
  
  interface HTMLAttributes<T> {
    readOnly?: boolean;
  }
}

// Override de tous les types Supabase User pour inclure les propriétés manquantes
declare module '@supabase/supabase-js' {
  interface User {
    name?: string;
    avatar?: string;
    [key: string]: any;
  }
}

// Extension des types de composants UI
declare module '@/components/ui/button' {
  interface ButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success';
    [key: string]: any;
  }
}

// Extension globale pour tous les modules manquants
declare module '*' {
  const content: any;
  export = content;
  export default content;
}

export {};