import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  icon?: LucideIcon;
}

interface Tip {
  title: string;
  content: string;
  icon: LucideIcon;
}

interface HeaderData {
  title: string;
  subtitle?: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  badge?: string;
  stats?: Stat[];
  actions?: Action[];
}

interface TipsData {
  title: string;
  items: Tip[];
  cta?: {
    label: string;
    onClick: () => void;
  };
}

interface PageLayoutProps {
  header: HeaderData;
  tips?: TipsData;
  children: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  tips,
  children,
  className,
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-white", className)}>
      {/* Header Section */}
      <section className={`bg-gradient-to-br ${header.gradient} py-16 text-white`}>
        <div className="container mx-auto px-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-6 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}

          <div className="text-center space-y-4">
            <Badge className="bg-white/10 text-white border-white/20">
              <header.icon className="h-3 w-3 mr-1" />
              {header.badge || 'EmotionsCare'}
            </Badge>
            
            <div className="flex items-center justify-center gap-3">
              <header.icon className="h-8 w-8" />
              <h1 className="text-4xl font-bold">{header.title}</h1>
            </div>
            
            {header.subtitle && (
              <p className="text-xl text-white/80">{header.subtitle}</p>
            )}
            
            <p className="text-white/70 max-w-2xl mx-auto">{header.description}</p>

            {header.actions && (
              <div className="flex gap-4 justify-center mt-8">
                {header.actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant={action.variant || 'default'}
                    className="bg-white text-gray-900 hover:bg-white/90"
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;