import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Sparkles, Check } from 'lucide-react';

interface PostLoginTransitionProps {
  onComplete?: () => void;
}

export const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Authentification réussie", icon: Check },
    { label: "Chargement de votre profil", icon: Heart },
    { label: "Préparation de votre espace", icon: Sparkles },
    { label: "Redirection vers votre dashboard", icon: Heart }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
            navigate('/app/consumer/home');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [navigate, onComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bienvenue !
            </h2>
            <p className="text-muted-foreground mt-2">
              Nous préparons votre espace personnel...
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                {progress}%
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : isCompleted 
                        ? 'text-green-600' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-blue-100' 
                        : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="ml-auto">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};