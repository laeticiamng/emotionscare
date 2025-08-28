import React, { useEffect } from 'react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { StepWelcome } from '@/components/onboarding/StepWelcome';
import { StepProfile } from '@/components/onboarding/StepProfile';
import { StepGoals } from '@/components/onboarding/StepGoals';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useRouter } from '@/hooks/useRouter';

// Lazy load steps to improve initial load time
const StepSensors = React.lazy(() => import('@/components/onboarding/StepSensors'));
const StepNotifications = React.lazy(() => import('@/components/onboarding/StepNotifications'));
const StepSummary = React.lazy(() => import('@/components/onboarding/StepSummary'));

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const {
    step,
    completed,
    loading,
    error,
    profileDraft,
    goalsDraft,
    sensorsDraft,
    start,
    saveProfile,
    saveGoals,
    saveSensors,
    enableNotifications,
    complete,
    skip,
    next,
    prev,
  } = useOnboarding();

  // Redirect if already completed
  useEffect(() => {
    if (completed) {
      router.push('/dashboard');
    }
  }, [completed, router]);

  // Handle skip to dashboard
  const handleSkip = () => {
    skip();
    router.push('/dashboard');
  };

  // Handle completion and redirect
  const handleComplete = async () => {
    const success = await complete();
    if (success) {
      router.push('/dashboard');
    }
  };

  // Handle profile save and advance
  const handleProfileSubmit = async (profile: typeof profileDraft) => {
    const success = await saveProfile(profile);
    if (success) {
      next();
    }
    return success;
  };

  // Handle goals save and advance
  const handleGoalsSubmit = async (goals: typeof goalsDraft) => {
    const success = await saveGoals(goals);
    if (success) {
      next();
    }
    return success;
  };

  // Handle sensors save and advance
  const handleSensorsSubmit = async (sensors: typeof sensorsDraft) => {
    const success = await saveSensors(sensors);
    if (success) {
      next();
    }
    return success;
  };

  if (loading && step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Show stepper except for welcome step */}
        {step > 0 && <OnboardingStepper currentStep={step} />}

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Step content */}
        <div className="mb-8">
          {step === 0 && (
            <StepWelcome 
              onNext={step === 0 ? () => { start(); next(); } : next}
              onSkip={handleSkip}
            />
          )}

          {step === 1 && (
            <StepProfile
              onSubmit={handleProfileSubmit}
              onBack={prev}
              initialData={profileDraft}
            />
          )}

          {step === 2 && (
            <StepGoals
              onSubmit={handleGoalsSubmit}
              onBack={prev}
              initialData={goalsDraft}
            />
          )}

          {step === 3 && (
            <React.Suspense 
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              }
            >
              <StepSensors
                onSubmit={handleSensorsSubmit}
                onBack={prev}
                initialData={sensorsDraft}
              />
            </React.Suspense>
          )}

          {step === 4 && (
            <React.Suspense 
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              }
            >
              <StepNotifications
                onNext={next}
                onBack={prev}
                onEnable={enableNotifications}
              />
            </React.Suspense>
          )}

          {step === 5 && (
            <React.Suspense 
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              }
            >
              <StepSummary
                onFinish={handleComplete}
                onBack={prev}
              />
            </React.Suspense>
          )}
        </div>

        {/* Skip option (always available) */}
        {step > 0 && step < 5 && (
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Passer l'introduction et aller au tableau de bord
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default OnboardingPage;