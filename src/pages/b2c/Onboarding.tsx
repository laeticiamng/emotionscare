
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight, Heart, Brain, Music, Users } from 'lucide-react';

// Étape 1: Informations personnelles
const personalInfoSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  birthdate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
});

// Étape 2: Objectifs de bien-être
const wellbeingGoalsSchema = z.object({
  goals: z.array(z.string()).min(1, 'Sélectionnez au moins un objectif'),
  customGoal: z.string().optional(),
});

// Étape 3: Préférences de contenus
const contentPreferencesSchema = z.object({
  musicPreference: z.number().min(0).max(100),
  meditationPreference: z.number().min(0).max(100),
  readingPreference: z.number().min(0).max(100),
  socialPreference: z.number().min(0).max(100),
});

type FormDataTypes = {
  displayName: string;
  birthdate?: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  goals: string[];
  customGoal?: string;
  musicPreference: number;
  meditationPreference: number;
  readingPreference: number;
  socialPreference: number;
};

const wellbeingGoalOptions = [
  { value: 'reduce-stress', label: 'Réduire le stress' },
  { value: 'improve-sleep', label: 'Améliorer le sommeil' },
  { value: 'increase-energy', label: 'Augmenter mon énergie' },
  { value: 'focus-better', label: 'Améliorer ma concentration' },
  { value: 'manage-emotions', label: 'Mieux gérer mes émotions' },
  { value: 'social-connections', label: 'Développer mes relations sociales' },
];

const B2COnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormDataTypes>>({
    gender: 'prefer-not-to-say',
    goals: [],
    musicPreference: 50,
    meditationPreference: 50,
    readingPreference: 50,
    socialPreference: 50,
  });
  
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      displayName: user?.name || '',
      birthdate: '',
      gender: 'prefer-not-to-say',
    },
  });

  const wellbeingGoalsForm = useForm<z.infer<typeof wellbeingGoalsSchema>>({
    resolver: zodResolver(wellbeingGoalsSchema),
    defaultValues: {
      goals: [],
      customGoal: '',
    },
  });

  const contentPreferencesForm = useForm<z.infer<typeof contentPreferencesSchema>>({
    resolver: zodResolver(contentPreferencesSchema),
    defaultValues: {
      musicPreference: 50,
      meditationPreference: 50,
      readingPreference: 50,
      socialPreference: 50,
    },
  });

  const handlePersonalInfoSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    setFormData({
      ...formData,
      ...data,
    });
    setCurrentStep(2);
  };

  const handleWellbeingGoalsSubmit = (data: z.infer<typeof wellbeingGoalsSchema>) => {
    setFormData({
      ...formData,
      ...data,
    });
    setCurrentStep(3);
  };

  const handleContentPreferencesSubmit = async (data: z.infer<typeof contentPreferencesSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Combinaison de toutes les données du formulaire
      const finalFormData = {
        ...formData,
        ...data,
      };
      
      // Simule une requête API (à remplacer par un appel réel)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Données d\'onboarding soumises:', finalFormData);
      
      // Redirection vers le tableau de bord après traitement
      toast.success('Profil configuré avec succès !');
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la configuration du profil. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Redirige directement vers le tableau de bord pour les utilisateurs qui souhaitent sauter l'onboarding
    toast.info('Onboarding ignoré. Vous pourrez compléter votre profil plus tard.');
    navigate('/b2c/dashboard');
  };

  const renderPersonalInfoForm = () => (
    <Form {...personalInfoForm}>
      <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
        <FormField
          control={personalInfoForm.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'affichage</FormLabel>
              <FormControl>
                <Input placeholder="Comment souhaitez-vous être appelé ?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={personalInfoForm.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance (optionnel)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={personalInfoForm.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Homme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Femme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Autre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                    <Label htmlFor="prefer-not-to-say">Je préfère ne pas préciser</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={handleSkip}>
            Ignorer
          </Button>
          <Button type="submit">
            Suivant <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderWellbeingGoalsForm = () => (
    <Form {...wellbeingGoalsForm}>
      <form onSubmit={wellbeingGoalsForm.handleSubmit(handleWellbeingGoalsSubmit)} className="space-y-6">
        <FormField
          control={wellbeingGoalsForm.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectifs de bien-être</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {wellbeingGoalOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option.value}
                        value={option.value}
                        checked={field.value?.includes(option.value)}
                        onChange={e => {
                          const value = e.target.value;
                          const updatedValues = e.target.checked
                            ? [...(field.value || []), value]
                            : (field.value || []).filter(val => val !== value);
                          field.onChange(updatedValues);
                        }}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={wellbeingGoalsForm.control}
          name="customGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autre objectif (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez un autre objectif de bien-être que vous souhaitez atteindre"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
          </Button>
          <Button type="submit">
            Suivant <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderContentPreferencesForm = () => (
    <Form {...contentPreferencesForm}>
      <form onSubmit={contentPreferencesForm.handleSubmit(handleContentPreferencesSubmit)} className="space-y-6">
        <FormField
          control={contentPreferencesForm.control}
          name="musicPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Préférence pour la musicothérapie
              </FormLabel>
              <FormControl>
                <div className="pt-2 pb-6">
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={value => field.onChange(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Faible</span>
                    <span className="font-medium">{field.value}%</span>
                    <span>Élevée</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={contentPreferencesForm.control}
          name="meditationPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Préférence pour la méditation
              </FormLabel>
              <FormControl>
                <div className="pt-2 pb-6">
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={value => field.onChange(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Faible</span>
                    <span className="font-medium">{field.value}%</span>
                    <span>Élevée</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={contentPreferencesForm.control}
          name="readingPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Préférence pour le contenu écrit
              </FormLabel>
              <FormControl>
                <div className="pt-2 pb-6">
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={value => field.onChange(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Faible</span>
                    <span className="font-medium">{field.value}%</span>
                    <span>Élevée</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={contentPreferencesForm.control}
          name="socialPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Préférence pour les activités sociales
              </FormLabel>
              <FormControl>
                <div className="pt-2 pb-6">
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={value => field.onChange(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Faible</span>
                    <span className="font-medium">{field.value}%</span>
                    <span>Élevée</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalisation...
              </>
            ) : (
              'Terminer'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      {[1, 2, 3].map(step => (
        <motion.div
          key={step}
          className={`h-2 w-16 mx-1 rounded-full ${
            step === currentStep ? 'bg-primary' : step < currentStep ? 'bg-primary/60' : 'bg-muted'
          }`}
          animate={{
            backgroundColor: step === currentStep 
              ? 'var(--primary)' 
              : step < currentStep 
                ? 'rgba(var(--primary), 0.6)' 
                : 'var(--muted)'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Informations personnelles';
      case 2:
        return 'Objectifs de bien-être';
      case 3:
        return 'Préférences de contenu';
      default:
        return '';
    }
  };

  const renderStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Présentez-vous pour personnaliser votre expérience';
      case 2:
        return 'Quels objectifs de bien-être souhaitez-vous atteindre ?';
      case 3:
        return 'Quels types de contenus préférez-vous pour votre bien-être ?';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            {renderStepIndicator()}
            <CardTitle className="text-2xl font-bold text-center">{renderStepTitle()}</CardTitle>
            <CardDescription className="text-center">{renderStepDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && renderPersonalInfoForm()}
            {currentStep === 2 && renderWellbeingGoalsForm()}
            {currentStep === 3 && renderContentPreferencesForm()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboarding;
