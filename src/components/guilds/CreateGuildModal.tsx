/**
 * CreateGuildModal - Modal de création de guilde
 * Permet aux utilisateurs de créer leur propre guilde
 */

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Sparkles, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateGuildData) => Promise<boolean>;
  isCreating?: boolean;
}

export interface CreateGuildData {
  name: string;
  description: string;
  emblem: string;
  privacy: 'public' | 'private';
  max_members: number;
}

const EMBLEMS = [
  '🛡️', '⚔️', '🏆', '🌟', '💎', '🔥', '🌙', '🌊',
  '🦁', '🦊', '🐉', '🦅', '🌸', '🍀', '⭐', '🎯',
  '🏔️', '🌈', '💫', '🎭', '🧘', '🎵', '❤️', '💜'
];

const MAX_MEMBER_OPTIONS = [10, 20, 50, 100];

export const CreateGuildModal = memo(({
  isOpen,
  onClose,
  onCreate,
  isCreating = false
}: CreateGuildModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateGuildData>({
    name: '',
    description: '',
    emblem: '🛡️',
    privacy: 'public',
    max_members: 50
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateGuildData, string>>>({});

  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit faire au moins 3 caractères';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Le nom ne peut pas dépasser 30 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit faire au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const success = await onCreate(formData);
    if (success) {
      onClose();
      setStep(1);
      setFormData({
        name: '',
        description: '',
        emblem: '🛡️',
        privacy: 'public',
        max_members: 50
      });
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Créer une Guilde
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Définissez l'identité de votre guilde" 
              : "Personnalisez les paramètres"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {step > 1 ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <div className={cn(
            "flex-1 h-1 rounded",
            step > 1 ? "bg-primary" : "bg-muted"
          )} />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            2
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="guild-name">Nom de la guilde</Label>
              <Input
                id="guild-name"
                placeholder="Ex: Les Gardiens du Bien-être"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guild-desc">Description</Label>
              <Textarea
                id="guild-desc"
                placeholder="Décrivez l'objectif et les valeurs de votre guilde..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={cn("resize-none h-24", errors.description && "border-destructive")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Emblème</Label>
              <div className="grid grid-cols-8 gap-2">
                {EMBLEMS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emblem: emoji }))}
                    className={cn(
                      "w-10 h-10 text-xl rounded-lg border-2 transition-all hover:scale-110",
                      formData.emblem === emoji 
                        ? "border-primary bg-primary/10" 
                        : "border-transparent bg-muted"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Preview */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-3xl">
                {formData.emblem}
              </div>
              <div>
                <h4 className="font-semibold">{formData.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Confidentialité</Label>
              <RadioGroup
                value={formData.privacy}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  privacy: value as 'public' | 'private' 
                }))}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex-1 cursor-pointer">
                    <div className="font-medium">Publique</div>
                    <p className="text-sm text-muted-foreground">
                      Tout le monde peut voir et rejoindre
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex-1 cursor-pointer">
                    <div className="font-medium">Privée</div>
                    <p className="text-sm text-muted-foreground">
                      Invitation requise pour rejoindre
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Nombre maximum de membres</Label>
              <div className="flex gap-2">
                {MAX_MEMBER_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, max_members: count }))}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg border transition-all",
                      formData.max_members === count
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
          )}
          
          {step === 1 ? (
            <Button onClick={handleNext}>
              Continuer
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Créer la guilde
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CreateGuildModal.displayName = 'CreateGuildModal';

export default CreateGuildModal;
