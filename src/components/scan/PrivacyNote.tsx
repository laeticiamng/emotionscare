import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Trash2, ChevronDown, Lock, FileText, Settings, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface PrivacyNoteProps {
  showDetails?: boolean;
  onPrivacySettingsClick?: () => void;
  onLearnMoreClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  consentGiven?: boolean;
  onConsentChange?: (consent: boolean) => void;
}

const PRIVACY_FEATURES = [
  {
    icon: Eye,
    title: "Pas de stockage d'images",
    description: "L'image n'est pas stockée par défaut",
    verified: true
  },
  {
    icon: Trash2,
    title: "Suppression automatique",
    description: "Les données sont supprimées après analyse",
    verified: true
  },
  {
    icon: Shield,
    title: "Données chiffrées",
    description: "Transfert sécurisé via HTTPS",
    verified: true
  },
  {
    icon: Lock,
    title: "Contrôle total",
    description: "Seul le résultat d'émotion est conservé (si vous le souhaitez)",
    verified: true
  }
];

export const PrivacyNote: React.FC<PrivacyNoteProps> = ({
  showDetails = false,
  onPrivacySettingsClick,
  onLearnMoreClick,
  variant = 'default',
  consentGiven = true,
  onConsentChange
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Shield className="w-3 h-3 text-green-600" />
        <span>Vos données sont protégées</span>
        {onLearnMoreClick && (
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-xs"
            onClick={onLearnMoreClick}
          >
            En savoir plus
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={cn(
        "border-green-200 dark:border-green-900/50 transition-all duration-300",
        isExpanded ? "bg-green-50/50 dark:bg-green-950/20" : "bg-muted/30"
      )}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardContent className="p-4">
            {/* En-tête */}
            <CollapsibleTrigger asChild>
              <div className="flex items-start gap-3 cursor-pointer group">
                <motion.div
                  animate={{ scale: isExpanded ? 1.1 : 1 }}
                  className="p-2 rounded-full bg-green-100 dark:bg-green-900/50"
                >
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">
                        Respect de votre vie privée
                      </h4>
                      <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Certifié
                      </Badge>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucune caméra n'est activée en permanence. La capture se fait uniquement à votre demande.
                  </p>
                </div>
              </div>
            </CollapsibleTrigger>

            {/* Contenu détaillé */}
            <CollapsibleContent>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  {/* Liste des garanties */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRIVACY_FEATURES.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onHoverStart={() => setHoveredFeature(index)}
                        onHoverEnd={() => setHoveredFeature(null)}
                        className={cn(
                          "p-3 rounded-lg border transition-all",
                          hoveredFeature === index 
                            ? "bg-green-100 dark:bg-green-900/30 border-green-300" 
                            : "bg-background/50 border-transparent"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <feature.icon className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{feature.title}</p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                          {feature.verified && (
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Consentement */}
                  {onConsentChange && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Conserver mes résultats d'analyse</span>
                      </div>
                      <Switch
                        checked={consentGiven}
                        onCheckedChange={onConsentChange}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {onPrivacySettingsClick && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onPrivacySettingsClick}
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        Paramètres de confidentialité
                      </Button>
                    )}
                    
                    {onLearnMoreClick && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onLearnMoreClick}
                      >
                        <FileText className="w-3 h-3 mr-2" />
                        Politique de confidentialité
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
};