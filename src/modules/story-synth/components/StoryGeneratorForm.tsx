/**
 * Formulaire de génération d'histoire
 * @module story-synth
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Sparkles, 
  Settings2,
  ChevronDown,
  Book,
  User,
  MapPin,
  Palette,
  Music
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { StoryTheme, StoryTone, StoryPov, StoryStyle } from '../types';

interface StoryGeneratorFormProps {
  onGenerate: (config: StoryGenerationFormData) => void;
  isGenerating?: boolean;
}

export interface StoryGenerationFormData {
  theme: StoryTheme;
  tone: StoryTone;
  pov: StoryPov;
  style: StoryStyle;
  protagonist: string;
  location: string;
  length: number;
  seed?: string;
  userContext?: string;
  ambient?: string;
}

const themes: { value: StoryTheme; label: string; emoji: string; color: string }[] = [
  { value: 'calme', label: 'Calme', emoji: '🌊', color: 'from-blue-500 to-cyan-500' },
  { value: 'aventure', label: 'Aventure', emoji: '⚔️', color: 'from-orange-500 to-red-500' },
  { value: 'poetique', label: 'Poétique', emoji: '🌸', color: 'from-purple-500 to-pink-500' },
  { value: 'mysterieux', label: 'Mystérieux', emoji: '🔮', color: 'from-slate-600 to-slate-800' },
  { value: 'romance', label: 'Romance', emoji: '💕', color: 'from-rose-400 to-pink-500' },
  { value: 'introspection', label: 'Introspection', emoji: '🧘', color: 'from-indigo-500 to-purple-500' },
  { value: 'nature', label: 'Nature', emoji: '🌲', color: 'from-green-500 to-emerald-500' },
];

const tones: { value: StoryTone; label: string }[] = [
  { value: 'apaisant', label: 'Apaisant' },
  { value: 'encourageant', label: 'Encourageant' },
  { value: 'contemplatif', label: 'Contemplatif' },
  { value: 'joyeux', label: 'Joyeux' },
  { value: 'nostalgique', label: 'Nostalgique' },
  { value: 'esperant', label: 'Espérant' },
];

const povs: { value: StoryPov; label: string }[] = [
  { value: 'je', label: 'Je (1ère personne)' },
  { value: 'il', label: 'Il (3ème personne)' },
  { value: 'elle', label: 'Elle (3ème personne)' },
  { value: 'nous', label: 'Nous (collectif)' },
];

const styles: { value: StoryStyle; label: string }[] = [
  { value: 'sobre', label: 'Sobre' },
  { value: 'lyrique', label: 'Lyrique' },
  { value: 'journal', label: 'Journal intime' },
  { value: 'dialogue', label: 'Dialogue' },
];

const ambients = [
  { value: 'aucun', label: 'Aucune' },
  { value: 'doux', label: 'Lofi doux' },
  { value: 'pluie', label: 'Pluie' },
  { value: 'foret', label: 'Forêt' },
  { value: 'ocean', label: 'Océan' },
];

export const StoryGeneratorForm = memo(function StoryGeneratorForm({
  onGenerate,
  isGenerating = false,
}: StoryGeneratorFormProps) {
  const [theme, setTheme] = useState<StoryTheme>('calme');
  const [tone, setTone] = useState<StoryTone>('apaisant');
  const [pov, setPov] = useState<StoryPov>('je');
  const [style, setStyle] = useState<StoryStyle>('sobre');
  const [protagonist, setProtagonist] = useState('Alex');
  const [location, setLocation] = useState('un jardin paisible');
  const [length, setLength] = useState(5);
  const [seed, setSeed] = useState('');
  const [userContext, setUserContext] = useState('');
  const [ambient, setAmbient] = useState('aucun');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    onGenerate({
      theme,
      tone,
      pov,
      style,
      protagonist,
      location,
      length,
      seed: seed || undefined,
      userContext: userContext || undefined,
      ambient,
    });
  };

  const _selectedTheme = themes.find(t => t.value === theme);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-5">
        <Wand2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Créer une histoire</h2>
      </div>

      <div className="space-y-5">
        {/* Theme Selection */}
        <div>
          <Label className="mb-3 flex items-center gap-2">
            <Book className="w-4 h-4" />
            Thème
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {themes.map(t => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'p-3 rounded-xl text-center transition-all',
                  'border-2 hover:scale-105',
                  theme === t.value
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <span className="text-2xl block mb-1">{t.emoji}</span>
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <Label className="mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tonalité
          </Label>
          <Select value={tone} onValueChange={(v) => setTone(v as StoryTone)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Protagonist & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Protagoniste
            </Label>
            <Input
              value={protagonist}
              onChange={(e) => setProtagonist(e.target.value)}
              placeholder="Nom du héros"
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lieu
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Où se déroule l'histoire?"
            />
          </div>
        </div>

        {/* Length */}
        <div>
          <Label className="mb-2 flex items-center justify-between">
            <span>Longueur</span>
            <span className="text-sm text-muted-foreground">{length} paragraphes</span>
          </Label>
          <Slider
            value={[length]}
            min={3}
            max={10}
            step={1}
            onValueChange={([v]) => setLength(v)}
          />
        </div>

        {/* Ambient Sound */}
        <div>
          <Label className="mb-2 flex items-center gap-2">
            <Music className="w-4 h-4" />
            Ambiance sonore
          </Label>
          <Select value={ambient} onValueChange={setAmbient}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ambients.map(a => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Options avancées
              </span>
              <ChevronDown className={cn(
                'w-4 h-4 transition-transform',
                showAdvanced && 'rotate-180'
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Point de vue</Label>
                <Select value={pov} onValueChange={(v) => setPov(v as StoryPov)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {povs.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Style</Label>
                <Select value={style} onValueChange={(v) => setStyle(v as StoryStyle)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2">Contexte personnel (optionnel)</Label>
              <Textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="Partagez comment vous vous sentez ou ce que vous souhaitez explorer..."
                rows={3}
              />
            </div>

            <div>
              <Label className="mb-2">Seed (reproductibilité)</Label>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Optionnel - pour générer la même histoire"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Générer l'histoire
            </>
          )}
        </Button>
      </div>
    </Card>
  );
});

export default StoryGeneratorForm;
