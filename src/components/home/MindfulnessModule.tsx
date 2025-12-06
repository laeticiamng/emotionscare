
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Timer, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { withLandingUtm } from '@/lib/utm';
import { mobileSpacing } from '@/utils/mobileOptimizations';

interface MindfulnessModuleProps {
  className?: string;
}

const MindfulnessModule: React.FC<MindfulnessModuleProps> = ({ className }) => {
  return (
    <Card className={`shadow-md transition-all hover:shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" aria-hidden="true" />
            <span>Pleine Conscience</span>
          </CardTitle>
          <span className="bg-white/80 dark:bg-gray-800/80 text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full">
            8 exercices
          </span>
        </div>
        <CardDescription className="text-sm sm:text-base">
          Développez votre attention et votre présence
        </CardDescription>
      </CardHeader>
      <CardContent className={`pt-4 space-y-4 ${mobileSpacing.card}`}>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 border-l-4 border-blue-400 pl-3 py-1.5">
            <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" aria-hidden="true" />
            <div className="text-xs sm:text-sm">Temps total: <span className="font-medium">34 minutes</span></div>
          </div>
          <div className="flex items-center gap-2 border-l-4 border-yellow-400 pl-3 py-1.5">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" aria-hidden="true" />
            <div className="text-xs sm:text-sm">Niveau: <span className="font-medium">Débutant</span></div>
          </div>
        </div>
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Sessions recommandées</h4>
          <ul className="text-xs sm:text-sm space-y-1.5" aria-label="Sessions recommandées">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true"></span>
              Respiration consciente (5 min)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></span>
              Scan corporel (10 min)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" aria-hidden="true"></span>
              Méditation guidée (15 min)
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          Voir le détail
        </Button>
        <Button size="sm" asChild className="w-full sm:w-auto">
          <Link to={withLandingUtm(routes.consumer.vr())} aria-label="Commencer le module Pleine Conscience">
            Commencer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MindfulnessModule;
