import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Wind, BookOpen, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_ACCESS_ITEMS = [
  {
    id: 'scan',
    title: 'Scanner',
    description: 'Analyse émotionnelle',
    icon: Brain,
    to: '/dashboard/scanner',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    id: 'breath',
    title: 'Respiration',
    description: 'Exercices guidés',
    icon: Wind,
    to: '/dashboard/breathing',
    color: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20',
  },
  {
    id: 'journal',
    title: 'Journal',
    description: 'Écriture émotionnelle',
    icon: BookOpen,
    to: '/app/journal',
    color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
  },
  {
    id: 'evaluations',
    title: 'Évaluations',
    description: 'Tests et bilans',
    icon: ClipboardCheck,
    to: '/assessments',
    color: 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20',
  },
];

interface QuickAccessGridProps {
  className?: string;
}

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {QUICK_ACCESS_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.id} to={item.to}>
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={cn('p-3 rounded-xl mb-3 transition-colors', item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickAccessGrid;
