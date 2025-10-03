import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Smile, 
  Sun, 
  Zap, 
  Leaf, 
  Star, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  Shield
} from 'lucide-react';

interface VerbalBadgeProps {
  hints: string[];
  context?: string;
  variant?: 'default' | 'card' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Mots-clés positifs
  'apais': Leaf,
  'calme': Leaf,
  'détendu': Leaf,
  'serein': Leaf,
  'progrès': TrendingUp,
  'mieux': TrendingUp,
  'amélioration': TrendingUp,
  'évolue': TrendingUp,
  'belle': Star,
  'magnifique': Star,
  'superbe': Star,
  'excellent': Star,
  'sourire': Smile,
  'joie': Smile,
  'heureux': Smile,
  'content': Smile,
  'énergie': Zap,
  'dynamique': Zap,
  'vitalité': Zap,
  'force': Zap,
  'lumière': Sun,
  'brillant': Sun,
  'éclatant': Sun,
  'radieux': Sun,
  'cœur': Heart,
  'amour': Heart,
  'tendresse': Heart,
  'bienveillant': Heart,
  'protection': Shield,
  'sécurité': Shield,
  'confiance': Shield,
  'stable': Shield,
  'magie': Sparkles,
  'merveilleux': Sparkles,
  'extraordinaire': Sparkles,
  'réussi': CheckCircle2,
  'accompli': CheckCircle2,
  'victoire': CheckCircle2
};

const getIconForHint = (hint: string): React.ComponentType<{ className?: string }> => {
  const lowerHint = hint.toLowerCase();
  
  for (const [keyword, Icon] of Object.entries(iconMap)) {
    if (lowerHint.includes(keyword)) {
      return Icon;
    }
  }
  
  // Icône par défaut selon le ton général
  if (lowerHint.includes('continue') || lowerHint.includes('persévère')) {
    return TrendingUp;
  }
  
  return Smile; // Fallback positif
};

const getBadgeVariant = (hint: string): "default" | "secondary" | "outline" | "destructive" => {
  const lowerHint = hint.toLowerCase();
  
  // Tons très positifs
  if (lowerHint.includes('magnifique') || lowerHint.includes('excellent') || lowerHint.includes('superbe')) {
    return 'default';
  }
  
  // Encouragements
  if (lowerHint.includes('continue') || lowerHint.includes('progrès') || lowerHint.includes('mieux')) {
    return 'secondary';
  }
  
  // Neutre/doux
  return 'outline';
};

export function VerbalBadge({ 
  hints, 
  context,
  variant = 'default',
  showIcon = true,
  className = "" 
}: VerbalBadgeProps) {
  if (!hints || hints.length === 0) {
    return null;
  }

  const primaryHint = hints[0]; // On affiche le premier hint (principal)
  const Icon = showIcon ? getIconForHint(primaryHint) : null;
  const badgeVariant = getBadgeVariant(primaryHint);

  if (variant === 'minimal') {
    return (
      <Badge variant={badgeVariant} className={`assess-badge-minimal ${className}`}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {primaryHint}
      </Badge>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`assess-badge-card border-l-4 border-l-primary/50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                {primaryHint}
              </p>
              
              {hints.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  {hints.slice(1).join(' • ')}
                </p>
              )}
              
              {context && (
                <Badge variant="secondary" className="text-xs mt-2">
                  {context}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant par défaut
  return (
    <div className={`assess-badge-default space-y-2 ${className}`}>
      <Badge variant={badgeVariant} className="inline-flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {primaryHint}
      </Badge>
      
      {hints.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {hints.slice(1).map((hint, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {hint}
            </Badge>
          ))}
        </div>
      )}
      
      {context && (
        <Badge variant="outline" className="text-xs">
          {context}
        </Badge>
      )}
    </div>
  );
}