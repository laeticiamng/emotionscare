
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExtensionMeta } from '@/types/extensions';
import { motion } from 'framer-motion';
import { Download, Check, ArrowRight } from 'lucide-react';

interface ExtensionsListProps {
  extensions: ExtensionMeta[];
  installed: string[];
  onToggle: (extension: ExtensionMeta) => void;
  onViewDetails: (extension: ExtensionMeta) => void;
}

const ExtensionsList: React.FC<ExtensionsListProps> = ({ 
  extensions, 
  installed, 
  onToggle,
  onViewDetails
}) => {
  if (extensions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune extension trouvée</p>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {extensions.map((extension) => {
        const isInstalled = installed.includes(extension.id);
        
        return (
          <motion.div key={extension.id} variants={item}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{extension.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {extension.isNew && (
                      <Badge variant="default" className="animate-pulse">Nouveau</Badge>
                    )}
                    {extension.isBeta && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Bêta</Badge>
                    )}
                    {extension.isEarlyAccess && (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">Early Access</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>{extension.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {extension.tags && extension.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {extension.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant={isInstalled ? "outline" : "default"}
                  size="sm"
                  className={isInstalled ? "border-green-200" : ""}
                  onClick={() => onToggle(extension)}
                >
                  {isInstalled ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Activé
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Activer
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(extension)}
                >
                  Détails
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ExtensionsList;
