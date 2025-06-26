
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Users, 
  Brain,
  Music,
  Scan,
  MessageSquare,
  Gamepad2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Étape 1: Bienvenue (pas de données)
    
    // Étape 2: Objectifs
    primaryGoals: [] as string[],
    specificChallenges: '',
    
    // Étape 3: Préférences
    preferredActivities: [] as string[],
    notificationTiming: 'morning',
    sessionFrequency: 'daily',
    
    // Étape 4: Profil personnel
    wellnessExperience: 'beginner',
    stressLevel: '5',
    workEnvironment: '',
    
    // Étape 5: Personnalisation
    favoriteThemes: [] as string[],
    musicPreferences: [] as string[],
    privacySettings: {
      shareProgress: false,
      anonymousStats: true,
      personalizedTips: true
    }
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateArrayField = (key: string, value: string) => {
    const currentArray = formData[key as keyof typeof formData] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(key, newArray);
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue sur EmotionsCare',
      subtitle: 'Votre voyage vers le bien-être émotionnel commence ici',
      icon: <Heart className="h-12 w-12 text-pink-500" />,
      component: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Bienvenue {user?.user_metadata?.name || 'sur EmotionsCare'} !</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Nous sommes ravis de vous accompagner dans votre parcours de bien-être émotionnel. 
              Ce guide vous aidera à personnaliser votre expérience pour qu'elle soit parfaitement adaptée à vos besoins.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: <Scan className="h-6 w-6" />, label: 'Scanner émotionnel' },
              { icon: <Music className="h-6 w-6" />, label: 'Musicothérapie' },
              { icon: <MessageSquare className="h-6 w-6" />, label: 'Coach IA' },
              { icon: <Gamepad2 className="h-6 w-6" />, label: 'Gamification' }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-blue-500 mb-2">{feature.icon}</div>
                <span className="text-sm font-medium text-center">{feature.label}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Cela ne prendra que quelques minutes pour configurer votre profil optimal.
          </p>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Vos objectifs de bien-être',
      subtitle: 'Que souhaitez-vous améliorer en priorité ?',
      icon: <Target className="h-12 w-12 text-blue-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Définissons vos objectifs</h3>
            <p className="text-muted-foreground">
              Sélectionnez les domaines dans lesquels vous aimeriez voir des améliorations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Réduire le stress et l\'anxiété',
              'Améliorer la gestion des émotions',
              'Développer la confiance en soi',
              'Mieux gérer les relations sociales',
              'Améliorer la concentration',
              'Développer la résilience',
              'Équilibrer vie pro/perso',
              'Améliorer le sommeil'
            ].map((goal) => (
              <div
                key={goal}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  formData.primaryGoals.includes(goal) 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateArrayField('primaryGoals', goal)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal}</span>
                  {formData.primaryGoals.includes(goal) && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenges">Défis spécifiques (optionnel)</Label>
            <Textarea
              id="challenges"
              placeholder="Décrivez brièvement vos défis actuels ou ce que vous aimeriez travailler..."
              value={formData.specificChallenges}
              onChange={(e) => updateFormData('specificChallenges', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Vos préférences',
      subtitle: 'Comment préférez-vous prendre soin de votre bien-être ?',
      icon: <Sparkles className="h-12 w-12 text-purple-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <Sparkles className="h-16 w-16 mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personnalisons votre expérience</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Activités préférées</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'meditation', label: 'Méditation', icon: <Brain className="h-5 w-5" /> },
                  { id: 'music', label: 'Musique', icon: <Music className="h-5 w-5" /> },
                  { id: 'breathing', label: 'Exercices de respiration', icon: <Heart className="h-5 w-5" /> },
                  { id: 'journal', label: 'Journal émotionnel', icon: <MessageSquare className="h-5 w-5" /> },
                  { id: 'vr', label: 'Réalité virtuelle', icon: <Sparkles className="h-5 w-5" /> },
                  { id: 'games', label: 'Mini-jeux', icon: <Gamepad2 className="h-5 w-5" /> }
                ].map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.preferredActivities.includes(activity.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => updateArrayField('preferredActivities', activity.id)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-purple-500">{activity.icon}</div>
                      <span className="text-sm font-medium text-center">{activity.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Moment préféré pour les notifications</Label>
                <RadioGroup 
                  value={formData.notificationTiming} 
                  onValueChange={(value) => updateFormData('notificationTiming', value)}
                >
                  {[
                    { value: 'morning', label: 'Matin (8h-12h)' },
                    { value: 'afternoon', label: 'Après-midi (12h-18h)' },
                    { value: 'evening', label: 'Soir (18h-22h)' },
                    { value: 'custom', label: 'Personnalisé' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">Fréquence souhaitée</Label>
                <RadioGroup 
                  value={formData.sessionFrequency} 
                  onValueChange={(value) => updateFormData('sessionFrequency', value)}
                >
                  {[
                    { value: 'daily', label: 'Quotidien' },
                    { value: 'frequent', label: 'Plusieurs fois par semaine' },
                    { value: 'weekly', label: 'Hebdomadaire' },
                    { value: 'flexible', label: 'Flexible' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Votre profil bien-être',
      subtitle: 'Aidez-nous à mieux vous comprendre',
      icon: <Users className="h-12 w-12 text-green-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Parlez-nous de vous</h3>
            <p className="text-muted-foreground">
              Ces informations nous aident à personnaliser vos recommandations
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Expérience avec le bien-être</Label>
              <RadioGroup 
                value={formData.wellnessExperience} 
                onValueChange={(value) => updateFormData('wellnessExperience', value)}
              >
                {[
                  { value: 'beginner', label: 'Débutant - Je découvre ces pratiques' },
                  { value: 'intermediate', label: 'Intermédiaire - J\'ai quelques bases' },
                  { value: 'advanced', label: 'Avancé - Je pratique régulièrement' },
                  { value: 'expert', label: 'Expert - Je maîtrise plusieurs techniques' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-3 block">
                Niveau de stress actuel (1 = très faible, 10 = très élevé)
              </Label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => updateFormData('stressLevel', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Très faible</span>
                  <Badge variant="outline" className="font-medium">
                    Niveau: {formData.stressLevel}/10
                  </Badge>
                  <span>Très élevé</span>
                </div>
              </div>
            </div>
            
            {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
              <div>
                <Label htmlFor="workEnv" className="text-base font-medium">
                  Environnement de travail (optionnel)
                </Label>
                <Textarea
                  id="workEnv"
                  placeholder="Décrivez votre environnement de travail et les défis professionnels..."
                  value={formData.workEnvironment}
                  onChange={(e) => updateFormData('workEnvironment', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'personalization',
      title: 'Dernières touches',
      subtitle: 'Personnalisez votre expérience',
      icon: <Sparkles className="h-12 w-12 text-yellow-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <Sparkles className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Finalisez votre profil</h3>
            <p className="text-muted-foreground">
              Derniers réglages pour une expérience sur mesure
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Thèmes visuels préférés</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Nature',
                  'Océan',
                  'Montagne',
                  'Espace',
                  'Minimaliste',
                  'Zen',
                  'Coloré',
                  'Sombre'
                ].map((theme) => (
                  <div
                    key={theme}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      formData.favoriteThemes.includes(theme)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateArrayField('favoriteThemes', theme)}
                  >
                    <span className="text-sm font-medium">{theme}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-3 block">Genres musicaux préférés</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Ambient',
                  'Classique',
                  'Nature',
                  'Binaurale',
                  'Jazz',
                  'World Music'
                ].map((genre) => (
                  <div
                    key={genre}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      formData.musicPreferences.includes(genre)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateArrayField('musicPreferences', genre)}
                  >
                    <span className="text-sm font-medium">{genre}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-3 block">Préférences de confidentialité</Label>
              <div className="space-y-3">
                {[
                  { 
                    key: 'shareProgress', 
                    label: 'Partager mes progrès avec l\'équipe (anonymisé)',
                    desc: 'Contribuer aux statistiques d\'équipe de manière anonyme'
                  },
                  { 
                    key: 'anonymousStats', 
                    label: 'Contribuer aux statistiques anonymes',
                    desc: 'Aider à améliorer l\'application pour tous'
                  },
                  { 
                    key: 'personalizedTips', 
                    label: 'Recevoir des conseils personnalisés',
                    desc: 'Recommandations basées sur votre utilisation'
                  }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={setting.key}
                      checked={formData.privacySettings[setting.key as keyof typeof formData.privacySettings]}
                      onCheckedChange={(checked) => 
                        updateFormData('privacySettings', {
                          ...formData.privacySettings,
                          [setting.key]: checked
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor={setting.key} className="font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{setting.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    toast({
      title: "Configuration terminée !",
      description: "Votre profil a été créé avec succès. Bienvenue sur EmotionsCare !"
    });
    
    // Rediriger vers le dashboard approprié
    switch (userMode) {
      case 'b2c':
        navigate('/b2c/dashboard');
        break;
      case 'b2b_user':
        navigate('/b2b/user/dashboard');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="font-semibold text-lg">EmotionsCare</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="mb-4">{steps[currentStep].icon}</div>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                {steps[currentStep].component}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 scale-125'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {currentStep === steps.length - 1 ? (
            <Button onClick={completeOnboarding} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Terminer
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
