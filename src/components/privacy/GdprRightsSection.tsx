
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Info, FileText, EyeOff, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const GdprRightsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Vos droits RGPD
          </CardTitle>
          <CardDescription>
            La protection de vos données est notre priorité. Vous disposez de plusieurs droits garantis par le Règlement Général sur la Protection des Données.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="access">
              <AccordionTrigger className="hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Droit d'accès</span>
                  <Badge variant="info" className="ml-2">Article 15</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <p className="text-sm text-muted-foreground">
                    Vous avez le droit d'obtenir une copie de toutes les données personnelles vous concernant que nous traitons.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Demander mes données
                    </Button>
                  </motion.div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="erasure">
              <AccordionTrigger className="hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  <span>Droit à l'effacement</span>
                  <Badge variant="info" className="ml-2">Article 17</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <p className="text-sm text-muted-foreground">
                    Vous avez le droit de demander la suppression de vos données personnelles dans certaines circonstances.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="destructive" size="sm" className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Demander l'effacement
                    </Button>
                  </motion.div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rectification">
              <AccordionTrigger className="hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Droit de rectification</span>
                  <Badge variant="info" className="ml-2">Article 16</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <p className="text-sm text-muted-foreground">
                    Vous avez le droit de faire corriger des données personnelles inexactes vous concernant.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Rectifier mes informations
                    </Button>
                  </motion.div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GdprRightsSection;
