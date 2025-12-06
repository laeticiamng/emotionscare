// @ts-nocheck

// @ts-nocheck
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface OnboardingQuizStepProps {
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  stepId: string;
}

const OnboardingQuizStep: React.FC<OnboardingQuizStepProps> = ({
  question,
  options,
  stepId
}) => {
  const { updateResponse, userResponses } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userResponses[stepId] ? userResponses[stepId].optionId : null
  );
  const [showFeedback, setShowFeedback] = useState(!!userResponses[stepId]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const selectedOption = options.find(option => option.id === optionId);
    
    if (selectedOption) {
      updateResponse(stepId, {
        optionId,
        isCorrect: selectedOption.isCorrect,
        timestamp: new Date().toISOString()
      });
      setShowFeedback(true);
    }
  };

  const isCorrect = selectedOption 
    ? options.find(o => o.id === selectedOption)?.isCorrect 
    : null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{question}</h3>
      
      <RadioGroup 
        value={selectedOption || ""}
        onValueChange={handleOptionSelect}
        className="space-y-3"
      >
        {options.map(option => (
          <div 
            key={option.id} 
            className={`
              flex items-center space-x-2 p-3 rounded-md border
              ${selectedOption === option.id && showFeedback
                ? option.isCorrect 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                  : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                : 'border-gray-200 dark:border-gray-800'
              }
              transition-colors
            `}
          >
            <RadioGroupItem 
              value={option.id} 
              id={option.id}
              disabled={showFeedback}
              className={
                selectedOption === option.id && showFeedback && option.isCorrect
                  ? "text-green-500 border-green-500"
                  : ""
              }
            />
            <Label 
              htmlFor={option.id} 
              className={`
                flex-grow cursor-pointer 
                ${selectedOption === option.id && showFeedback && option.isCorrect
                  ? "text-green-700 dark:text-green-300"
                  : selectedOption === option.id && showFeedback
                    ? "text-red-700 dark:text-red-300"
                    : ""
                }
              `}
            >
              {option.text}
            </Label>
            
            {selectedOption === option.id && showFeedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {option.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </motion.div>
            )}
          </div>
        ))}
      </RadioGroup>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Alert variant={isCorrect ? "success" : "destructive"}>
            <AlertTitle>
              {isCorrect 
                ? "Bonne réponse !" 
                : "Ce n'est pas la bonne réponse"}
            </AlertTitle>
            <AlertDescription>
              {isCorrect 
                ? "Excellent ! Vous avez bien compris ce principe important." 
                : "La bonne réponse est : " + options.find(o => o.isCorrect)?.text}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingQuizStep;
