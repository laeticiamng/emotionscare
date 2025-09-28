
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PenLine, MusicIcon, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import EmotionCircleSelector from './EmotionCircleSelector';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useMusic } from '@/hooks/useMusic';

interface JournalEntryFormProps {
  onSubmit: (data: any) => void;
  isSaving?: boolean;
  onEmotionSelect?: (emotion: string) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ 
  onSubmit, 
  isSaving = false,
  onEmotionSelect
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writeMode, setWriteMode] = useState('free');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [isZenMode, setIsZenMode] = useState(false);
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { getEmotionMusicDescription } = useMusicEmotionIntegration();
  const { setOpenDrawer } = useMusic();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez écrire au moins quelques mots dans votre journal.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit({
      title: title || `Journal du ${new Date().toLocaleDateString()}`,
      content,
      emotion: selectedEmotion,
      intensity: emotionIntensity,
      date: new Date().toISOString()
    });
  };
  
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    if (onEmotionSelect) {
      onEmotionSelect(emotion);
    }
  };
  
  const handleCreateMusic = () => {
    if (selectedEmotion) {
      setOpenDrawer(true);
      toast({
        title: "Musique thérapeutique",
        description: getEmotionMusicDescription(selectedEmotion)
      });
    } else {
      toast({
        title: "Sélectionnez une émotion",
        description: "Veuillez d'abord sélectionner comment vous vous sentez.",
        variant: "default"
      });
    }
  };
  
  const toggleZenMode = () => {
    setIsZenMode(!isZenMode);
    
    // Focus on the textarea after toggling zen mode
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }, 100);
  };
  
  return (
    <div className="space-y-8">
      <Tabs 
        defaultValue="free" 
        value={writeMode} 
        onValueChange={setWriteMode}
        className={isZenMode ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="free" className="flex gap-2 items-center">
            <PenLine className="h-4 w-4" />
            <span>Libre</span>
          </TabsTrigger>
          <TabsTrigger value="guided" className="flex gap-2 items-center">
            <BookOpen className="h-4 w-4" />
            <span>Guidé</span>
          </TabsTrigger>
          <TabsTrigger value="inspiration" className="flex gap-2 items-center">
            <Sparkles className="h-4 w-4" />
            <span>Inspiré</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="free">
          <p className="text-muted-foreground mb-4">
            Écrivez librement ce qui vous passe par l'esprit. C'est votre espace personnel.
          </p>
        </TabsContent>
        
        <TabsContent value="guided">
          <div className="space-y-4 mb-4">
            <p className="text-muted-foreground">
              Répondez à ces questions pour explorer vos pensées plus en profondeur.
            </p>
            <div className="grid gap-2">
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => setContent(prev => prev + "\n\nComment je me sens aujourd'hui et pourquoi ?\n")}
              >
                Comment je me sens aujourd'hui et pourquoi ?
              </Button>
              <Button 
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => setContent(prev => prev + "\n\nQu'est-ce qui m'a apporté de la joie récemment ?\n")}
              >
                Qu'est-ce qui m'a apporté de la joie récemment ?
              </Button>
              <Button 
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => setContent(prev => prev + "\n\nQu'ai-je appris sur moi aujourd'hui ?\n")}
              >
                Qu'ai-je appris sur moi aujourd'hui ?
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inspiration">
          <div className="space-y-4 mb-4">
            <p className="text-muted-foreground">
              Laissez-vous inspirer par ces thèmes pour votre écriture.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setContent(prev => prev + "\n\nMon lieu préféré et ce que j'y ressens...\n")}
              >
                <h4 className="font-medium mb-1">Lieu préféré</h4>
                <p className="text-sm text-muted-foreground">Explorez un lieu qui vous apaise</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setContent(prev => prev + "\n\nUne rencontre qui m'a transformé...\n")}
              >
                <h4 className="font-medium mb-1">Rencontre marquante</h4>
                <p className="text-sm text-muted-foreground">Réfléchissez à une personne importante</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setContent(prev => prev + "\n\nCe qui me fait me sentir vivant...\n")}
              >
                <h4 className="font-medium mb-1">Énergie vitale</h4>
                <p className="text-sm text-muted-foreground">Ce qui vous fait vibrer</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setContent(prev => prev + "\n\nUne chose que j'aimerais changer en moi...\n")}
              >
                <h4 className="font-medium mb-1">Transformation</h4>
                <p className="text-sm text-muted-foreground">Imaginez un changement personnel</p>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={isZenMode ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}>
          <Label htmlFor="title">Titre (optionnel)</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5"
            placeholder="Donnez un titre à votre entrée de journal..."
          />
        </div>
        
        <div className="relative">
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`min-h-[300px] p-6 text-lg resize-none leading-relaxed ${isZenMode ? 'bg-transparent text-xl border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0' : ''}`}
            placeholder={isZenMode ? "Écrivez librement..." : "Que ressentez-vous aujourd'hui ?"}
            id="content"
          />
          
          {isZenMode && (
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className="absolute top-2 right-2 opacity-30 hover:opacity-100"
              onClick={toggleZenMode}
            >
              Quitter le mode zen
            </Button>
          )}
        </div>
        
        <div className={isZenMode ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}>
          <div className="mb-6">
            <Label>Comment vous sentez-vous ?</Label>
            <div className="mt-3">
              <EmotionCircleSelector 
                onSelect={handleEmotionSelect}
                selected={selectedEmotion}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleZenMode}
              >
                Mode zen
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateMusic}
                className="flex items-center gap-2"
              >
                <MusicIcon className="h-4 w-4" />
                Musique thérapeutique
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSaving || !content.trim()}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>
      </form>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={isSaving ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        className="text-center py-4 text-muted-foreground"
      >
        Enregistrement de votre journal en cours...
      </motion.div>
    </div>
  );
};

export default JournalEntryForm;
