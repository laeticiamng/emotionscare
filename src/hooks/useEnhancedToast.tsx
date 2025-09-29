
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Info, XCircle, Sparkles } from 'lucide-react';

interface EnhancedToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'magic';
}

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    duration = 5000,
    action,
    variant = 'default'
  }: EnhancedToastOptions) => {
    const variantConfig = {
      default: {
        variant: 'default' as const,
        icon: null
      },
      success: {
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'border-green-200 bg-green-50 text-green-900'
      },
      error: {
        variant: 'destructive' as const,
        icon: XCircle
      },
      warning: {
        variant: 'default' as const,
        icon: AlertCircle,
        className: 'border-orange-200 bg-orange-50 text-orange-900'
      },
      info: {
        variant: 'default' as const,
        icon: Info,
        className: 'border-blue-200 bg-blue-50 text-blue-900'
      },
      magic: {
        variant: 'default' as const,
        icon: Sparkles,
        className: 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900'
      }
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    return toast({
      title: Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </div>
      ) : title,
      description,
      duration,
      variant: config.variant,
      className: config.className,
      action: action ? {
        altText: action.label,
        onClick: action.onClick,
        children: action.label
      } : undefined
    });
  };

  const success = (title: string, description?: string) => 
    showToast({ title, description, variant: 'success' });

  const error = (title: string, description?: string) => 
    showToast({ title, description, variant: 'error' });

  const warning = (title: string, description?: string) => 
    showToast({ title, description, variant: 'warning' });

  const info = (title: string, description?: string) => 
    showToast({ title, description, variant: 'info' });

  const magic = (title: string, description?: string) => 
    showToast({ title, description, variant: 'magic' });

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
    magic
  };
};
