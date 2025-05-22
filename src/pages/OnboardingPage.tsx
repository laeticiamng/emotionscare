
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setProgress(((step + 1) / totalSteps) * 100);
    } else {
      // Redirect based on user mode
      if (userMode === 'b2c') {
        navigate('/b2c/dashboard');
      } else if (userMode === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else if (userMode === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 1) / totalSteps) * 100);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription>
            Configurons votre compte {userMode && getUserModeDisplayName(userMode)}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="py-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Vos informations personnelles</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Votre nom" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Date de naissance</Label>
                  <Input id="birthdate" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <RadioGroup defaultValue="autre">
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center space-x-2">
                        <Radio value="homme" id="homme" />
                        <Label htmlFor="homme">Homme</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Radio value="femme" id="femme" />
                        <Label htmlFor="femme">Femme</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Radio value="autre" id="autre" />
                        <Label htmlFor="autre">Autre / Préfère ne pas préciser</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Vos préférences</h2>
              <div className="space-y-4">
                {userMode === 'b2c' && (
                  <div className="space-y-2">
                    <Label>Qu'espérez-vous améliorer avec EmotionsCare ?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Gestion du stress', 'Qualité du sommeil', 'Concentration', 'Énergie', 'Humeur', 'Créativité'].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox id={item} />
                          <Label htmlFor={item}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                  <div className="space-y-2">
                    <Label>Quels aspects du bien-être au travail vous intéressent ?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Réduction du stress', 'Équilibre vie pro/perso', 'Productivité', 'Cohésion d\'équipe', 'Prévention burnout', 'Motivation'].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox id={item} />
                          <Label htmlFor={item}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="musicPreference">Préférences musicales</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez vos préférences musicales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classique">Classique</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="ambiant">Ambiant / Électronique</SelectItem>
                      <SelectItem value="nature">Sons de la nature</SelectItem>
                      <SelectItem value="tout">Tous styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Vos objectifs</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>À quelle fréquence souhaitez-vous utiliser l'application ?</Label>
                  <RadioGroup defaultValue="quotidien">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Radio value="quotidien" id="quotidien" />
                        <Label htmlFor="quotidien">Quotidiennement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Radio value="hebdomadaire" id="hebdomadaire" />
                        <Label htmlFor="hebdomadaire">Plusieurs fois par semaine</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Radio value="occasionnel" id="occasionnel" />
                        <Label htmlFor="occasionnel">Occasionnellement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Radio value="besoin" id="besoin" />
                        <Label htmlFor="besoin">Selon les besoins</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Quel est votre objectif principal ?</Label>
                  <Select>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Sélectionnez un objectif" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stress">Réduire mon stress</SelectItem>
                      <SelectItem value="sommeil">Améliorer mon sommeil</SelectItem>
                      <SelectItem value="productivite">Augmenter ma productivité</SelectItem>
                      <SelectItem value="creativite">Stimuler ma créativité</SelectItem>
                      <SelectItem value="humeur">Stabiliser mon humeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Notifications et préférences</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quand souhaitez-vous recevoir des rappels ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Matin', 'Midi', 'Après-midi', 'Soir', 'Week-end', 'Jamais'].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox id={time} />
                        <Label htmlFor={time}>{time}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Types de notifications</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reminder" defaultChecked />
                      <Label htmlFor="reminder">Rappels de session</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="insights" defaultChecked />
                      <Label htmlFor="insights">Insights et recommandations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="updates" />
                      <Label htmlFor="updates">Mises à jour et nouvelles fonctionnalités</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Retour
          </Button>
          <Button onClick={handleNext}>
            {step < totalSteps ? "Continuer" : "Terminer"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
