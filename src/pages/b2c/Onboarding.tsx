
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const onboardingSchema = z.object({
  age: z.string().min(1, { message: 'Veuillez sélectionner votre tranche d\'âge' }),
  objective: z.string().min(1, { message: 'Veuillez sélectionner votre objectif principal' }),
  interests: z.array(z.string()).min(1, { message: 'Veuillez sélectionner au moins un intérêt' }),
  notifications: z.boolean().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const B2COnboarding: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      age: '',
      objective: '',
      interests: [],
      notifications: true,
    },
  });

  const interests = [
    { id: 'meditation', label: 'Méditation' },
    { id: 'music_therapy', label: 'Thérapie par la musique' },
    { id: 'vr_relaxation', label: 'Relaxation en VR' },
    { id: 'emotional_tracking', label: 'Suivi émotionnel' },
    { id: 'stress_management', label: 'Gestion du stress' },
    { id: 'cognitive_exercises', label: 'Exercices cognitifs' },
    { id: 'sleep_improvement', label: 'Amélioration du sommeil' },
    { id: 'social_emotional', label: 'Intelligence sociale et émotionnelle' },
  ];

  const nextStep = () => {
    if (step === 1 && !form.getValues().age) {
      form.setError('age', { message: 'Veuillez sélectionner votre tranche d\'âge' });
      return;
    }
    if (step === 2 && !form.getValues().objective) {
      form.setError('objective', { message: 'Veuillez sélectionner votre objectif principal' });
      return;
    }
    setStep(current => current + 1);
  };

  const prevStep = () => {
    setStep(current => current - 1);
  };

  const onSubmit = async (values: OnboardingFormValues) => {
    setIsLoading(true);
    
    try {
      // Simuler une demande d'API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (user) {
        await updateUserProfile({
          preferences: {
            age: values.age,
            objective: values.objective,
            interests: values.interests,
            notifications: values.notifications,
          }
        });
      }
      
      toast.success('Configuration terminée avec succès');
      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Erreur d\'onboarding:', error);
      toast.error('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Bienvenue chez EmotionsCare</CardTitle>
              <CardDescription>
                Commençons par quelques informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre tranche d'âge</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre tranche d'âge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="18-24">18-24 ans</SelectItem>
                        <SelectItem value="25-34">25-34 ans</SelectItem>
                        <SelectItem value="35-44">35-44 ans</SelectItem>
                        <SelectItem value="45-54">45-54 ans</SelectItem>
                        <SelectItem value="55-64">55-64 ans</SelectItem>
                        <SelectItem value="65+">65 ans et plus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/b2c/dashboard')}
                >
                  Ignorer
                </Button>
                <Button onClick={nextStep}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Votre objectif</CardTitle>
              <CardDescription>
                Quel est votre objectif principal sur EmotionsCare?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectif principal</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre objectif" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stress_reduction">Réduction du stress</SelectItem>
                        <SelectItem value="emotional_balance">Équilibre émotionnel</SelectItem>
                        <SelectItem value="improve_sleep">Améliorer le sommeil</SelectItem>
                        <SelectItem value="focus_concentration">Concentration et focus</SelectItem>
                        <SelectItem value="personal_growth">Développement personnel</SelectItem>
                        <SelectItem value="manage_anxiety">Gérer l'anxiété</SelectItem>
                        <SelectItem value="general_wellbeing">Bien-être général</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <Button onClick={nextStep}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Vos intérêts</CardTitle>
              <CardDescription>
                Sélectionnez les domaines qui vous intéressent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-2">
                      {interests.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <Button onClick={nextStep}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Dernière étape</CardTitle>
              <CardDescription>
                Finalisez votre configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal">
                        Je souhaite recevoir des notifications et conseils personnalisés
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Vous pourrez modifier ce paramètre ultérieurement
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalisation...
                    </>
                  ) : (
                    'Terminer'
                  )}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-xl">
        <div className="relative">
          <div className="absolute top-0 left-0 w-full p-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 w-10 rounded ${
                      i <= step ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Étape {step} sur 4
              </span>
            </div>
          </div>
          <div className="pt-12">
            <Form {...form}>
              <form>{renderStepContent()}</form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default B2COnboarding;
