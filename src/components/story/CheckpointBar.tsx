import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Crown } from 'lucide-react';

interface CheckpointBarProps {
  currentAct: number;
  totalChapters?: number;
  className?: string;
}

const CheckpointBar: React.FC<CheckpointBarProps> = ({ 
  currentAct, 
  totalChapters = 0,
  className = '' 
}) => {
  const acts = [
    { 
      id: 1, 
      name: 'Acte I', 
      label: 'Découverte',
      icon: BookOpen,
      color: 'from-blue-500/20 to-purple-500/20'
    },
    { 
      id: 2, 
      name: 'Acte II', 
      label: 'Épreuve',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-500/20'
    },
    { 
      id: 3, 
      name: 'Acte III', 
      label: 'Révélation',
      icon: Crown,
      color: 'from-pink-500/20 to-yellow-500/20'
    }
  ];

  return (
    <div className={`checkpoint-bar ${className}`}>
      <div className="flex items-center justify-center gap-1 md:gap-4">
        {acts.map((act, index) => {
          const Icon = act.icon;
          const isActive = act.id === currentAct;
          const isCompleted = act.id < currentAct;
          const isPending = act.id > currentAct;

          return (
            <React.Fragment key={act.id}>
              {/* Pastille d'acte */}
              <div className="flex flex-col items-center group">
                <div 
                  className={`
                    relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isActive ? 
                      'border-primary bg-gradient-to-br ' + act.color + ' shadow-lg scale-110' :
                      isCompleted ? 
                      'border-primary/50 bg-primary/10 scale-100' :
                      'border-muted bg-muted/30 scale-90'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      h-5 w-5 transition-all duration-300
                      ${isActive ? 'text-primary animate-pulse' :
                        isCompleted ? 'text-primary/70' :
                        'text-muted-foreground'
                      }
                    `}
                  />
                  
                  {/* Lueur active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  )}
                  
                  {/* Marque de validation */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <Badge 
                    variant={isActive ? "default" : "outline"}
                    className={`
                      text-xs transition-all duration-300
                      ${isActive ? 'bg-primary text-white shadow-md' :
                        isCompleted ? 'border-primary/50 text-primary/70' :
                        'text-muted-foreground'
                      }
                    `}
                  >
                    {act.name}
                  </Badge>
                  <p className={`
                    text-xs mt-1 transition-colors
                    ${isActive ? 'text-foreground font-medium' :
                      isCompleted ? 'text-muted-foreground' :
                      'text-muted-foreground/60'
                    }
                  `}>
                    {act.label}
                  </p>
                </div>
              </div>

              {/* Connecteur */}
              {index < acts.length - 1 && (
                <div className="flex-1 max-w-16 h-px bg-gradient-to-r from-muted via-muted-foreground/30 to-muted mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Métadata discrète */}
      {totalChapters > 0 && (
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            {totalChapters === 1 ? '1 chapitre' : `${totalChapters} chapitres`} explorés
          </p>
        </div>
      )}

      {/* Indication narrative */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground italic">
          {currentAct === 1 && "L'aventure commence..."}
          {currentAct === 2 && "L'intrigue se complexifie..."}
          {currentAct === 3 && "Le dénouement approche..."}
        </p>
      </div>
    </div>
  );
};

export default CheckpointBar;