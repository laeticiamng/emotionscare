/**
 * Modal de filtres pour la découverte de buddies
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X, Check, RotateCcw } from 'lucide-react';
import type { BuddyFilters } from '../types';
import { BUDDY_INTERESTS, BUDDY_GOALS } from '../types';

interface BuddyFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: BuddyFilters;
  onApply: (filters: BuddyFilters) => void;
}

const AVAILABILITY_OPTIONS = [
  { value: 'online', label: 'En ligne' },
  { value: 'away', label: 'Absent' },
  { value: 'all', label: 'Tous' }
];

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'all', label: 'Tous niveaux' }
];

const AGE_RANGES = [
  { value: '18-24', label: '18-24 ans' },
  { value: '25-34', label: '25-34 ans' },
  { value: '35-44', label: '35-44 ans' },
  { value: '45-54', label: '45-54 ans' },
  { value: '55+', label: '55+ ans' },
  { value: 'all', label: 'Tous les âges' }
];

export const BuddyFiltersModal: React.FC<BuddyFiltersModalProps> = ({
  open,
  onOpenChange,
  filters: initialFilters,
  onApply
}) => {
  const [filters, setFilters] = useState<BuddyFilters>(initialFilters);

  const handleToggleInterest = (interest: string) => {
    const current = filters.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setFilters(prev => ({ ...prev, interests: updated }));
  };

  const handleToggleGoal = (goal: string) => {
    const current = filters.goals || [];
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    setFilters(prev => ({ ...prev, goals: updated }));
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleApply = () => {
    // Nettoyer les filtres vides
    const cleanFilters: BuddyFilters = {};
    if (filters.interests?.length) cleanFilters.interests = filters.interests;
    if (filters.goals?.length) cleanFilters.goals = filters.goals;
    if (filters.availability && filters.availability !== 'all') cleanFilters.availability = filters.availability;
    if (filters.experienceLevel && filters.experienceLevel !== 'all') cleanFilters.experienceLevel = filters.experienceLevel;
    if (filters.ageRange && filters.ageRange !== 'all') cleanFilters.ageRange = filters.ageRange;
    if (filters.location) cleanFilters.location = filters.location;
    
    onApply(cleanFilters);
    onOpenChange(false);
  };

  const activeFiltersCount = [
    filters.interests?.length || 0,
    filters.goals?.length || 0,
    filters.availability && filters.availability !== 'all' ? 1 : 0,
    filters.experienceLevel && filters.experienceLevel !== 'all' ? 1 : 0,
    filters.ageRange && filters.ageRange !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Disponibilité */}
            <div className="space-y-3">
              <Label>Disponibilité</Label>
              <Select
                value={filters.availability || 'all'}
                onValueChange={v => setFilters(prev => ({ ...prev, availability: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau d'expérience */}
            <div className="space-y-3">
              <Label>Niveau d'expérience</Label>
              <Select
                value={filters.experienceLevel || 'all'}
                onValueChange={v => setFilters(prev => ({ ...prev, experienceLevel: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tranche d'âge */}
            <div className="space-y-3">
              <Label>Tranche d'âge</Label>
              <Select
                value={filters.ageRange || 'all'}
                onValueChange={v => setFilters(prev => ({ ...prev, ageRange: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Centres d'intérêt */}
            <div className="space-y-3">
              <Label>Centres d'intérêt</Label>
              <div className="flex flex-wrap gap-2">
                {BUDDY_INTERESTS.map(interest => (
                  <Badge
                    key={interest}
                    variant={filters.interests?.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleToggleInterest(interest)}
                  >
                    {filters.interests?.includes(interest) && <Check className="h-3 w-3 mr-1" />}
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Objectifs */}
            <div className="space-y-3">
              <Label>Objectifs</Label>
              <div className="flex flex-wrap gap-2">
                {BUDDY_GOALS.map(goal => (
                  <Badge
                    key={goal}
                    variant={filters.goals?.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleToggleGoal(goal)}
                  >
                    {filters.goals?.includes(goal) && <Check className="h-3 w-3 mr-1" />}
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleApply} className="gap-2">
              <Filter className="h-4 w-4" />
              Appliquer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuddyFiltersModal;
