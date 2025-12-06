import React, { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface EmpatheticModerationProps {
  content: string;
  onContentCheck: (isSafe: boolean, improvedContent?: string) => void;
  autoModerate?: boolean;
  showImprovements?: boolean;
  className?: string;
}

export const EmpatheticModeration: React.FC<EmpatheticModerationProps> = ({
  content,
  onContentCheck,
  autoModerate = false,
  showImprovements = true,
  className
}) => {
  const { moderation } = useOpenAI();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    isSafe: boolean;
    reason?: string;
    suggestion?: string;
  } | null>(null);
  const [improvementVisible, setImprovementVisible] = useState(false);
  
  // Vérifier automatiquement le contenu quand il change si autoModerate est activé
  useEffect(() => {
    if (autoModerate && content && content.length > 20) {
      const debounceTimeout = setTimeout(() => {
        checkContent();
      }, 1000);
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [content, autoModerate]);
  
  const checkContent = async () => {
    if (!content || content.trim().length === 0) return;
    
    setIsChecking(true);
    setResult(null);
    
    try {
      // Vérifier le contenu avec le service de modération OpenAI
      const moderationResult = await moderation?.checkContent(content);
      
      if (moderationResult.flagged) {
        // Simuler une suggestion améliorée (dans une vraie implémentation, ceci viendrait d'OpenAI)
        const suggestedContent = content
          .replace(/stupide/gi, "difficile")
          .replace(/idiot/gi, "personne")
          .replace(/déteste/gi, "n'apprécie pas");
        
        setResult({
          isSafe: false,
          reason: moderationResult.reason,
          suggestion: suggestedContent !== content ? suggestedContent : undefined
        });
        
        onContentCheck(false, suggestedContent !== content ? suggestedContent : undefined);
      } else {
        // Le contenu est sûr
        setResult({ isSafe: true });
        onContentCheck(true);
      }
    } catch (error) {
      // Content verification error
      toast({
        title: "Erreur de modération",
        description: "Impossible de vérifier le contenu. Veuillez réessayer.",
        variant: "destructive"
      });
      onContentCheck(true); // Par défaut, autoriser le contenu en cas d'erreur
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleAcceptSuggestion = () => {
    if (result?.suggestion) {
      onContentCheck(true, result.suggestion);
      setImprovementVisible(false);
      setResult(prev => prev ? { ...prev, isSafe: true } : null);
    }
  };
  
  return (
    <div className={className}>
      {!autoModerate && (
        <Button
          variant="outline" 
          size="sm" 
          onClick={checkContent}
          disabled={isChecking || !content}
          className="mb-2"
        >
          <Shield className="mr-2 h-4 w-4" />
          {isChecking ? "Vérification..." : "Vérifier le contenu"}
        </Button>
      )}
      
      <AnimatePresence>
        {result && !result.isSafe && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive" className="mb-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Contenu potentiellement inapproprié</AlertTitle>
              <AlertDescription>
                {result.reason || "Votre message contient un contenu qui pourrait être perçu comme inapproprié."}
                
                {showImprovements && result.suggestion && (
                  <div className="mt-2">
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => setImprovementVisible(prev => !prev)}
                    >
                      Voir la suggestion
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            {showImprovements && improvementVisible && result.suggestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2"
              >
                <div className="border rounded-md p-3 bg-background">
                  <p className="text-sm font-medium mb-2">Suggestion :</p>
                  <Textarea 
                    value={result.suggestion} 
                    readOnly 
                    className="mb-2"
                  />
                  <Button size="sm" onClick={handleAcceptSuggestion}>
                    Accepter la suggestion
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {result && result.isSafe && !autoModerate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className="mb-2 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-600">Contenu approprié</AlertTitle>
              <AlertDescription className="text-green-700">
                Votre message respecte les règles de la communauté.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmpatheticModeration;
