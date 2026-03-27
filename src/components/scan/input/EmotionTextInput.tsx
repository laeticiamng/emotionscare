// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Mic, MicOff, Clock, Save, FileText, 
  TrendingUp, Heart, Lightbulb, ChevronDown, Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useScanSettings, TextDraft, TextHistoryEntry } from '@/hooks/useScanSettings';

const TEMPLATES = [
  { id: 'morning', label: '🌅 Matin', text: "Ce matin, je me sens..." },
  { id: 'evening', label: '🌙 Soir', text: "Aujourd'hui, j'ai ressenti..." },
  { id: 'gratitude', label: '🙏 Gratitude', text: "Je suis reconnaissant(e) pour..." },
  { id: 'challenge', label: '💪 Défi', text: "Le défi que j'affronte est..." },
  { id: 'joy', label: '✨ Joie', text: "Ce qui m'a rendu(e) heureux/heureuse..." },
  { id: 'worry', label: '😟 Inquiétude', text: "Ce qui me préoccupe..." },
];

const EMOTION_KEYWORDS = {
  positive: ['heureux', 'content', 'joie', 'calme', 'serein', 'bien', 'super', 'génial', 'merci', 'amour', 'espoir', 'confiant', 'fier', 'satisfait', 'paisible'],
  negative: ['triste', 'anxieux', 'peur', 'colère', 'frustré', 'stressé', 'fatigué', 'épuisé', 'seul', 'inquiet', 'mal', 'déçu', 'perdu', 'submergé'],
  neutral: ['normal', 'correct', 'moyen', 'ordinaire', 'habituel']
};

interface EmotionTextInputProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const EmotionTextInput: React.FC<EmotionTextInputProps> = ({ 
  value, 
  onChange, 
  maxLength = 500,
  placeholder = "Décrivez ce que vous ressentez...",
  className = "" 
}) => {
  const { textDrafts, textHistory, saveTextDraft, addTextHistory } = useScanSettings();
  
  const [isRecording, setIsRecording] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [drafts, setDrafts] = useState<TextDraft[]>(textDrafts);
  const [history, setHistory] = useState<TextHistoryEntry[]>(textHistory);
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autosaveTimer, setAutosaveTimer] = useState<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync from hook
  useEffect(() => {
    setDrafts(textDrafts);
    setHistory(textHistory);
  }, [textDrafts, textHistory]);

  // Analyze sentiment in real-time
  useEffect(() => {
    const words = value.toLowerCase().split(/\s+/);
    setWordCount(value.trim() ? words.length : 0);

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (EMOTION_KEYWORDS.positive.some(kw => word.includes(kw))) positiveCount++;
      if (EMOTION_KEYWORDS.negative.some(kw => word.includes(kw))) negativeCount++;
    });

    if (positiveCount > negativeCount && positiveCount > 0) {
      setSentiment('positive');
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      setSentiment('negative');
    } else if (value.length > 10) {
      setSentiment('neutral');
    } else {
      setSentiment(null);
    }

    // Generate suggestions based on content
    if (value.length > 20 && value.length < 50) {
      setSuggestions([
        "Pouvez-vous préciser ce qui a déclenché ce sentiment ?",
        "Comment votre corps réagit-il à cette émotion ?",
        "Qu'aimeriez-vous faire pour vous sentir mieux ?"
      ]);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  // Autosave draft
  useEffect(() => {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    
    if (value.length > 20) {
      const timer = setTimeout(() => {
        saveDraft(true);
      }, 5000);
      setAutosaveTimer(timer);
    }

    return () => {
      if (autosaveTimer) clearTimeout(autosaveTimer);
    };
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    onChange(template.text);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const saveDraft = (auto = false) => {
    if (!value.trim()) return;
    
    const newDraft = {
      text: value,
      date: new Date().toISOString()
    };
    
    saveTextDraft(newDraft);
    setDrafts(prev => [{ id: Date.now().toString(), ...newDraft }, ...prev.filter(d => d.text !== value)].slice(0, 10));
    
    if (!auto) {
      // Show feedback
    }
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    onChange(draft.text);
    setShowHistory(false);
  };

  const saveToHistory = () => {
    if (!value.trim()) return;
    
    const entry = {
      text: value,
      date: new Date().toISOString(),
      sentiment: sentiment || 'neutral'
    };
    
    addTextHistory(entry);
    setHistory(prev => [entry, ...prev].slice(0, 50));
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          onChange(value + ' ' + transcript);
        };
        
        recognition.start();
        setIsRecording(true);
        
        (window as any).currentRecognition = recognition;
      }
    } else {
      // Stop recording
      if ((window as any).currentRecognition) {
        (window as any).currentRecognition.stop();
      }
      setIsRecording(false);
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentLabel = () => {
    switch (sentiment) {
      case 'positive': return '😊 Positif';
      case 'negative': return '😔 À explorer';
      default: return '😐 Neutre';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Templates */}
        <Collapsible open={showTemplates} onOpenChange={setShowTemplates}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Modèles d'écriture
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-lg mt-2"
            >
              {TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                  className="text-xs"
                >
                  {template.label}
                </Button>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Main textarea */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`min-h-[150px] resize-y pr-12 ${className} ${isRecording ? 'ring-2 ring-red-500' : ''}`}
            maxLength={maxLength}
          />
          
          {/* Recording indicator */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
              >
                <span className="animate-pulse">●</span>
                Enregistrement...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? 'Arrêter' : 'Dicter'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => saveDraft(false)}
                  disabled={!value.trim()}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sauvegarder brouillon</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Progress and sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {value.length}/{maxLength} caractères
              </span>
              <span className="text-muted-foreground">
                {wordCount} mots
              </span>
            </div>
            
            {sentiment && (
              <Badge variant="outline" className={getSentimentColor()}>
                {getSentimentLabel()}
              </Badge>
            )}
          </div>
          
          <Progress value={(value.length / maxLength) * 100} className="h-1" />
        </div>

        {/* AI Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Suggestions pour approfondir</span>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => onChange(value + '\n\n' + suggestion)}
                  >
                    • {suggestion}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drafts and History */}
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Brouillons et historique ({drafts.length})
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 mt-2 max-h-40 overflow-y-auto"
            >
              {drafts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Aucun brouillon sauvegardé
                </p>
              ) : (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => loadDraft(draft)}
                    className="p-2 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-xs line-clamp-2">{draft.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(draft.date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Stats */}
        {history.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {history.length} entrées précédentes
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {history.filter(h => h.sentiment === 'positive').length} positives
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EmotionTextInput;
