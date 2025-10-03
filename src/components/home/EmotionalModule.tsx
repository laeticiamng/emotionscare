
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, BookOpen } from "lucide-react";
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { withLandingUtm } from '@/lib/utm';

interface EmotionalModuleProps {
  className?: string;
}

const EmotionalModule: React.FC<EmotionalModuleProps> = ({ className }) => {
  return (
    <Card className={`shadow-md transition-all hover:shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>Module Émotionnel</span>
          </CardTitle>
          <span className="bg-white/80 dark:bg-gray-800/80 text-xs font-medium px-2.5 py-0.5 rounded-full">
            12 activités
          </span>
        </div>
        <CardDescription>
          Analysez et comprenez vos émotions au quotidien
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 border-l-4 border-green-400 pl-3 py-1.5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div className="text-sm">Dernier scan: <span className="font-medium">Calme</span></div>
          </div>
          <div className="flex items-center gap-2 border-l-4 border-violet-400 pl-3 py-1.5">
            <BookOpen className="h-4 w-4 text-violet-500" />
            <div className="text-sm">Entrées journal: <span className="font-medium">3 cette semaine</span></div>
          </div>
        </div>
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Activités recommandées</h4>
          <ul className="text-sm space-y-1.5">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Scan émotionnel du jour
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Exercice de respiration guidée
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              Écriture de journal réflexif
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm">
          Voir le détail
        </Button>
        <Button size="sm" asChild>
          <Link to={withLandingUtm(routes.consumer.scan())}>
            Commencer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionalModule;
