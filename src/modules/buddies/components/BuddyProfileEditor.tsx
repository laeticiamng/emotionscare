/**
 * Éditeur de profil buddy
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  Globe, 
  Target, 
  Heart, 
  Check,
  Camera,
  Loader2
} from 'lucide-react';
import type { BuddyProfile } from '../types';
import { BUDDY_INTERESTS, BUDDY_GOALS, LOOKING_FOR_OPTIONS } from '../types';

interface BuddyProfileEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: BuddyProfile | null;
  onSave: (updates: Partial<BuddyProfile>) => Promise<BuddyProfile | null>;
}

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' }
];

const LANGUAGES = [
  'Français', 'English', 'Español', 'Deutsch', 'Italiano', 'Português', 'العربية', '中文', '日本語'
];

const AGE_RANGES = [
  '18-24', '25-34', '35-44', '45-54', '55+'
];

export const BuddyProfileEditor: React.FC<BuddyProfileEditorProps> = ({
  open,
  onOpenChange,
  profile,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BuddyProfile>>({
    display_name: '',
    bio: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    age_range: '',
    interests: [],
    goals: [],
    looking_for: [],
    languages: ['Français'],
    experience_level: 'beginner',
    is_visible: true
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        age_range: profile.age_range || '',
        interests: profile.interests || [],
        goals: profile.goals || [],
        looking_for: profile.looking_for || [],
        languages: profile.languages || ['Français'],
        experience_level: profile.experience_level || 'beginner',
        is_visible: profile.is_visible ?? true
      });
    }
  }, [profile]);

  const handleToggleItem = (field: 'interests' | 'goals' | 'looking_for' | 'languages', item: string) => {
    const currentList = formData[field] as string[] || [];
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const handleSubmit = async () => {
    if (!formData.display_name?.trim()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {profile ? 'Modifier mon profil Buddy' : 'Créer mon profil Buddy'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Avatar & Name */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {formData.display_name?.charAt(0) || 'B'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="display_name">Nom d'affichage *</Label>
                <Input
                  id="display_name"
                  placeholder="Comment voulez-vous être appelé ?"
                  value={formData.display_name}
                  onChange={e => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Présentez-vous en quelques mots..."
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio?.length || 0}/500
              </p>
            </div>

            {/* Location & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Localisation
                </Label>
                <Input
                  id="location"
                  placeholder="Paris, France"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tranche d'âge</Label>
                <Select
                  value={formData.age_range}
                  onValueChange={v => setFormData(prev => ({ ...prev, age_range: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label>Niveau d'expérience en bien-être</Label>
              <Select
                value={formData.experience_level}
                onValueChange={v => setFormData(prev => ({ ...prev, experience_level: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> Centres d'intérêt
              </Label>
              <div className="flex flex-wrap gap-2">
                {BUDDY_INTERESTS.map(interest => (
                  <Badge
                    key={interest}
                    variant={formData.interests?.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleItem('interests', interest)}
                  >
                    {formData.interests?.includes(interest) && <Check className="h-3 w-3 mr-1" />}
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Target className="h-3 w-3" /> Objectifs
              </Label>
              <div className="flex flex-wrap gap-2">
                {BUDDY_GOALS.map(goal => (
                  <Badge
                    key={goal}
                    variant={formData.goals?.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleItem('goals', goal)}
                  >
                    {formData.goals?.includes(goal) && <Check className="h-3 w-3 mr-1" />}
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div className="space-y-2">
              <Label>Ce que je recherche</Label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map(option => (
                  <Badge
                    key={option.value}
                    variant={formData.looking_for?.includes(option.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleItem('looking_for', option.value)}
                  >
                    {formData.looking_for?.includes(option.value) && <Check className="h-3 w-3 mr-1" />}
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> Langues parlées
              </Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <Badge
                    key={lang}
                    variant={formData.languages?.includes(lang) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleItem('languages', lang)}
                  >
                    {formData.languages?.includes(lang) && <Check className="h-3 w-3 mr-1" />}
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Profil visible</p>
                <p className="text-sm text-muted-foreground">
                  Permettre aux autres de vous découvrir
                </p>
              </div>
              <Switch
                checked={formData.is_visible}
                onCheckedChange={v => setFormData(prev => ({ ...prev, is_visible: v }))}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.display_name?.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuddyProfileEditor;
