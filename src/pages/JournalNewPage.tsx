import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, Save, Mic, MicOff, Camera, Image, Calendar, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog';
import { useJournalMutations } from '@/hooks/useJournalMutations';
import { useToast } from '@/hooks/use-toast';
import { JournalTemplatesSelector, JournalTemplate } from '@/components/journal/JournalTemplatesSelector';

const JournalNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { showDisclaimer, handleAccept, handleDecline } = useMedicalDisclaimer('journal');
  const { createEntry, loading } = useJournalMutations();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
  const { prefersReducedMotion } = useMotionPrefs();
  const [moodAnnouncement, setMoodAnnouncement] = useState('Aucune humeur sélectionnée pour le moment');
  const [journalAnnouncement, setJournalAnnouncement] = useState('Contenu du journal vide');

  const moodOptions = [
    { value: 'happy', label: '😊 Joyeux', color: 'bg-warning/20 text-warning-foreground' },
    { value: 'calm', label: '😌 Calme', color: 'bg-info/20 text-info-foreground' },
    { value: 'anxious', label: '😰 Anxieux', color: 'bg-warning/30 text-warning-foreground' },
    { value: 'sad', label: '😢 Triste', color: 'bg-muted text-muted-foreground' },
    { value: 'excited', label: '🤩 Excité', color: 'bg-accent text-accent-foreground' },
    { value: 'tired', label: '😴 Fatigué', color: 'bg-secondary text-secondary-foreground' },
    { value: 'grateful', label: '🙏 Reconnaissant', color: 'bg-success/20 text-success-foreground' },
  ];

  const suggestedTags = [
    'travail', 'famille', 'sport', 'santé', 'créativité', 'voyage', 
    'amis', 'lecture', 'nature', 'méditation', 'objectifs', 'défis'
  ];

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erreur",
        description: 'Veuillez remplir au moins le titre et le contenu',
        variant: "destructive",
      });
      return;
    }

    try {
      await createEntry({
        title: title.trim(),
        content: content.trim(),
        mood,
        tags,
        is_private: isPrivate,
      });

      toast({
        title: "Entrée sauvegardée",
        description: "Votre entrée de journal a été sauvegardée avec succès",
      });

      logger.info('Journal entry saved successfully', { title }, 'UI');

      // Retour vers la page journal
      navigate('/app/journal');
    } catch (error) {
      logger.error('Failed to save journal entry', error as Error, 'UI');
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'entrée. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleRecording = useCallback(() => {
    // Arrêter l'enregistrement
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    // Vérifier la disponibilité de l'API Web Speech
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast({
        title: "Dictée vocale indisponible",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale. Essayez Chrome ou Edge.",
        variant: "destructive",
      });
      return;
    }

    // Démarrer la reconnaissance vocale
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setContent(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      logger.error('Speech recognition error', { error: event.error }, 'UI');
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone refusé",
          description: "Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.",
          variant: "destructive",
        });
      } else if (event.error !== 'aborted') {
        toast({
          title: "Erreur de dictée vocale",
          description: "La reconnaissance vocale a rencontré un problème. Veuillez réessayer.",
          variant: "destructive",
        });
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);

    toast({
      title: "Dictée vocale activée",
      description: "Parlez, votre texte s'ajoutera automatiquement au contenu.",
    });
  }, [isRecording, toast]);

  const handleSelectTemplate = (template: JournalTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    // Auto-remplir le titre avec le nom du template
    if (!title) {
      setTitle(template.title + ' - ' + new Date().toLocaleDateString('fr-FR'));
    }
    // Ajouter les prompts comme contenu d'aide
    if (!content) {
      setContent(template.prompts.map((p, i) => `${i + 1}. ${p}\n\n`).join(''));
    }
  };

  const selectedMoodData = moodOptions.find(m => m.value === mood);

  useEffect(() => {
    if (selectedMoodData) {
      setMoodAnnouncement(`Humeur sélectionnée : ${selectedMoodData.label.replace(/^[^A-Za-zÀ-ÿ0-9\s]*/u, '').trim()}`);
    } else {
      setMoodAnnouncement('Aucune humeur sélectionnée pour le moment');
    }
  }, [selectedMoodData]);

  useEffect(() => {
    if (content.trim().length === 0) {
      setJournalAnnouncement('Contenu du journal vide');
    } else {
      setJournalAnnouncement(`Contenu du journal mis à jour, ${content.length} caractères saisis`);
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div aria-live="polite" role="status" className="sr-only" data-testid="journal-live-region">
        <span>{moodAnnouncement}</span>
        <span>{journalAnnouncement}</span>
      </div>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              aria-label="Retourner à la page précédente"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Nouvelle Entrée</h1>
              <p className="text-sm text-muted-foreground">Partagez vos pensées et émotions</p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={loading || !title.trim() || !content.trim()} className="flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Templates Selector */}
        <Collapsible open={showTemplates} onOpenChange={setShowTemplates}>
          <Card className="p-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Templates guidés</span>
                  {selectedTemplate && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTemplate.title}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {showTemplates ? 'Masquer' : 'Afficher'}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <JournalTemplatesSelector
                onSelectTemplate={handleSelectTemplate}
                selectedTemplateId={selectedTemplate?.id}
              />
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* Métadonnées */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block" htmlFor="journal-date">
                Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="journal-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block" htmlFor="journal-mood">
                Humeur
              </label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="journal-mood" aria-describedby="journal-mood-help">
                  <SelectValue placeholder="Comment vous sentez-vous ?" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="journal-mood-help" className="sr-only">
                Sélectionnez une humeur pour contextualiser votre entrée de journal.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block" htmlFor="journal-visibility">
                Visibilité
              </label>
              <Select value={isPrivate ? 'private' : 'public'} onValueChange={(value) => setIsPrivate(value === 'private')}>
                <SelectTrigger id="journal-visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">🔒 Privé</SelectItem>
                  <SelectItem value="public">🌍 Partagé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedMoodData && (
            <div className="mt-4">
              <Badge className={selectedMoodData.color} aria-live="polite">
                {selectedMoodData.label}
              </Badge>
            </div>
          )}
        </Card>

        {/* Contenu Principal */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Donnez un titre à votre entrée..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            <div className="relative">
                <Textarea
                  placeholder="Que s'est-il passé aujourd'hui ? Comment vous sentez-vous ? Qu'avez-vous appris ?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-none"
                />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecording}
                  aria-pressed={isRecording}
                  aria-label={isRecording ? 'Arrêter la dictée vocale' : 'Commencer la dictée vocale'}
                  className={cn(
                    isRecording ? 'bg-destructive/20 text-destructive' : '',
                    isRecording && !prefersReducedMotion ? 'animate-pulse' : ''
                  )}
                >
                  {isRecording ? <MicOff className="w-4 h-4" aria-hidden="true" /> : <Mic className="w-4 h-4" aria-hidden="true" />}
                </Button>
                <Button variant="ghost" size="sm" aria-label="Ajouter une photo au journal">
                  <Camera className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Ajouter une image au journal">
                  <Image className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground" aria-live="polite">
              {content.length} caractères • ~{Math.ceil(content.split(' ').length / 200)} min de lecture
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Tags</h3>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      removeTag(tag);
                    }
                  }}
                  aria-label={`Retirer le tag ${tag}`}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tags suggérés :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addTag(tag)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      addTag(tag);
                    }
                  }}
                  aria-label={`Ajouter le tag ${tag}`}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Conseils d'écriture */}
        <Card className="p-4 bg-info/10 border-info/20">
          <h3 className="font-medium text-info-foreground mb-2">💡 Conseils pour bien écrire</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Soyez authentique et honnête avec vos émotions</li>
            <li>• Décrivez les détails qui ont marqué votre journée</li>
            <li>• Notez ce pour quoi vous êtes reconnaissant</li>
            <li>• Identifiez les leçons apprises ou les réflexions importantes</li>
          </ul>
        </Card>
      </div>
      
      <MedicalDisclaimerDialog 
        feature="journal"
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
};

export default JournalNewPage;