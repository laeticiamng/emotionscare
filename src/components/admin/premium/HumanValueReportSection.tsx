import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, DownloadCloud, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HumanValueReportSectionProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
  className?: string;
}

const recommendations = [
  {
    id: 1,
    text: "Les équipes semblent plus sensibles à la musique guidée que la visualisation.",
    category: "observation",
    impact: "medium"
  },
  {
    id: 2,
    text: "Les vendredis sont les jours les plus fragiles émotionnellement.",
    category: "alert",
    impact: "high"
  },
  {
    id: 3,
    text: "Suggestion de micropauses cognitives de 5 minutes à 15h00 pour les équipes commerciales.",
    category: "suggestion",
    impact: "medium"
  }
];

const inspirationalQuotes = [
  "La bienveillance est le langage que les sourds peuvent entendre et que les aveugles peuvent voir.",
  "Prendre soin de notre équilibre émotionnel c'est prendre soin de notre performance collective.",
  "La plus grande découverte de ma génération est que les êtres humains peuvent changer leur vie en modifiant leur attitude d'esprit.",
];

const HumanValueReportSection: React.FC<HumanValueReportSectionProps> = ({
  isActive,
  onClick,
  visualStyle,
  zenMode,
  className
}) => {
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  
  // Rotate through quotes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = inspirationalQuotes.indexOf(quote);
      const nextIndex = (currentIndex + 1) % inspirationalQuotes.length;
      setQuote(inspirationalQuotes[nextIndex]);
    }, 12000);
    
    return () => clearInterval(interval);
  }, [quote]);
  
  return (
    <Card 
      className={cn(
        "premium-card overflow-hidden relative transition-all ease-in-out", 
        isActive ? "shadow-xl border-primary/20" : "",
        zenMode ? "bg-background/70 backdrop-blur-lg border-border/50" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="relative">
        <CardTitle className="flex items-center text-xl">
          <div className="w-10 h-10 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="text-primary" />
          </div>
          Rapport "Valeur Humaine"
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Inspirational quote section */}
          <motion.div 
            className={cn(
              "p-5 rounded-lg text-center",
              visualStyle === 'artistic'
                ? "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/30"
                : "bg-primary/5 border border-primary/10"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-lg font-serif italic"
              key={quote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2 }}
            >
              "{quote}"
            </motion.p>
          </motion.div>
          
          {/* Recommendations section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Recommandations & Observations</h3>
              <Badge variant="outline">Généré par IA</Badge>
            </div>
            
            <div className="space-y-3">
              {recommendations.map((item) => (
                <motion.div 
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    item.category === 'alert' 
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' 
                      : item.category === 'suggestion'
                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30'
                      : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                  )}
                  whileHover={{ scale: 1.01, y: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex">
                    <div className="mr-3 mt-0.5">
                      <Lightbulb 
                        size={18} 
                        className={
                          item.category === 'alert' 
                            ? 'text-red-500' 
                            : item.category === 'suggestion'
                            ? 'text-blue-500'
                            : 'text-amber-500'
                        } 
                      />
                    </div>
                    <div>
                      <p className="text-sm">{item.text}</p>
                      <div className="flex mt-2">
                        <Badge 
                          variant="secondary" 
                          className="text-2xs px-1.5 py-0"
                        >
                          {item.category === 'alert' ? 'Alerte' : item.category === 'suggestion' ? 'Suggestion' : 'Observation'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-2xs ml-2 px-1.5 py-0",
                            item.impact === 'high' 
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300' 
                              : item.impact === 'medium'
                              ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-300'
                              : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-300'
                          )}
                        >
                          {item.impact === 'high' ? 'Impact élevé' : item.impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="outline" size="sm" className="gap-1">
          <DownloadCloud size={16} />
          <span>Télécharger le rapport complet</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Change from named export to default export
export default HumanValueReportSection;
