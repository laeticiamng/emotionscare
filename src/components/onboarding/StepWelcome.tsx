// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, ArrowRight, SkipForward, Users, Star, Shield, 
  Clock, Heart, CheckCircle, Quote, ChevronLeft, ChevronRight,
  Brain, Music, BookOpen, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

const PLATFORM_STATS = {
  users: 12500,
  scansPerDay: 8700,
  satisfactionRate: 96,
  countries: 24
};

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marie L.',
    role: 'Professeur de yoga',
    text: 'EmotionsCare m\'aide à mieux comprendre mes émotions au quotidien.',
    rating: 5,
    avatar: '🧘‍♀️'
  },
  {
    id: 2,
    name: 'Thomas D.',
    role: 'Entrepreneur',
    text: 'Les exercices de respiration m\'ont transformé. Je gère beaucoup mieux mon stress.',
    rating: 5,
    avatar: '💼'
  },
  {
    id: 3,
    name: 'Sophie M.',
    role: 'Étudiante',
    text: 'Le journal émotionnel est devenu mon meilleur allié pendant les examens.',
    rating: 5,
    avatar: '📚'
  }
];

const FEATURES_PREVIEW = [
  { icon: Brain, label: 'Analyse émotionnelle', color: 'from-purple-500 to-pink-500' },
  { icon: Music, label: 'Musique thérapeutique', color: 'from-blue-500 to-cyan-500' },
  { icon: BookOpen, label: 'Journal bien-être', color: 'from-amber-500 to-orange-500' },
  { icon: Activity, label: 'Suivi personnalisé', color: 'from-green-500 to-emerald-500' }
];

export const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext, onSkip }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);

  // Animate user count
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = PLATFORM_STATS.users / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= PLATFORM_STATS.users) {
        setAnimatedUsers(PLATFORM_STATS.users);
        clearInterval(timer);
      } else {
        setAnimatedUsers(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show features after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const nextTestimonial = () => setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentTestimonial(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <Card className="max-w-lg mx-auto overflow-hidden">
      <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Bienvenue sur EmotionsCare 👋</h1>
          <p className="text-muted-foreground mt-2">
            Votre compagnon pour le bien-être émotionnel
          </p>
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Platform stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-4 gap-2 text-center"
        >
          <div className="p-2">
            <div className="text-xl font-bold text-primary">
              {animatedUsers.toLocaleString()}+
            </div>
            <div className="text-[10px] text-muted-foreground">Utilisateurs</div>
          </div>
          <div className="p-2">
            <div className="text-xl font-bold text-green-500">{PLATFORM_STATS.satisfactionRate}%</div>
            <div className="text-[10px] text-muted-foreground">Satisfaction</div>
          </div>
          <div className="p-2">
            <div className="text-xl font-bold text-blue-500">{PLATFORM_STATS.scansPerDay.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">Scans/jour</div>
          </div>
          <div className="p-2">
            <div className="text-xl font-bold text-amber-500">{PLATFORM_STATS.countries}</div>
            <div className="text-[10px] text-muted-foreground">Pays</div>
          </div>
        </motion.div>

        {/* Features preview */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-2"
            >
              {FEATURES_PREVIEW.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center gap-2`}
                  style={{ background: `linear-gradient(135deg, var(--primary) 0%, transparent 100%)`, opacity: 0.1 }}
                >
                  <div className="p-1.5 rounded-md bg-background/80">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonial carousel */}
        <div className="relative">
          <div className="bg-muted/30 rounded-xl p-4">
            <Quote className="h-5 w-5 text-primary/40 mb-2" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm italic mb-3">
                  "{TESTIMONIALS[currentTestimonial].text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{TESTIMONIALS[currentTestimonial].avatar}</span>
                    <div>
                      <div className="text-sm font-medium">{TESTIMONIALS[currentTestimonial].name}</div>
                      <div className="text-xs text-muted-foreground">{TESTIMONIALS[currentTestimonial].role}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevTestimonial}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx === currentTestimonial ? 'bg-primary' : 'bg-primary/30'
                  }`}
                />
              ))}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextTestimonial}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>2 min</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Données privées</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Modifiable</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onNext}
              className="w-full h-12 text-base"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Commencer la personnalisation
            </Button>
          </motion.div>
          
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="w-full"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer l'introduction
          </Button>
        </div>

        {/* Progress hint */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Étape 1 sur 5</span>
            <span>20%</span>
          </div>
          <Progress value={20} className="h-1" />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Tu peux modifier ces réglages à tout moment dans les paramètres
        </p>
      </CardContent>
    </Card>
  );
};
