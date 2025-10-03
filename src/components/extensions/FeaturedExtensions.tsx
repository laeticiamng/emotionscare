
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Download, Check } from 'lucide-react';
import { useExtensions } from '@/contexts/ExtensionsContext';
import { useNavigate } from 'react-router-dom';

const FeaturedExtensions: React.FC = () => {
  const { available, installed, toggleExtension } = useExtensions();
  const navigate = useNavigate();

  // For now, let's just use the first extension as featured
  // In a real app, this would be determined by the backend
  const featuredExtension = available[0];
  
  if (!featuredExtension) return null;
  
  const isInstalled = installed.includes(featuredExtension.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/30 to-primary/5 p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <Badge className="mb-2">Recommandé</Badge>
              <h2 className="text-2xl font-bold">{featuredExtension.name}</h2>
              <p className="text-muted-foreground">{featuredExtension.description}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-2">5.0</span>
                <span className="text-sm text-muted-foreground ml-1">(24 avis)</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant={isInstalled ? "outline" : "default"}
                className={isInstalled ? "border-green-200" : ""}
                onClick={() => toggleExtension(featuredExtension.id)}
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
              <Button variant="outline" onClick={() => navigate(`/extensions/${featuredExtension.id}`)}>
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeaturedExtensions;
