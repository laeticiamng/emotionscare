
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Info, Check, AlertCircle, HelpCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRgpdExplainer } from '@/hooks/useRgpdExplainer';
import { Skeleton } from '@/components/ui/skeleton';

const GdprRightsSection: React.FC = () => {
  const { toast } = useToast();
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const { getExplanation, explanation, isLoading, askQuestion } = useRgpdExplainer();

  const handleRequestExercise = (right: string) => {
    setActiveRequest(right);
    
    // Simulate request processing
    setTimeout(() => {
      setActiveRequest(null);
      toast({
        title: "Demande enregistrée",
        description: `Votre demande d'exercice du droit "${right}" a été enregistrée. Nous vous contacterons sous 30 jours.`,
        variant: "success",
      });
    }, 1500);
  };

  const getGdprExplanation = async (article: string) => {
    await getExplanation(article, { language: 'fr', readingLevel: 'simple' });
  };

  const rights = [
    {
      id: 'access',
      title: 'Droit d'accès',
      description: 'Vous pouvez demander à accéder à toutes vos données personnelles que nous traitons',
      article: 'article 15'
    },
    {
      id: 'rectification',
      title: 'Droit de rectification',
      description: 'Vous pouvez demander la correction de vos données personnelles inexactes',
      article: 'article 16'
    },
    {
      id: 'erasure',
      title: 'Droit à l'effacement',
      description: 'Vous pouvez demander la suppression de vos données personnelles dans certaines conditions',
      article: 'article 17'
    },
    {
      id: 'restriction',
      title: 'Droit à la limitation',
      description: 'Vous pouvez demander la limitation du traitement de vos données',
      article: 'article 18'
    },
    {
      id: 'portability',
      title: 'Droit à la portabilité',
      description: 'Vous pouvez récupérer vos données dans un format structuré',
      article: 'article 20'
    },
    {
      id: 'objection',
      title: 'Droit d'opposition',
      description: 'Vous pouvez vous opposer au traitement de vos données personnelles',
      article: 'article 21'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Vos droits RGPD
            </CardTitle>
            <CardDescription>
              En tant que citoyen européen, vous bénéficiez de droits sur vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {rights.map((right, index) => (
                <motion.div
                  key={right.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={right.id} className="border rounded-md px-4 mb-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span>{right.title}</span>
                        <span className="text-xs text-muted-foreground">({right.article})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>{right.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => getGdprExplanation(right.article)}
                        >
                          <Info className="h-3 w-3" />
                          Explication simple
                        </Button>
                        
                        <Button 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleRequestExercise(right.title)}
                          disabled={activeRequest === right.title}
                        >
                          {activeRequest === right.title ? (
                            <>
                              <Skeleton className="h-3 w-3 rounded-full animate-pulse" />
                              Traitement...
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3" />
                              Exercer ce droit
                            </>
                          )}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            
            {explanation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Explication simplifiée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{explanation.explanation}</p>
                    {explanation.simplifiedPoints && (
                      <ul className="list-disc pl-5 space-y-1">
                        {explanation.simplifiedPoints.map((point, i) => (
                          <li key={i} className="text-sm">{point}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Toutes vos demandes sont sécurisées et confidentielles
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Contacter notre DPO
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default GdprRightsSection;
