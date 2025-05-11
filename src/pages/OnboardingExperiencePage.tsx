
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OnboardingExperiencePage: React.FC = () => {
  const onboarding = useOnboarding();
  const navigate = useNavigate();
  
  // Use properties from the onboarding context correctly
  const currentStep = onboarding.currentStep;
  const loading = onboarding.loading || false;
  const emotion = onboarding.emotion || '';
  const intensity = onboarding.intensity || 0;
  const userResponses = onboarding.userResponses || {};
  
  const nextStep = onboarding.nextStep;
  const previousStep = onboarding.previousStep;
  const handleResponse = onboarding.handleResponse;
  
  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4">Onboarding Experience</h1>
          
          <p className="mb-6">
            Step {currentStep + 1} of {onboarding.steps.length}
          </p>
          
          {/* Current step content would go here */}
          <div className="mb-8">
            {onboarding.steps[currentStep]?.title && (
              <h2 className="text-xl font-semibold mb-4">{onboarding.steps[currentStep].title}</h2>
            )}
            {onboarding.steps[currentStep]?.content}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={async () => {
                const success = await onboarding.completeOnboarding();
                if (success) {
                  navigate('/dashboard');
                }
              }}
            >
              {currentStep === onboarding.steps.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingExperiencePage;
