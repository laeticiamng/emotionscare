import React from 'react';
import { ModuleState } from '@/types/modules';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  state: ModuleState;
  onExit?: () => void;
  showBack?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  subtitle,
  state,
  onExit,
  showBack = true,
  children,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onExit) {
      onExit();
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    navigate('/app/home');
  };

  return (
    <div className={`min-h-screen bg-gradient-subtle flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/10">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        )}
        
        <div className="flex-1 text-center">
          <h1 className="text-lg font-medium text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleHome}
          className="gap-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {state === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Une minute pour toi...</p>
            </div>
          </div>
        )}

        {state === 'empty' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <p className="text-muted-foreground mb-4">
                On se retrouve dans un instant ✨
              </p>
              <Button onClick={handleBack} variant="outline">
                Retour
              </Button>
            </div>
          </div>
        )}

        {(state === 'content' || state === 'verbal-feedback') && children}
      </div>

      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Aller au contenu principal
      </a>
    </div>
  );
};