
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Timer, Star } from "lucide-react";
import { Link } from 'react-router-dom';

interface MindfulnessModuleProps {
  className?: string;
}

const MindfulnessModule: React.FC<MindfulnessModuleProps> = ({ className }) => {
  return (
    <Card className={`shadow-md transition-all hover:shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <span>Pleine Conscience</span>
          </CardTitle>
          <span className="bg-white/80 dark:bg-gray-800/80 text-xs font-medium px-2.5 py-0.5 rounded-full">
            8 exercices
          </span>
        </div>
        <CardDescription>
          Développez votre attention et votre présence
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 border-l-4 border-blue-400 pl-3 py-1.5">
            <Timer className="h-4 w-4 text-blue-500" />
            <div className="text-sm">Temps total: <span className="font-medium">34 minutes</span></div>
          </div>
          <div className="flex items-center gap-2 border-l-4 border-yellow-400 pl-3 py-1.5">
            <Star className="h-4 w-4 text-yellow-500" />
            <div className="text-sm">Niveau: <span className="font-medium">Débutant</span></div>
          </div>
        </div>
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Sessions recommandées</h4>
          <ul className="text-sm space-y-1.5">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Respiration consciente (5 min)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Scan corporel (10 min)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Méditation guidée (15 min)
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm">
          Voir le détail
        </Button>
        <Button size="sm" asChild>
          <Link to="/mindfulness">
            Commencer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MindfulnessModule;
