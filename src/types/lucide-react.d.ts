// Déclaration de types pour résoudre les erreurs lucide-react
// Cette solution temporaire permet à l'application de compiler
declare module 'lucide-react' {
  import { ComponentType } from 'react';
  
  interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }
  
  export const CheckCircle: ComponentType<LucideProps>;
  export const XCircle: ComponentType<LucideProps>;
  export const AlertTriangle: ComponentType<LucideProps>;
  export const Shield: ComponentType<LucideProps>;
  export const User: ComponentType<LucideProps>;
  export const Settings: ComponentType<LucideProps>;
  export const Zap: ComponentType<LucideProps>;
  export const Eye: ComponentType<LucideProps>;
  export const Keyboard: ComponentType<LucideProps>;
  export const Volume2: ComponentType<LucideProps>;
  export const Type: ComponentType<LucideProps>;
  export const Contrast: ComponentType<LucideProps>;
  export const Accessibility: ComponentType<LucideProps>;
  export const MousePointer: ComponentType<LucideProps>;
  export const ZoomIn: ComponentType<LucideProps>;
  export const X: ComponentType<LucideProps>;
  export const Trash2: ComponentType<LucideProps>;
  export const ExternalLink: ComponentType<LucideProps>;
  export const Undo: ComponentType<LucideProps>;
  export const CalendarIcon: ComponentType<LucideProps>;
  export const Brain: ComponentType<LucideProps>;
  export const Monitor: ComponentType<LucideProps>;
  export const Headphones: ComponentType<LucideProps>;
  export const BookOpen: ComponentType<LucideProps>;
  export const Gamepad2: ComponentType<LucideProps>;
  export const Play: ComponentType<LucideProps>;
  export const RotateCcw: ComponentType<LucideProps>;
  export const MoreHorizontal: ComponentType<LucideProps>;
  export const Search: ComponentType<LucideProps>;
  export const Filter: ComponentType<LucideProps>;
  export const RefreshCw: ComponentType<LucideProps>;
  export const Sparkles: ComponentType<LucideProps>;
  export const Send: ComponentType<LucideProps>;
  export const Mic: ComponentType<LucideProps>;
  export const Home: ComponentType<LucideProps>;
  export const Users: ComponentType<LucideProps>;
  export const FileText: ComponentType<LucideProps>;
  export const BarChart3: ComponentType<LucideProps>;
  export const Calendar: ComponentType<LucideProps>;
  export const Heart: ComponentType<LucideProps>;
  export const Music: ComponentType<LucideProps>;
  export const MessageSquare: ComponentType<LucideProps>;
  export const HelpCircle: ComponentType<LucideProps>;
  export const Menu: ComponentType<LucideProps>;
  export const LogOut: ComponentType<LucideProps>;
  export const ArrowRight: ComponentType<LucideProps>;
  export const Mail: ComponentType<LucideProps>;
  export const Check: ComponentType<LucideProps>;
  export const Building: ComponentType<LucideProps>;
  export const AlertCircle: ComponentType<LucideProps>;
  export const Camera: ComponentType<LucideProps>;
  export const MessageCircle: ComponentType<LucideProps>;
  export const Star: ComponentType<LucideProps>;
  export const Clock: ComponentType<LucideProps>;
  export const ArrowLeft: ComponentType<LucideProps>;
  export const Activity: ComponentType<LucideProps>;
  export const Lock: ComponentType<LucideProps>;
  export const FileCheck: ComponentType<LucideProps>;
  export const Loader2: ComponentType<LucideProps>;
  export const Key: ComponentType<LucideProps>;
  export const Save: ComponentType<LucideProps>;
  
  // Export par défaut
  const lucideReact: {
    [key: string]: ComponentType<LucideProps>;
  };
  export default lucideReact;
}